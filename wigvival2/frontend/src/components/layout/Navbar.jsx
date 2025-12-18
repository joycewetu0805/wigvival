import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Scissors,
  Menu,
  X,
  User,
  Calendar,
  Home,
  Image,
  DollarSign,
  Phone
} from 'lucide-react';

const navItems = [
  { path: '/', label: 'Accueil', icon: <Home className="w-4 h-4" aria-hidden /> },
  { path: '/services', label: 'Services', icon: <Scissors className="w-4 h-4" aria-hidden /> },
  { path: '/pricing', label: 'Tarifs', icon: <DollarSign className="w-4 h-4" aria-hidden /> },
  { path: '/booking', label: 'Réservation', icon: <Calendar className="w-4 h-4" aria-hidden /> },
  { path: '/gallery', label: 'Galerie', icon: <Image className="w-4 h-4" aria-hidden /> },
  { path: '/contact', label: 'Contact', icon: <Phone className="w-4 h-4" aria-hidden /> },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const menuRef = useRef(null);

  // close mobile menu on route change
  useEffect(() => setIsOpen(false), [location.pathname]);

  // close on Escape and trap focus minimally
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      <a className="sr-only focus:not-sr-only focus:absolute focus:top-20 focus:left-4 z-[60] bg-gold-400/10 text-gold-400 px-3 py-2 rounded" href="#root">
        Passer au contenu
      </a>

      <nav aria-label="Navigation principale" className="fixed top-0 left-0 right-0 z-50 bg-noir-900/90 backdrop-blur-md border-b border-beige-800/30">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group" aria-label="Aller à l'accueil">
              <div className="w-10 h-10 bg-gradient-to-br from-gold-500 to-gold-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Scissors className="w-6 h-6 text-noir-900" aria-hidden />
              </div>
              <div>
                <h1 className="text-2xl font-display font-bold text-gold-400">WIGVIVAL</h1>
                <p className="text-xs text-beige-400">Salon Premium • Québec</p>
              </div>
            </Link>

            {/* Desktop */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map(item => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/'}
                  className={({ isActive }) =>
                    `flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${
                      isActive ? 'bg-gold-400/20 text-gold-400' : 'text-beige-400 hover:text-beige-300 hover:bg-beige-800/20'
                    }`
                  }
                >
                  <span>{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </NavLink>
              ))}

              <div className="h-6 w-px bg-beige-800/50 mx-4" />

              <Link
                to="/login"
                className="flex items-center space-x-2 px-6 py-3 bg-gold-400/10 text-gold-400 border border-gold-400/30 rounded-xl hover:bg-gold-400/20 transition-all"
                aria-label="Se connecter"
              >
                <User className="w-4 h-4" />
                <span>Connexion</span>
              </Link>
            </div>

            {/* Mobile toggle */}
            <button
              onClick={() => setIsOpen(v => !v)}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              className="md:hidden p-2 text-beige-400 hover:text-beige-300"
              aria-label={isOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile menu */}
          <motion.div
            id="mobile-menu"
            ref={menuRef}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: isOpen ? 1 : 0, height: isOpen ? 'auto' : 0 }}
            transition={{ duration: 0.18 }}
            className={`md:hidden overflow-hidden ${isOpen ? 'py-4 border-t border-beige-800/30' : ''}`}
            aria-hidden={!isOpen}
          >
            <div className="space-y-2 px-2">
              {navItems.map(item => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                      isActive ? 'bg-gold-400/20 text-gold-400' : 'text-beige-400 hover:text-beige-300 hover:bg-beige-800/20'
                    }`
                  }
                >
                  <span>{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </NavLink>
              ))}

              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center space-x-2 px-4 py-3 mt-4 bg-gold-400/10 text-gold-400 border border-gold-400/30 rounded-xl hover:bg-gold-400/20"
                aria-label="Se connecter"
              >
                <User className="w-4 h-4" />
                <span>Connexion</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
