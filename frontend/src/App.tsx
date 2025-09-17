import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from '@/store/auth';
import { AuthService } from '@/services/auth';

// Import pages (we'll create these next)
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';
import DashboardPage from '@/pages/dashboard/DashboardPage';
import RestaurantPage from '@/pages/restaurant/RestaurantPage';
import NewRestaurantPage from '@/pages/restaurants/NewRestaurantPage';
import MenuPage from '@/pages/menu/MenuPage';
import NewMenuPage from '@/pages/menus/NewMenuPage';
import UsersPage from '@/pages/users/UsersPage';
import AnalyticsPage from '@/pages/analytics/AnalyticsPage';
import ProfilePage from '@/pages/profile/ProfilePage';
import NotFoundPage from '@/pages/NotFoundPage';
import CustomerMenuPage from '@/pages/customer/CustomerMenuPage';
import CheckoutPage from '@/pages/customer/CheckoutPage';
import QRGenerationPage from '@/pages/qr/QRGenerationPage';
import SettingsPage from '@/pages/settings/SettingsPage';
import PaymentTestingPage from '@/pages/testing/PaymentTestingPage';
import OrdersPage from '@/pages/orders/OrdersPage';

// Import marketing pages
import HomePage from '@/pages/marketing/HomePage';
import FeaturesPage from '@/pages/marketing/FeaturesPage';
import PricingPage from '@/pages/marketing/PricingPage';
import AboutPage from '@/pages/marketing/AboutPage';
import ContactPage from '@/pages/marketing/ContactPage';

// Import components (we'll create these next)
import Layout from '@/components/layout/Layout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Main App component
function App() {
  const { isAuthenticated, isLoading, refreshUser } = useAuthStore();

  // Initialize app on mount (only once)
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Check if user is authenticated
        if (AuthService.isAuthenticated()) {
          // Validate token and refresh user data
          if (AuthService.isTokenValid()) {
            await refreshUser();
          }
        }
      } catch (error) {
        console.error('Failed to initialize app:', error);
        // Don't throw error, just log it to prevent app crashes
      }
    };

    // Only initialize once on mount
    initializeApp();
  }, []); // Remove refreshUser dependency to prevent re-initialization

  // Show loading spinner while initializing
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="App">
          {/* Toast notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#22c55e',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />

          {/* Routes */}
          <Routes>
            {/* Marketing routes (public) */}
            <Route path="/" element={<HomePage />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            
            {/* Auth routes */}
            <Route path="/login" element={
              isAuthenticated ? <Navigate to="/admin/dashboard" replace /> : <LoginPage />
            } />
            <Route path="/register" element={
              isAuthenticated ? <Navigate to="/admin/dashboard" replace /> : <RegisterPage />
            } />
            
            {/* Customer-facing routes (public) */}
            <Route path="/menu/:restaurantId" element={<CustomerMenuPage />} />
            <Route path="/checkout/:restaurantId" element={<CheckoutPage />} />

            {/* Protected admin routes */}
            <Route path="/admin" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="restaurant" element={<RestaurantPage />} />
              <Route path="restaurants/new" element={<NewRestaurantPage />} />
              <Route path="menu" element={<MenuPage />} />
              <Route path="menus/new" element={<NewMenuPage />} />
              <Route path="orders" element={<OrdersPage />} />
              <Route path="users" element={<UsersPage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="qr" element={<QRGenerationPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="testing" element={<PaymentTestingPage />} />
              <Route path="profile" element={<ProfilePage />} />
            </Route>

            {/* 404 page */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;