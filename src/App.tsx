import { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { ProfileCompletionGuard } from './components/auth/ProfileCompletionGuard';
import { useAuth } from './context/AuthContext';
import { Loader2 } from 'lucide-react';

// Lazy load pages
const HomePage = lazy(() => import('./pages/HomePage').then(module => ({ default: module.HomePage })));
const LoginPage = lazy(() => import('./pages/LoginPage').then(module => ({ default: module.LoginPage })));
const SignupPage = lazy(() => import('./pages/SignupPage').then(module => ({ default: module.SignupPage })));
const PricingPage = lazy(() => import('./pages/PricingPage').then(module => ({ default: module.PricingPage })));
const DashboardPage = lazy(() => import('./pages/DashboardPage').then(module => ({ default: module.DashboardPage })));
const SuccessPage = lazy(() => import('./pages/SuccessPage').then(module => ({ default: module.SuccessPage })));
const ShipmentsPage = lazy(() => import('./pages/ShipmentsPage').then(module => ({ default: module.ShipmentsPage })));
const CreateShipmentPage = lazy(() => import('./pages/CreateShipmentPage').then(module => ({ default: module.CreateShipmentPage })));
const SendPackagePage = lazy(() => import('./pages/SendPackagePage').then(module => ({ default: module.SendPackagePage })));
const TravelPage = lazy(() => import('./pages/TravelPage').then(module => ({ default: module.TravelPage })));
const TripsPage = lazy(() => import('./pages/TripsPage').then(module => ({ default: module.TripsPage })));
const CreateTripPage = lazy(() => import('./pages/CreateTripPage').then(module => ({ default: module.CreateTripPage })));
const ShipmentsListPage = lazy(() => import('./pages/ShipmentsListPage').then(module => ({ default: module.ShipmentsListPage })));
const ShipmentDetailsPage = lazy(() => import('./pages/ShipmentDetailsPage').then(module => ({ default: module.ShipmentDetailsPage })));
const TripDetailsPage = lazy(() => import('./pages/TripDetailsPage').then(module => ({ default: module.TripDetailsPage })));
const UserProfilePage = lazy(() => import('./pages/UserProfilePage').then(module => ({ default: module.UserProfilePage })));
const LeaveReviewPage = lazy(() => import('./pages/LeaveReviewPage').then(module => ({ default: module.LeaveReviewPage })));
const MessagesPage = lazy(() => import('./pages/MessagesPage').then(module => ({ default: module.MessagesPage })));
const ConversationPage = lazy(() => import('./pages/ConversationPage').then(module => ({ default: module.ConversationPage })));
const ProfilePage = lazy(() => import('./pages/ProfilePage').then(module => ({ default: module.ProfilePage })));
const BuyTokensPage = lazy(() => import('./pages/BuyTokensPage').then(module => ({ default: module.BuyTokensPage })));
const PaymentSuccessPage = lazy(() => import('./pages/PaymentSuccessPage').then(module => ({ default: module.PaymentSuccessPage })));
const AdminPage = lazy(() => import('./pages/AdminPage').then(module => ({ default: module.AdminPage })));
const KycPage = lazy(() => import('./pages/KycPage').then(module => ({ default: module.KycPage })));
const CompleteProfilePage = lazy(() => import('./pages/CompleteProfilePage').then(module => ({ default: module.CompleteProfilePage })));
const TermsOfServicePage = lazy(() => import('./pages/TermsOfServicePage').then(module => ({ default: module.TermsOfServicePage })));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage').then(module => ({ default: module.PrivacyPolicyPage })));

const SuspenseFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <Loader2 className="w-12 h-12 text-primary animate-spin" />
  </div>
);

function App() {
  const { user, loading } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && typeof user === 'undefined') {
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
    return <SuspenseFallback />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-neutral-50 flex flex-col">
        <Header />
        <main className="flex-grow">
          <Suspense fallback={<SuspenseFallback />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
              <Route path="/signup" element={user ? <Navigate to="/dashboard" replace /> : <SignupPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/success" element={<SuccessPage />} />
              <Route path="/payment-success" element={<PaymentSuccessPage />} />
              <Route path="/terms-of-service" element={<TermsOfServicePage />} />
              <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
              
              {/* Nouvelle route pour la complétion du profil */}
              <Route path="/complete-profile" element={<CompleteProfilePage />} />
              
              <Route path="/shipments/:id" element={<ShipmentDetailsPage />} />
              <Route path="/trips/:id" element={<TripDetailsPage />} />
              <Route path="/users/:id" element={<UserProfilePage />} />

              {/* Routes protégées par authentification */}
              <Route path="/admin" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><ProfileCompletionGuard><DashboardPage /></ProfileCompletionGuard></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><ProfileCompletionGuard><ProfilePage /></ProfileCompletionGuard></ProtectedRoute>} />
              <Route path="/buy-tokens" element={<ProtectedRoute><ProfileCompletionGuard><BuyTokensPage /></ProfileCompletionGuard></ProtectedRoute>} />
              <Route path="/shipments" element={<ProtectedRoute><ProfileCompletionGuard><ShipmentsPage /></ProfileCompletionGuard></ProtectedRoute>} />
              <Route path="/create-shipment" element={<ProtectedRoute><ProfileCompletionGuard><CreateShipmentPage /></ProfileCompletionGuard></ProtectedRoute>} />
              <Route path="/send-package" element={<ProtectedRoute><ProfileCompletionGuard><SendPackagePage /></ProfileCompletionGuard></ProtectedRoute>} />
              <Route path="/travel" element={<ProtectedRoute><ProfileCompletionGuard><TravelPage /></ProfileCompletionGuard></ProtectedRoute>} />
              <Route path="/trips" element={<ProtectedRoute><ProfileCompletionGuard><TripsPage /></ProfileCompletionGuard></ProtectedRoute>} />
              <Route path="/create-trip" element={<ProtectedRoute><ProfileCompletionGuard><CreateTripPage /></ProfileCompletionGuard></ProtectedRoute>} />
              <Route path="/shipments-list" element={<ProtectedRoute><ProfileCompletionGuard><ShipmentsListPage /></ProfileCompletionGuard></ProtectedRoute>} />
              <Route path="/leave-review/:transactionId" element={<ProtectedRoute><ProfileCompletionGuard><LeaveReviewPage /></ProfileCompletionGuard></ProtectedRoute>} />
              <Route path="/messages" element={<ProtectedRoute><ProfileCompletionGuard><MessagesPage /></ProfileCompletionGuard></ProtectedRoute>} />
              <Route path="/messages/:conversationId" element={<ProtectedRoute><ProfileCompletionGuard><ConversationPage /></ProfileCompletionGuard></ProtectedRoute>} />
              <Route path="/kyc" element={<ProtectedRoute><ProfileCompletionGuard><KycPage /></ProfileCompletionGuard></ProtectedRoute>} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;