import React from 'react';
import { Link } from 'react-router-dom';
import {
  Scissors,
  MapPin,
  Phone,
  Mail,
  Clock,
  Facebook,
  Instagram,
  Youtube
} from 'lucide-react';

const Footer = () => {
  return (
    <footer role="contentinfo" className="bg-noir-900 border-t border-beige-800/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-gold-500 to-gold-600 rounded-xl flex items-center justify-center">
                <Scissors className="w-7 h-7 text-noir-900" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-2xl font-display font-bold text-gold-400">WIGVIVAL</h2>
                <p className="text-sm text-beige-400">Excellence Capillaire</p>
              </div>
            </div>
            <p className="text-beige-300 mb-6">
              Salon premium spécialisé dans la customisation, restauration et styling de perruques.
            </p>
            <div className="flex space-x-4" aria-label="Réseaux sociaux">
              <a href="https://instagram.com/wigvival" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="p-2 bg-beige-800/30 rounded-lg hover:bg-gold-400/20 transition-colors">
                <Instagram className="w-5 h-5 text-beige-400" />
              </a>
              <a href="https://facebook.com/wigvival" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="p-2 bg-beige-800/30 rounded-lg hover:bg-gold-400/20 transition-colors">
                <Facebook className="w-5 h-5 text-beige-400" />
              </a>
              <a href="https://youtube.com/wigvival" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="p-2 bg-beige-800/30 rounded-lg hover:bg-gold-400/20 transition-colors">
                <Youtube className="w-5 h-5 text-beige-400" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <nav aria-label="Navigation" className="md:col-span-1">
            <h3 className="text-lg font-display font-bold text-gold-400 mb-6">Navigation</h3>
            <ul className="space-y-3">
              <li><Link to="/" className="text-beige-400 hover:text-gold-400 transition-colors">Accueil</Link></li>
              <li><Link to="/services" className="text-beige-400 hover:text-gold-400 transition-colors">Nos Services</Link></li>
              <li><Link to="/pricing" className="text-beige-400 hover:text-gold-400 transition-colors">Tarifs</Link></li>
              <li><Link to="/booking" className="text-beige-400 hover:text-gold-400 transition-colors">Réservation</Link></li>
              <li><Link to="/gallery" className="text-beige-400 hover:text-gold-400 transition-colors">Galerie</Link></li>
              <li><Link to="/contact" className="text-beige-400 hover:text-gold-400 transition-colors">Contact</Link></li>
            </ul>
          </nav>

          {/* Services */}
          <div>
            <h3 className="text-lg font-display font-bold text-gold-400 mb-6">Services</h3>
            <ul className="space-y-3">
              <li><Link to="/services?category=customisation" className="text-beige-400 hover:text-gold-400 transition-colors">Customisation</Link></li>
              <li><Link to="/services?category=restauration" className="text-beige-400 hover:text-gold-400 transition-colors">Restauration</Link></li>
              <li><Link to="/services?category=styling" className="text-beige-400 hover:text-gold-400 transition-colors">Styling</Link></li>
              <li><Link to="/pricing" className="text-beige-400 hover:text-gold-400 transition-colors">Voir tous les tarifs</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <address className="not-italic">
            <h3 className="text-lg font-display font-bold text-gold-400 mb-6">Contact</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-gold-400" aria-hidden="true" />
                <div>
                  <p className="text-beige-300">123 Rue de la Beauté</p>
                  <p className="text-beige-400 text-sm">Montréal, QC H3A 1A1</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-gold-400" aria-hidden="true" />
                <a href="tel:+15141234567" className="text-beige-300 hover:text-gold-400 transition-colors">+1 (514) 123-4567</a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gold-400" aria-hidden="true" />
                <a href="mailto:contact@wigvival.ca" className="text-beige-300 hover:text-gold-400 transition-colors">contact@wigvival.ca</a>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-gold-400" aria-hidden="true" />
                <div>
                  <p className="text-beige-300">Lun-Sam: 9h-20h</p>
                  <p className="text-beige-400 text-sm">Dim: Fermé</p>
                </div>
              </div>
            </div>
          </address>
        </div>

        {/* Copyright */}
        <div className="border-t border-beige-800/30 mt-8 pt-8 text-center">
          <p className="text-beige-400">
            © {new Date().getFullYear()} WIGVIVAL Salon. Tous droits réservés.
            <span className="mx-2">•</span>
            <Link to="/privacy" className="hover:text-gold-400 transition-colors">Confidentialité</Link>
            <span className="mx-2">•</span>
            <Link to="/terms" className="hover:text-gold-400 transition-colors">Conditions</Link>
          </p>
          <p className="text-beige-500 text-sm mt-2">Site conçu avec passion à Montréal, Québec</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
