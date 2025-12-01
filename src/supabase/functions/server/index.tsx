import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import * as kv from './kv_store.tsx';
import { createClient } from 'npm:@supabase/supabase-js@2';

const app = new Hono();

app.use('*', cors());
app.use('*', logger(console.log));

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

// Initialize default data
async function initializeDefaults() {
  try {
    // Check if categories exist
    const existingCategories = await kv.get('categories');
    if (!existingCategories) {
      const defaultCategories = [
        { id: 'imitation', name: 'Imitation', description: 'Beautiful imitation jewellery' },
        { id: 'statement', name: 'Statement', description: 'Bold statement pieces' },
        { id: 'minimalist', name: 'Minimalist', description: 'Elegant minimalist designs' },
        { id: 'polki', name: 'Polki', description: 'Traditional Polki jewellery' },
        { id: 'kundan', name: 'Kundan', description: 'Exquisite Kundan pieces' },
        { id: 'temple', name: 'Temple', description: 'Sacred temple jewellery' }
      ];
      await kv.set('categories', defaultCategories);
    }

    // Check if settings exist
    const existingSettings = await kv.get('settings');
    if (!existingSettings) {
      const defaultSettings = {
        siteName: 'RIVAYA JEWELLERY',
        tagline: 'Where Elegance Whispers',
        contactEmail: 'info@rivayajewellery.com',
        contactPhone: '+91 9876543210',
        whatsapp: '+919876543210',
        address: 'Mumbai, Maharashtra, India',
        shippingCharges: 50,
        freeShippingAbove: 1000,
        razorpayKeyId: '',
        razorpayKeySecret: '',
        enableCOD: true,
        banners: []
      };
      await kv.set('settings', defaultSettings);
    }

    // Check if admin credentials exist
    const existingAdmin = await kv.get('admin:credentials');
    if (!existingAdmin) {
      // Default admin credentials (CHANGE THESE!)
      await kv.set('admin:credentials', {
        username: 'admin',
        password: 'admin123' // In production, use hashed passwords
      });
    }

    console.log('Defaults initialized successfully');
  } catch (error) {
    console.error('Error initializing defaults:', error);
  }
}

// Initialize on server start
initializeDefaults();

// ===== PUBLIC ROUTES =====

// Get all products (with optional filters)
app.get('/make-server-2d8c11ce/api/products', async (c) => {
  try {
    const { category, minPrice, maxPrice, sort } = c.req.query();

    let products = await kv.getByPrefix('product:');

    // Filter by category
    if (category && category !== 'all') {
      products = products.filter((p: any) => p.category === category);
    }

    // Filter by price
    if (minPrice) {
      products = products.filter((p: any) => p.price >= parseFloat(minPrice));
    }
    if (maxPrice) {
      products = products.filter((p: any) => p.price <= parseFloat(maxPrice));
    }

    // Filter active products only
    products = products.filter((p: any) => p.active !== false);

    // Sort
    if (sort === 'price-asc') {
      products.sort((a: any, b: any) => a.price - b.price);
    } else if (sort === 'price-desc') {
      products.sort((a: any, b: any) => b.price - a.price);
    } else if (sort === 'newest') {
      products.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return c.json({ success: true, products });
  } catch (error) {
    console.error('Error fetching products:', error);
    return c.json({ success: false, error: 'Failed to fetch products' }, 500);
  }
});

// Get single product
app.get('/make-server-2d8c11ce/api/products/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const product = await kv.get(`product:${id}`);

    if (!product) {
      return c.json({ success: false, error: 'Product not found' }, 404);
    }

    return c.json({ success: true, product });
  } catch (error) {
    console.error('Error fetching product:', error);
    return c.json({ success: false, error: 'Failed to fetch product' }, 500);
  }
});

// Get categories
app.get('/make-server-2d8c11ce/api/categories', async (c) => {
  try {
    const categories = await kv.get('categories') || [];
    return c.json({ success: true, categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return c.json({ success: false, error: 'Failed to fetch categories' }, 500);
  }
});

// Get settings
app.get('/make-server-2d8c11ce/api/settings', async (c) => {
  try {
    const settings = await kv.get('settings') || {};
    // Don't expose Razorpay secret key
    const publicSettings = { ...settings };
    delete publicSettings.razorpayKeySecret;
    return c.json({ success: true, settings: publicSettings });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return c.json({ success: false, error: 'Failed to fetch settings' }, 500);
  }
});

// Validate coupon
app.post('/make-server-2d8c11ce/api/coupons/validate', async (c) => {
  try {
    const { code, cartTotal } = await c.req.json();
    const coupon = await kv.get(`coupon:${code.toUpperCase()}`);

    if (!coupon) {
      return c.json({ success: false, error: 'Invalid coupon code' }, 404);
    }

    // Check if expired
    if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
      return c.json({ success: false, error: 'Coupon has expired' }, 400);
    }

    // Check minimum order value
    if (coupon.minOrderValue && cartTotal < coupon.minOrderValue) {
      return c.json({
        success: false,
        error: `Minimum order value of ₹${coupon.minOrderValue} required`
      }, 400);
    }

    // Calculate discount
    let discount = 0;
    if (coupon.type === 'percentage') {
      discount = (cartTotal * coupon.value) / 100;
      if (coupon.maxDiscount) {
        discount = Math.min(discount, coupon.maxDiscount);
      }
    } else {
      discount = coupon.value;
    }

    return c.json({ success: true, discount, coupon });
  } catch (error) {
    console.error('Error validating coupon:', error);
    return c.json({ success: false, error: 'Failed to validate coupon' }, 500);
  }
});

// Create order
app.post('/make-server-2d8c11ce/api/orders', async (c) => {
  try {
    const orderData = await c.req.json();

    // Generate order ID
    const orderId = `ORD${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    const order = {
      id: orderId,
      ...orderData,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await kv.set(`order:${orderId}`, order);

    return c.json({ success: true, order });
  } catch (error) {
    console.error('Error creating order:', error);
    return c.json({ success: false, error: 'Failed to create order' }, 500);
  }
});

// Get order by ID
app.get('/make-server-2d8c11ce/api/orders/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const order = await kv.get(`order:${id}`);

    if (!order) {
      return c.json({ success: false, error: 'Order not found' }, 404);
    }

    return c.json({ success: true, order });
  } catch (error) {
    console.error('Error fetching order:', error);
    return c.json({ success: false, error: 'Failed to fetch order' }, 500);
  }
});

// ===== ADMIN ROUTES =====

// Admin login
app.post('/make-server-2d8c11ce/api/admin/login', async (c) => {
  try {
    const { username, password } = await c.req.json();
    const credentials = await kv.get('admin:credentials');

    if (credentials && credentials.username === username && credentials.password === password) {
      // In production, generate a proper JWT token
      const token = `admin_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      await kv.set(`admin:session:${token}`, { username, loginAt: new Date().toISOString() });

      return c.json({ success: true, token });
    }

    return c.json({ success: false, error: 'Invalid credentials' }, 401);
  } catch (error) {
    console.error('Error during admin login:', error);
    return c.json({ success: false, error: 'Login failed' }, 500);
  }
});

// Middleware to verify admin token
async function verifyAdmin(token: string) {
  if (!token) return false;
  const session = await kv.get(`admin:session:${token}`);
  return !!session;
}

// Get all orders (admin)
app.get('/make-server-2d8c11ce/api/admin/orders', async (c) => {
  try {
    const token = c.req.header('x-admin-token');
    if (!await verifyAdmin(token)) {
      return c.json({ success: false, error: 'Unauthorized' }, 401);
    }

    let orders = await kv.getByPrefix('order:');
    orders.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return c.json({ success: true, orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return c.json({ success: false, error: 'Failed to fetch orders' }, 500);
  }
});

// Update order status (admin)
app.put('/make-server-2d8c11ce/api/admin/orders/:id', async (c) => {
  try {
    const token = c.req.header('x-admin-token');
    if (!await verifyAdmin(token)) {
      return c.json({ success: false, error: 'Unauthorized' }, 401);
    }

    const id = c.req.param('id');
    const updates = await c.req.json();

    const order = await kv.get(`order:${id}`);
    if (!order) {
      return c.json({ success: false, error: 'Order not found' }, 404);
    }

    const updatedOrder = {
      ...order,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    await kv.set(`order:${id}`, updatedOrder);

    return c.json({ success: true, order: updatedOrder });
  } catch (error) {
    console.error('Error updating order:', error);
    return c.json({ success: false, error: 'Failed to update order' }, 500);
  }
});

// Create product (admin)
app.post('/make-server-2d8c11ce/api/admin/products', async (c) => {
  try {
    const token = c.req.header('x-admin-token');
    if (!await verifyAdmin(token)) {
      return c.json({ success: false, error: 'Unauthorized' }, 401);
    }

    const productData = await c.req.json();
    const productId = `PRD${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    const product = {
      id: productId,
      ...productData,
      active: productData.active !== false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await kv.set(`product:${productId}`, product);

    return c.json({ success: true, product });
  } catch (error) {
    console.error('Error creating product:', error);
    return c.json({ success: false, error: 'Failed to create product' }, 500);
  }
});

// Update product (admin)
app.put('/make-server-2d8c11ce/api/admin/products/:id', async (c) => {
  try {
    const token = c.req.header('x-admin-token');
    if (!await verifyAdmin(token)) {
      return c.json({ success: false, error: 'Unauthorized' }, 401);
    }

    const id = c.req.param('id');
    const updates = await c.req.json();

    const product = await kv.get(`product:${id}`);
    if (!product) {
      return c.json({ success: false, error: 'Product not found' }, 404);
    }

    const updatedProduct = {
      ...product,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    await kv.set(`product:${id}`, updatedProduct);

    return c.json({ success: true, product: updatedProduct });
  } catch (error) {
    console.error('Error updating product:', error);
    return c.json({ success: false, error: 'Failed to update product' }, 500);
  }
});

// Delete product (admin)
app.delete('/make-server-2d8c11ce/api/admin/products/:id', async (c) => {
  try {
    const token = c.req.header('x-admin-token');
    if (!await verifyAdmin(token)) {
      return c.json({ success: false, error: 'Unauthorized' }, 401);
    }

    const id = c.req.param('id');
    await kv.del(`product:${id}`);

    return c.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    return c.json({ success: false, error: 'Failed to delete product' }, 500);
  }
});

// Create/Update categories (admin)
app.post('/make-server-2d8c11ce/api/admin/categories', async (c) => {
  try {
    const token = c.req.header('x-admin-token');
    if (!await verifyAdmin(token)) {
      return c.json({ success: false, error: 'Unauthorized' }, 401);
    }

    const { categories } = await c.req.json();
    await kv.set('categories', categories);

    return c.json({ success: true, categories });
  } catch (error) {
    console.error('Error updating categories:', error);
    return c.json({ success: false, error: 'Failed to update categories' }, 500);
  }
});

// Create coupon (admin)
app.post('/make-server-2d8c11ce/api/admin/coupons', async (c) => {
  try {
    const token = c.req.header('x-admin-token');
    if (!await verifyAdmin(token)) {
      return c.json({ success: false, error: 'Unauthorized' }, 401);
    }

    const couponData = await c.req.json();
    const code = couponData.code.toUpperCase();

    const coupon = {
      code,
      ...couponData,
      createdAt: new Date().toISOString()
    };

    await kv.set(`coupon:${code}`, coupon);

    return c.json({ success: true, coupon });
  } catch (error) {
    console.error('Error creating coupon:', error);
    return c.json({ success: false, error: 'Failed to create coupon' }, 500);
  }
});

// Get all coupons (admin)
app.get('/make-server-2d8c11ce/api/admin/coupons', async (c) => {
  try {
    const token = c.req.header('x-admin-token');
    if (!await verifyAdmin(token)) {
      return c.json({ success: false, error: 'Unauthorized' }, 401);
    }

    const coupons = await kv.getByPrefix('coupon:');
    return c.json({ success: true, coupons });
  } catch (error) {
    console.error('Error fetching coupons:', error);
    return c.json({ success: false, error: 'Failed to fetch coupons' }, 500);
  }
});

// Delete coupon (admin)
app.delete('/make-server-2d8c11ce/api/admin/coupons/:code', async (c) => {
  try {
    const token = c.req.header('x-admin-token');
    if (!await verifyAdmin(token)) {
      return c.json({ success: false, error: 'Unauthorized' }, 401);
    }

    const code = c.req.param('code').toUpperCase();
    await kv.del(`coupon:${code}`);

    return c.json({ success: true });
  } catch (error) {
    console.error('Error deleting coupon:', error);
    return c.json({ success: false, error: 'Failed to delete coupon' }, 500);
  }
});

// Update settings (admin)
app.put('/make-server-2d8c11ce/api/admin/settings', async (c) => {
  try {
    const token = c.req.header('x-admin-token');
    if (!await verifyAdmin(token)) {
      return c.json({ success: false, error: 'Unauthorized' }, 401);
    }

    const settings = await c.req.json();
    await kv.set('settings', settings);

    return c.json({ success: true, settings });
  } catch (error) {
    console.error('Error updating settings:', error);
    return c.json({ success: false, error: 'Failed to update settings' }, 500);
  }
});

// Get dashboard stats (admin)
app.get('/make-server-2d8c11ce/api/admin/stats', async (c) => {
  try {
    const token = c.req.header('x-admin-token');
    if (!await verifyAdmin(token)) {
      return c.json({ success: false, error: 'Unauthorized' }, 401);
    }

    const products = await kv.getByPrefix('product:');
    const orders = await kv.getByPrefix('order:');

    const totalProducts = products.length;
    const totalOrders = orders.length;
    const pendingOrders = orders.filter((o: any) => o.status === 'pending').length;
    const totalRevenue = orders
      .filter((o: any) => o.status !== 'cancelled')
      .reduce((sum: number, o: any) => sum + (o.total || 0), 0);

    return c.json({
      success: true,
      stats: {
        totalProducts,
        totalOrders,
        pendingOrders,
        totalRevenue
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return c.json({ success: false, error: 'Failed to fetch stats' }, 500);
  }
});

// Admin logout
app.post('/make-server-2d8c11ce/api/admin/logout', async (c) => {
  try {
    const token = c.req.header('x-admin-token');
    if (token) {
      await kv.del(`admin:session:${token}`);
    }
    return c.json({ success: true });
  } catch (error) {
    console.error('Error during logout:', error);
    return c.json({ success: false, error: 'Logout failed' }, 500);
  }
});

Deno.serve(app.fetch);
