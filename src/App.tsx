import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { PricingPage } from './pages/PricingPage';
import { DashboardPage } from './pages/DashboardPage';
import { SuccessPage } from './pages/SuccessPage';
import { ShipmentsPage } from './pages/ShipmentsPage';
import { CreateShipmentPage } from './pages/CreateShipmentPage';
import { useAuth } from './context/AuthContext';
import { SendPackagePage } from './pages/SendPackagePage';
import { TravelPage } from './pages/TravelPage';
import { TripsPage } from './pages/TripsPage';
import { CreateTripPage } from './pages/CreateTripPage';
import { ShipmentsListPage } from './pages/ShipmentsListPage';
import { ShipmentDetailsPage } from './pages/ShipmentDetailsPage';
import { TripDetailsPage } from './pages/TripDetailsPage';
import { UserProfilePage } from './pages/UserProfilePage';
import { LeaveReviewPage } from './pages/LeaveReviewPage';
import { MessagesPage } from './pages/MessagesPage';
import { ConversationPage } from './pages/ConversationPage';
import { ProfilePage } from './pages/ProfilePage';
import { BuyTokensPage } from './pages/BuyTokensPage';
import { PaymentSuccessPage } from './pages/PaymentSuccessPage';
import { AdminPage } from './pages/AdminPage';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-neutral-50">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
            <Route path="/signup" element={user ? <Navigate to="/dashboard" replace /> : <SignupPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/success" element={<SuccessPage />} />
            <Route path="/payment-success" element={<PaymentSuccessPage />} />
            
            {/* Public Detail Pages */}
            <Route path="/shipments/:id" element={<ShipmentDetailsPage />} />
            <Route path="/trips/:id" element={<TripDetailsPage />} />
            <Route path="/users/:id" element={<UserProfilePage />} />

            {/* Protected Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/buy-tokens"
              element={
                <ProtectedRoute>
                  <BuyTokensPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/shipments"
              element={
                <ProtectedRoute>
                  <ShipmentsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/create-shipment"
              element={
                <ProtectedRoute>
                  <CreateShipmentPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/send-package"
              element={
                <ProtectedRoute>
                  <SendPackagePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/travel"
              element={
                <ProtectedRoute>
                  <TravelPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/trips"
              element={
                <ProtectedRoute>
                  <TripsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/create-trip"
              element={
                <ProtectedRoute>
                  <CreateTripPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/shipments-list"
              element={
                <ProtectedRoute>
                  <ShipmentsListPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/leave-review/:transactionId"
              element={
                <ProtectedRoute>
                  <LeaveReviewPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/messages"
              element={
                <ProtectedRoute>
                  <MessagesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/messages/:conversationId"
              element={
                <ProtectedRoute>
                  <ConversationPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;