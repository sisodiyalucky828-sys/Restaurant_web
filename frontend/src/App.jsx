import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Public & Customer Pages
import Home from './pages/Home';
import Menu from './pages/Menu';
import About from './pages/About';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import ReservationPage from './pages/ReservationPage';
import CartPage from './pages/CartPage';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import Login from './pages/Login';
import Register from './pages/Register';
import MyOrders from './pages/MyOrders';
import MyReservations from './pages/MyReservations';
import NotFound from './pages/NotFound';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminMenu from './pages/admin/AdminMenu';
import AdminOrders from './pages/admin/AdminOrders';
import AdminReservations from './pages/admin/AdminReservations';
import AdminUsers from './pages/admin/AdminUsers';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          {/* Notification Toaster with warm coffee aesthetic */}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#1F130B',
                color: '#FAF5EE',
                border: '1px solid rgba(212, 175, 55, 0.3)',
                fontSize: '13px',
                borderRadius: '12px',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
              },
              success: {
                iconTheme: {
                  primary: '#D4AF37',
                  secondary: '#120A05',
                },
              },
            }}
          />

          <Routes>
            {/* Public Layout */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Home />} />
              <Route path="menu" element={<Menu />} />
              <Route path="about" element={<About />} />
              <Route path="gallery" element={<Gallery />} />
              <Route path="contact" element={<Contact />} />
              <Route path="reservation" element={<ReservationPage />} />
              <Route path="cart" element={<CartPage />} />
              <Route path="checkout" element={<Checkout />} />
              <Route path="order-success/:id" element={<OrderSuccess />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />

              {/* Protected Customer Routes */}
              <Route
                path="my-orders"
                element={
                  <ProtectedRoute>
                    <MyOrders />
                  </ProtectedRoute>
                }
              />
              <Route
                path="my-reservations"
                element={
                  <ProtectedRoute>
                    <MyReservations />
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<NotFound />} />
            </Route>

            {/* Protected Admin Suite */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="menu" element={<AdminMenu />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="reservations" element={<AdminReservations />} />
              <Route path="users" element={<AdminUsers />} />
            </Route>
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
