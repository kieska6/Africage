import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
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
import { KycPage } from './pages/KycPage';
import { TermsOfServicePage } from './pages/TermsOfServicePage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';

function App() {
  const { user, loading } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Ajout de logs pour le debugging
    console.log('App component rendered');
    console.log('Auth loading state:', loading);
    console.log('User state:', user);
    
    // Gestion des erreurs de l'authentification
    if (!loading && typeof user === 'undefined') {
      console.error('Auth context error: user is undefined');
      setError('Erreur d\'authentification. Veuillez recharger la page.');
    }
  }, [user, loading]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Erreur d'application</h1>
          <p className="text-red-800 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Recharger la page
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-neutral-600">Chargement de l'application...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-neutral-50 flex flex-col">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
            <Route path="/signup" element={user ? <Navigate to="/dashboard" replace /> : <SignupPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/success" element={<SuccessPage />} />
            <Route path="/payment-success" element={<PaymentSuccessPage />} />
            <Route path="/terms-of-service" element={<TermsOfServicePage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            
            {/* Public Detail Pages */}
            <Route path="/shipments/:id" element={<ShipmentDetailsPage />} />
            <Route path="/trips/:id" element={<TripDetailsPage />} />
            <Route path="/users/:id" element={<UserProfilePage />} />

            {/* Protected Routes */}
            <Route path="/admin" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/buy-tokens" element={<ProtectedRoute><BuyTokensPage /></ProtectedRoute>} />
            <Route path="/shipments" element={<ProtectedRoute><ShipmentsPage /></ProtectedRoute>} />
            <Route path="/create-shipment" element={<ProtectedRoute><CreateShipmentPage /></ProtectedRoute>} />
            <Route path="/send-package" element={<ProtectedRoute><SendPackagePage /></ProtectedRoute>} />
            <Route path="/travel" element={<ProtectedRoute><TravelPage /></ProtectedRoute>} />
            <Route path="/trips" element={<ProtectedRoute><TripsPage /></ProtectedRoute>} />
            <Route path="/create-trip" element={<ProtectedRoute><CreateTripPage /></ProtectedRoute>} />
            <Route path="/shipments-list" element={<ProtectedRoute><ShipmentsListPage /></ProtectedRoute>} />
            <Route path="/leave-review/:transactionId" element={<ProtectedRoute><LeaveReviewPage /></ProtectedRoute>} />
            <Route path="/messages" element={<ProtectedRoute><MessagesPage /></ProtectedRoute>} />
            <Route path="/messages/:conversationId" element={<ProtectedRoute><ConversationPage /></ProtectedRoute>} />
            <Route path="/kyc" element={<ProtectedRoute><KycPage /></ProtectedRoute>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;