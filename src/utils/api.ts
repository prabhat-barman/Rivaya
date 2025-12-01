import { projectId, publicAnonKey } from './supabase/info';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-2d8c11ce/api`;

export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE}${endpoint}`;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${publicAnonKey}`,
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Request failed');
  }

  return data;
}

// Public APIs
export const productsAPI = {
  getAll: (filters?: { category?: string; minPrice?: number; maxPrice?: number; sort?: string }) => {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.minPrice) params.append('minPrice', filters.minPrice.toString());
    if (filters?.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
    if (filters?.sort) params.append('sort', filters.sort);

    const query = params.toString() ? `?${params.toString()}` : '';
    return apiRequest(`/products${query}`);
  },

  getById: (id: string) => apiRequest(`/products/${id}`),
};

export const categoriesAPI = {
  getAll: () => apiRequest('/categories'),
};

export const settingsAPI = {
  get: () => apiRequest('/settings'),
};

export const couponsAPI = {
  validate: (code: string, cartTotal: number) =>
    apiRequest('/coupons/validate', {
      method: 'POST',
      body: JSON.stringify({ code, cartTotal }),
    }),
};

export const ordersAPI = {
  create: (orderData: any) =>
    apiRequest('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    }),

  getById: (id: string) => apiRequest(`/orders/${id}`),
};

// Admin APIs
export const adminAPI = {
  login: (username: string, password: string) =>
    apiRequest('/admin/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),

  logout: (token: string) =>
    apiRequest('/admin/logout', {
      method: 'POST',
      headers: { 'x-admin-token': token },
    }),

  getStats: (token: string) =>
    apiRequest('/admin/stats', {
      headers: { 'x-admin-token': token },
    }),

  orders: {
    getAll: (token: string) =>
      apiRequest('/admin/orders', {
        headers: { 'x-admin-token': token },
      }),

    update: (token: string, id: string, updates: any) =>
      apiRequest(`/admin/orders/${id}`, {
        method: 'PUT',
        headers: { 'x-admin-token': token },
        body: JSON.stringify(updates),
      }),
  },

  products: {
    create: (token: string, productData: any) =>
      apiRequest('/admin/products', {
        method: 'POST',
        headers: { 'x-admin-token': token },
        body: JSON.stringify(productData),
      }),

    update: (token: string, id: string, updates: any) =>
      apiRequest(`/admin/products/${id}`, {
        method: 'PUT',
        headers: { 'x-admin-token': token },
        body: JSON.stringify(updates),
      }),

    delete: (token: string, id: string) =>
      apiRequest(`/admin/products/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-token': token },
      }),
  },

  categories: {
    update: (token: string, categories: any[]) =>
      apiRequest('/admin/categories', {
        method: 'POST',
        headers: { 'x-admin-token': token },
        body: JSON.stringify({ categories }),
      }),
  },

  coupons: {
    getAll: (token: string) =>
      apiRequest('/admin/coupons', {
        headers: { 'x-admin-token': token },
      }),

    create: (token: string, couponData: any) =>
      apiRequest('/admin/coupons', {
        method: 'POST',
        headers: { 'x-admin-token': token },
        body: JSON.stringify(couponData),
      }),

    delete: (token: string, code: string) =>
      apiRequest(`/admin/coupons/${code}`, {
        method: 'DELETE',
        headers: { 'x-admin-token': token },
      }),
  },

  settings: {
    update: (token: string, settings: any) =>
      apiRequest('/admin/settings', {
        method: 'PUT',
        headers: { 'x-admin-token': token },
        body: JSON.stringify(settings),
      }),
  },
};
