import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

import { 
  Scissors, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  Star,
  TrendingUp,
  Shield,
  Zap,
  Heart,
  Droplets,
  Wind
} from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';


const PricingPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const response = await api.get('/services');
      const all = Array.isArray(response.data) ? response.data : [];
      // filter active by default
      setServices(all.filter(s => s.is_active !== false));
    } catch (error) {
      toast.error('Erreur lors du chargement des tarifs');
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  // safe numeric helpers
  const toNum = v => Number(v) || 0;
  const prices = services.map(s => toNum(s.price)).filter(p => p > 0);
  const minPrice = prices.length ? Math.min(...prices) : 0;
  const maxPrice = prices.length ? Math.max(...prices) : 0;

  const filteredServices = services.filter(service => {
    if (selectedCategory === 'all') return true;
    return service.category === selectedCategory;
  });

  const categories = [
    { id: 'all', name: 'Tous les Services', count: services.length },
    { id: 'restauration', name: 'Restauration', count: services.filter(s => s.category === 'restauration').length },
    { id: 'customisation', name: 'Customisation', count: services.filter(s => s.category === 'customisation').length },
    { id: 'styling', name: 'Styling', count: services.filter(s => s.category === 'styling').length }
  ];

  // Grouper les services par fourchette de prix
  const servicesByPrice = {
    affordable: services.filter(s => toNum(s.price) <= 30),
    midRange: services.filter(s => toNum(s.price) > 30 && toNum(s.price) <= 65),
    premium: services.filter(s => toNum(s.price) > 65)
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-noir-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold-400"></div>
      </div>
    );
  }

  // find RESSERAGE if present (fallback to cheapest)
  const resserage = services.find(s => /resserage/i.test(s.name)) || services.reduce((a,b) => toNum(a.price) < toNum(b.price) ? a : b, services[0] || { name: '—', price: minPrice, duration: 30 });

  return (
    <div className="min-h-screen bg-gradient-to-b from-noir-900 to-noir-800">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gold-500/5 via-transparent to-gold-500/5" />
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gold-400/10 border border-gold-400/30 rounded-full mb-6">
              <DollarSign className="w-4 h-4 text-gold-400" />
              <span className="text-gold-400 text-sm font-medium">Tarifs WIGVIVAL</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-display font-bold text-gold-400 mb-6">
              Notre Grille Tarifaire
            </h1>
            <p className="text-xl text-beige-300 mb-8">
              Des services premium à des prix accessibles. Découvrez notre gamme complète 
              de services spécialisés pour sublimer votre perruque.
            </p>

            {/* Prix minimum et maximum dynamiques */}
            <div className="flex justify-center items-center space-x-8 mb-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-gold-300">À partir de</div>
                <div className="text-5xl font-display font-bold text-gold-400">{minPrice.toFixed(0)}$</div>
                <div className="text-beige-400 mt-2">Service le plus accessible</div>
              </div>
              <div className="h-12 w-px bg-gold-400/30" />
              <div className="text-center">
                <div className="text-3xl font-bold text-gold-300">Jusqu'à</div>
                <div className="text-5xl font-display font-bold text-gold-400">{maxPrice.toFixed(0)}$</div>
                <div className="text-beige-400 mt-2">Service premium</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filtres */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-xl border transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'bg-gold-400/20 border-gold-400/50 text-gold-400'
                    : 'border-beige-800/30 text-beige-400 hover:border-beige-700 hover:text-beige-300'
                }`}
              >
                <span className="font-medium">{category.name}</span>
                <span className="ml-2 text-xs bg-beige-800/50 px-2 py-1 rounded-full">
                  {category.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grille Tarifaire */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {/* Carte RESSERAGE - Prix le plus bas */}
            {resserage && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative"
              >
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="px-4 py-1 bg-green-500/20 text-green-400 text-sm font-medium rounded-full border border-green-500/30">
                    Meilleur rapport qualité-prix
                  </div>
                </div>
                <div className="bg-gradient-to-b from-noir-800 to-noir-900 rounded-2xl border border-green-500/30 p-6 pt-10 h-full">
                  <h3 className="text-2xl font-display font-bold text-green-400 mb-2">{resserage.name}</h3>
                  <div className="text-4xl font-bold text-beige-100 mb-4">{toNum(resserage.price).toFixed(0)}$</div>
                  <div className="flex items-center text-beige-400 text-sm mb-6">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>{resserage.duration ?? 30} minutes</span>
                  </div>
                  <p className="text-beige-300 text-sm mb-6">
                    {resserage.description ?? 'Service professionnel pour redonner tension et forme.'}
                  </p>
                  <Link
                    to={`/booking?service=${resserage.id || ''}`}
                    className="block w-full text-center py-3 bg-green-500/20 text-green-400 border border-green-500/30 rounded-xl hover:bg-green-500/30 transition-colors"
                  >
                    Réserver
                  </Link>
                </div>
              </motion.div>
            )}

            {/* Services à 50$ (si existants) */}
            {services.filter(s => Math.round(toNum(s.price)) === 50).map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06 }}
                className="bg-gradient-to-b from-noir-800 to-noir-900 rounded-2xl border border-beige-800/30 p-6 h-full"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-display font-bold text-gold-400">{service.name}</h3>
                  {service.is_featured && <Star className="w-5 h-5 text-gold-400" />}
                </div>
                <div className="text-3xl font-bold text-beige-100 mb-2">50$</div>
                <div className="flex items-center text-beige-400 text-sm mb-4">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>{service.duration ?? '—'} minutes</span>
                </div>
                <p className="text-beige-300 text-sm mb-6 line-clamp-3">
                  {(service.description || '').substring(0, 100)}...
                </p>
                <Link
                  to={`/booking?service=${service.id}`}
                  className="block w-full text-center py-3 bg-gold-400/10 text-gold-400 border border-gold-400/30 rounded-xl hover:bg-gold-400/20 transition-colors"
                >
                  Réserver
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Services premium */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.filter(s => toNum(s.price) > 50).map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                className="relative"
              >
                {service.is_featured && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div className="px-4 py-1 bg-gradient-to-r from-gold-500 to-gold-600 text-noir-900 text-sm font-bold rounded-full">
                      ★ PREMIUM
                    </div>
                  </div>
                )}
                <div className="bg-gradient-to-b from-noir-800/80 to-noir-900/90 rounded-2xl border border-gold-400/20 p-6 pt-10 h-full">
                  <h3 className="text-2xl font-display font-bold text-gold-400 mb-2">{service.name}</h3>
                  <div className="text-4xl font-bold text-beige-100 mb-2">{toNum(service.price)}$</div>
                  <div className="flex items-center text-beige-400 text-sm mb-4">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>{service.duration ?? '—'} minutes</span>
                  </div>
                  <div className="mb-4">
                    <span className="inline-block px-3 py-1 bg-gold-400/10 text-gold-400 text-xs rounded-full mb-2">
                      {service.category === 'customisation' ? 'Customisation' : service.category === 'restauration' ? 'Restauration' : 'Styling'}
                    </span>
                  </div>
                  <p className="text-beige-300 text-sm mb-6 line-clamp-3">
                    {(service.description || '').substring(0, 120)}...
                  </p>
                  <div className="space-y-2 mb-6">
                    {service.features?.slice(0, 3).map((feature, idx) => (
                      <div key={idx} className="flex items-center text-sm text-beige-400">
                        <CheckCircle className="w-4 h-4 text-gold-400 mr-2" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Link
                    to={`/booking?service=${service.id}`}
                    className="block w-full text-center py-3 bg-gradient-to-r from-gold-500 to-gold-600 text-noir-900 font-bold rounded-xl hover:from-gold-600 hover:to-gold-700 transition-all"
                  >
                    Réserver maintenant
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tableau Comparatif */}
      <section className="py-20 bg-noir-800/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-display font-bold text-gold-400 mb-6">
              Tableau Comparatif
            </h2>
            <p className="text-beige-300 text-lg max-w-2xl mx-auto">
              Comparez nos services pour choisir celui qui correspond le mieux à vos besoins
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full bg-noir-800/50 backdrop-blur-sm rounded-2xl border border-beige-800/30 overflow-hidden">
              <thead>
                <tr className="bg-noir-900/50">
                  <th className="p-6 text-left text-gold-400 font-display font-bold">Service</th>
                  <th className="p-6 text-left text-gold-400 font-display font-bold">Prix</th>
                  <th className="p-6 text-left text-gold-400 font-display font-bold">Durée</th>
                  <th className="p-6 text-left text-gold-400 font-display font-bold">Catégorie</th>
                  <th className="p-6 text-left text-gold-400 font-display font-bold">Caractéristiques</th>
                  <th className="p-6 text-left text-gold-400 font-display font-bold">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredServices.map((service, index) => (
                  <tr 
                    key={service.id} 
                    className={`border-t border-beige-800/20 ${index % 2 === 0 ? 'bg-noir-800/20' : 'bg-noir-800/40'}`}
                  >
                    <td className="p-6">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gold-400/10 rounded-lg flex items-center justify-center mr-4">
                          {service.category === 'customisation' ? (
                            <Scissors className="w-5 h-5 text-gold-400" />
                          ) : service.category === 'restauration' ? (
                            <Droplets className="w-5 h-5 text-gold-400" />
                          ) : (
                            <Wind className="w-5 h-5 text-gold-400" />
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-beige-100">{service.name}</div>
                          {service.is_featured && <div className="text-xs text-gold-400 mt-1">★ Service Premium</div>}
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="text-2xl font-bold text-gold-400">{toNum(service.price)}$</div>
                      <div className="text-sm text-beige-400 mt-1">
                        Acompte: {(toNum(service.price) * 0.15).toFixed(2)}$
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center text-beige-300">
                        <Clock className="w-4 h-4 mr-2" />
                        <span>{service.duration ?? '—'} min</span>
                      </div>
                    </td>
                    <td className="p-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        service.category === 'customisation' 
                          ? 'bg-purple-500/20 text-purple-400' 
                          : service.category === 'restauration'
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-green-500/20 text-green-400'
                      }`}>
                        {service.category === 'customisation' ? 'Customisation' : service.category === 'restauration' ? 'Restauration' : 'Styling'}
                      </span>
                    </td>
                    <td className="p-6">
                      <div className="flex flex-wrap gap-2">
                        {service.features?.slice(0, 2).map((feature, idx) => (
                          <span key={idx} className="px-2 py-1 bg-beige-800/20 text-beige-400 text-xs rounded">
                            {feature}
                          </span>
                        ))}
                        {service.features?.length > 2 && (
                          <span className="px-2 py-1 bg-beige-800/20 text-beige-400 text-xs rounded">
                            +{service.features.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-6">
                      <Link
                        to={`/booking?service=${service.id}`}
                        className="inline-flex items-center justify-center px-4 py-2 bg-gold-400/10 text-gold-400 border border-gold-400/30 rounded-lg hover:bg-gold-400/20 transition-colors"
                      >
                        Réserver
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="bg-gradient-to-r from-gold-500/10 via-gold-400/5 to-gold-500/10 border border-gold-400/20 rounded-2xl p-12">
              <h2 className="text-4xl font-display font-bold text-gold-400 mb-6">
                Prêt à Sublimer Votre Perruque ?
              </h2>
              <p className="text-xl text-beige-300 mb-8 max-w-2xl mx-auto">
                Nos experts vous attendent pour une expérience de soin premium. 
                Réservez dès maintenant votre consultation personnalisée.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/booking"
                  className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-gold-500 to-gold-600 text-noir-900 font-bold rounded-xl hover:from-gold-600 hover:to-gold-700 transition-all duration-300 group"
                >
                  <span>Réserver un service</span>
                  <TrendingUp className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center px-8 py-4 border border-beige-800 text-beige-300 rounded-xl hover:bg-beige-800/30 transition-colors"
                >
                  <Heart className="w-5 h-5 mr-2" />
                  <span>Nous contacter</span>
                </Link>
              </div>
              <p className="text-beige-400 text-sm mt-6">
                ⚠️ Rappel : Un acompte de 15% est requis pour confirmer votre réservation
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default PricingPage;
