import React, { useState, useEffect } from "react";
import { CartProvider } from "./context/CartContext";
import {
  AdminProvider,
  useAdmin,
} from "./context/AdminContext";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { HomePage } from "./components/HomePage";
import { ShopPage } from "./components/ShopPage";
import { ProductDetailPage } from "./components/ProductDetailPage";
import { CartPage } from "./components/CartPage";
import { CheckoutPage } from "./components/CheckoutPage";
import { OrderConfirmationPage } from "./components/OrderConfirmationPage";
import { AboutPage } from "./components/AboutPage";
import { ContactPage } from "./components/ContactPage";
import {
  ShippingPolicy,
  ReturnPolicy,
  PrivacyPolicy,
} from "./components/PolicyPages";
import { AdminLogin } from "./components/admin/AdminLogin";
import { AdminDashboard } from "./components/admin/AdminDashboard";
import { ProductManagement } from "./components/admin/ProductManagement";
import { OrderManagement } from "./components/admin/OrderManagement";
import { CouponManagement } from "./components/admin/CouponManagement";
import { Lock } from "lucide-react";
import { WhatsAppButton } from "./components/WhatsAppButton";

function AppContent() {
  const [currentPage, setCurrentPage] = useState("home");
  const [pageData, setPageData] = useState<any>(null);
  const { isAuthenticated } = useAdmin();

  useEffect(() => {
    // Check URL on mount
    const path = window.location.pathname;
    if (path === '/admin') {
      setCurrentPage('admin');
    }
  }, []);

  const navigate = (page: string, data?: any) => {
    setCurrentPage(page);
    setPageData(data);
    window.scrollTo(0, 0);

    // Optional: Update URL for better UX, though not strictly required by user
    if (page === 'admin') {
      window.history.pushState({}, '', '/admin');
    } else if (page === 'home') {
      window.history.pushState({}, '', '/');
    }
  };

  // Admin pages
  const adminPages = [
    "admin",
    "admin-login",
    "admin-dashboard",
    "admin-products",
    "admin-orders",
    "admin-coupons",
  ];
  const isAdminPage = adminPages.includes(currentPage);

  // Render admin pages
  if (
    currentPage === "admin" ||
    currentPage === "admin-login"
  ) {
    if (isAuthenticated) {
      return <AdminDashboard onNavigate={navigate} />;
    }
    return (
      <AdminLogin
        onLoginSuccess={() => navigate("admin-dashboard")}
      />
    );
  }

  if (isAdminPage) {
    if (!isAuthenticated) {
      return (
        <AdminLogin
          onLoginSuccess={() => navigate("admin-dashboard")}
        />
      );
    }

    switch (currentPage) {
      case "admin-dashboard":
        return <AdminDashboard onNavigate={navigate} />;
      case "admin-products":
        return <ProductManagement onNavigate={navigate} />;
      case "admin-orders":
        return <OrderManagement onNavigate={navigate} />;
      case "admin-coupons":
        return <CouponManagement onNavigate={navigate} />;
      case "admin-settings":
        return <SettingsManagement onNavigate={navigate} />;
    }
  }

  // Customer pages with header/footer
  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <HomePage onNavigate={navigate} />;
      case "shop":
        return (
          <ShopPage
            onNavigate={navigate}
            initialCategory={pageData?.category}
          />
        );
      case "product":
        return (
          <ProductDetailPage
            productId={pageData?.id}
            onNavigate={navigate}
          />
        );
      case "cart":
        return <CartPage onNavigate={navigate} />;
      case "checkout":
        return <CheckoutPage onNavigate={navigate} />;
      case "order-confirmation":
        return (
          <OrderConfirmationPage
            orderId={pageData?.orderId}
            onNavigate={navigate}
          />
        );
      case "about":
        return <AboutPage onNavigate={navigate} />;
      case "contact":
        return <ContactPage />;
      case "shipping":
        return <ShippingPolicy />;
      case "returns":
        return <ReturnPolicy />;
      case "privacy":
        return <PrivacyPolicy />;
      default:
        return <HomePage onNavigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header onNavigate={navigate} currentPage={currentPage} />
      <main className="flex-1">{renderPage()}</main>
      <Footer onNavigate={navigate} />

      {/* Floating Admin Access Button - REMOVED for security */}
      {!isAdminPage && (
        <>
          {/* <WhatsAppButton /> */}
        </>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AdminProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AdminProvider>
  );
}