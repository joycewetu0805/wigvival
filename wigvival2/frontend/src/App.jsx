// App.jsx
import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// lazy pages
const HomePage = lazy(() => import('./pages/HomePage'));
const ServicesPage = lazy(() => import('./pages/ServicesPage'));
const BookingPage = lazy(() => import('./pages/BookingPage'));
const PricingPage = lazy(() => import('./pages/PricingPage'));
const GalleryPage = lazy(() => import('./pages/GalleryPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));

// Simple ScrollToTop (used below)
const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [pathname]);
  return null;
};

// Basic protected route (adjust auth check to your auth logic)
const ProtectedRoute = ({ children }) => {
  const isAdmin = localStorage.getItem('isAdmin') === 'true'; // replace with real auth
  return isAdmin ? children : <Navigate to="/login" replace />;
};

// Minimal error boundary
class ErrorBoundary extends React.Component {
  constructor(props){ super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError(){ return { hasError: true }; }
  componentDidCatch(err){ console.error('Boundary caught', err); }
  render(){ return this.state.hasError ? <div className="p-8 text-center">Oups — erreur. Recharge la page.</div> : this.props.children; }
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <>
      <ScrollToTop />
      <AnimatePresence mode="wait" initial={false}>
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.28 }}
          className="pt-20"
        >
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<HomePage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/booking" element={<BookingPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/admin" element={
              <ProtectedRoute><AdminDashboard /></ProtectedRoute>
            } />
            <Route path="*" element={<div className="p-12 text-center">Page introuvable</div>} />
          </Routes>
        </motion.main>
      </AnimatePresence>
    </>
  );
}

export default function App(){
  return (
    <Router>
      <div className="min-h-screen bg-noir-900 text-beige-100">
        <Navbar />
        <ErrorBoundary>
          <Suspense fallback={
            <div className="min-h-[50vh] flex items-center justify-center">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gold-400" />
            </div>
          }>
            <AnimatedRoutes />
          </Suspense>
        </ErrorBoundary>
        <Footer />
      </div>
    </Router>
  );
}
