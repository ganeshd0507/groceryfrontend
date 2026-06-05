import { Routes, Route } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import ProductListingPage from '../pages/ProductListingPage';
import ProductDetailsPage from '../pages/ProductDetailsPage';
import CartPage from '../pages/CartPage';
import CheckoutPage from '../pages/CheckoutPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import OtpPage from '../pages/OtpPage';
import DashboardPage from '../pages/DashboardPage';
import AdminDashboardPage from '../pages/AdminDashboardPage';

import MainLayout from '../layouts/MainLayout';
import AdminLayout from '../layouts/AdminLayout';

const AppRoutes = ({ triggerToast }) => {
  return (
    <Routes>
      {/* Client Pages wrapped in MainLayout */}
      <Route
        path="/"
        element={
          <MainLayout>
            <LandingPage triggerToast={triggerToast} />
          </MainLayout>
        }
      />
      <Route
        path="/products"
        element={
          <MainLayout>
            <ProductListingPage triggerToast={triggerToast} />
          </MainLayout>
        }
      />
      <Route
        path="/product/:id"
        element={
          <MainLayout>
            <ProductDetailsPage triggerToast={triggerToast} />
          </MainLayout>
        }
      />
      <Route
        path="/cart"
        element={
          <MainLayout>
            <CartPage triggerToast={triggerToast} />
          </MainLayout>
        }
      />
      <Route
        path="/checkout"
        element={
          <MainLayout>
            <CheckoutPage triggerToast={triggerToast} />
          </MainLayout>
        }
      />
      <Route
        path="/login"
        element={
          <MainLayout>
            <LoginPage triggerToast={triggerToast} />
          </MainLayout>
        }
      />
      <Route
        path="/register"
        element={
          <MainLayout>
            <RegisterPage triggerToast={triggerToast} />
          </MainLayout>
        }
      />
      <Route
        path="/otp"
        element={
          <MainLayout>
            <OtpPage triggerToast={triggerToast} />
          </MainLayout>
        }
      />
      <Route
        path="/dashboard"
        element={
          <MainLayout>
            <DashboardPage triggerToast={triggerToast} />
          </MainLayout>
        }
      />

      {/* Admin Pages wrapped in AdminLayout */}
      <Route
        path="/admin"
        element={
          <AdminLayout>
            <AdminDashboardPage triggerToast={triggerToast} />
          </AdminLayout>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
