import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';


import { 
  Scissors, 
  Sparkles, 
  Droplets, 
  Wind, 
  Star,
  Clock,
  DollarSign,
  CheckCircle,
  ArrowRight,
  Shield,
  Calendar
} from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';


const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState(null);
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    setStatsLoading(true);
    try {
      const res = await api.get('/services');
      const srv = Array.isArray(res.data) ? res.data : [];
      setServices(srv);
      // Try fetching aggregated stats from backend if available
      try {
        const sres = await api.get('/stats');
        setStats(sres.data);
      } catch (err) {
        // Fallback: compute simple stats from services
        const count = srv.length;
        const prices = srv.map(s => Number(s.price) || 0).filter(p => p > 0);
        const minPrice = prices.length ? Math.min(...prices) : 0;
        const premiumPrices = srv.filter(s => s.is_featured).map(s => Number(s.price) || 0);
        const premiumMax = premiumPrices.length ? Math.max(...premiumPrices) : (prices.length ? Math.max(...prices) : 0);
        setStats({
          servicesCount: count,
          fromPrice: minPrice,
          premiumPrice: premiumMax,
          guaranteeLabel: 'Qualité'
        });
      } finally {
        setStatsLoading(false);
      }
    } catch (error) {
      toast.error('Erreur lors du chargement des services');
      setServices([]);
      setStats({
        servicesCount: 0,
        fromPrice: 0,
        premiumPrice: 0,
        guaranteeLabel: 'Qualité'
      });
      setStatsLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const filteredServices = services.filter(service => {
    if (filter === 'all') return true;
    if (filter === 'premium') return service.is_featured;
    return service.category === filter;
  });

  const categories = [
    { id: 'all', name: 'Tous les Services', icon: <Sparkles className="w-5 h-5" /> },
    { id: 'customisation', name: 'Customisation', icon: <Scissors className="w-5 h-5" /> },
    { id: 'restauration', name: 'Restauration', icon: <Droplets className="w-5 h-5" /> },
    { id: 'styling', name: 'Styling', icon: <Wind className="w-5 h-5" /> },
    { id: 'premium', name: 'Services Premium', icon: <Star className="w-5 h-5" /> }
  ];

  const ServiceCard = ({ service, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="group relative"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-gold-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative bg-gradient-to-b from-noir-800/80 to-noir-900/90 backdrop-blur-sm rounded-2xl border border-beige-800/30 overflow-hidden hover:border-gold-400/50 transition-all duration-300 h-full flex flex-col">
        {service.is_featured && (
          <div className="absolute top-4 right-4 z-10">
            <div className="px-3 py-1 bg-gradient-to-r from-gold-500 to-gold-600 text-noir-900 text-xs font-bold rounded-full flex items-center space-x-1">
              <Star className="w-3 h-3" />
              <span>PREMIUM</span>
            </div>
          </div>
        )}
        <div className="h-48 overflow-hidden">
          <div className="w-full h-full bg-gradient-to-br from-gold-400/20 to-noir-800 flex items-center justify-center">
            {service.category === 'customisation' && <Scissors className="w-16 h-16 text-gold-400/50" />}
            {service.category === 'restauration' && <Droplets className="w-16 h-16 text-gold-400/50" />}
            {service.category === 'styling' && <Wind className="w-16 h-16 text-gold-400/50" />}
            {!['customisation','restauration','styling'].includes(service.category) && <Scissors className="w-16 h-16 text-gold-400/30" />}
          </div>
        </div>

        <div className="p-6 flex-1 flex flex-col">
          <div className="mb-3">
            <span className="inline-block px-3 py-1 bg-gold-400/10 text-gold-400 text-xs font-medium rounded-full">
              {service.category === 'customisation' ? 'Customisation' : 
               service.category === 'restauration' ? 'Restauration' : 'Styling'}
            </span>
          </div>

          <div className="mb-4">
            <h3 className="text-xl font-display font-bold text-gold-400 mb-2">
              {service.name}
            </h3>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-beige-100">
                {(Number(service.price) || 0).toFixed(2)} $CA
              </div>
              <div className="flex items-center text-beige-400 text-sm">
                <Clock className="w-4 h-4 mr-1" />
                {service.duration ?? '—'} min
              </div>
            </div>
          </div>

          <p className="text-beige-300 text-sm mb-6 line-clamp-3 flex-1">
            {service.description}
          </p>

          <div className="mb-6 space-y-2">
            {service.features?.slice(0, 3).map((feature, idx) => (
              <div key={idx} className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-gold-400" />
                <span className="text-sm text-beige-400">{feature}</span>
              </div>
            ))}
          </div>

          <div className="mt-auto">
            <Link
              to={`/booking?service=${service.id}`}
              className="w-full inline-flex items-center justify-center px-4 py-3 bg-gradient-to-r from-gold-500/10 to-gold-400/5 border border-gold-400/30 text-gold-400 font-medium rounded-xl hover:from-gold-400/20 hover:to-gold-400/10 hover:border-gold-400/50 transition-all duration-300 group/btn"
              onClick={(e) => { e.stopPropagation(); }}
            >
              <span>Réserver maintenant</span>
              <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const ServiceDetailModal = ({ service, onClose }) => (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-noir-900 rounded-2xl border border-gold-400/20 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="relative">
          <div className="sticky top-0 z-10 bg-noir-900/90 backdrop-blur-sm border-b border-beige-800/30 p-6">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <span className="px-3 py-1 bg-gold-400/10 text-gold-400 text-sm font-medium rounded-full">
                    {service.category === 'customisation' ? 'Customisation' : 
                     service.category === 'restauration' ? 'Restauration' : 'Styling'}
                  </span>
                  {service.is_featured && (
                    <span className="px-3 py-1 bg-gradient-to-r from-gold-500 to-gold-600 text-noir-900 text-xs font-bold rounded-full flex items-center space-x-1">
                      <Star className="w-3 h-3" />
                      <span>PREMIUM</span>
                    </span>
                  )}
                </div>
                <h2 className="text-3xl font-display font-bold text-gold-400">
                  {service.name}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-beige-800/30 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6 text-beige-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="flex items-center justify-between mb-8 p-4 bg-noir-800/50 rounded-xl">
              <div className="text-center">
                <div className="text-2xl font-bold text-gold-400">
                  {(Number(service.price) || 0).toFixed(2)} $CA
                </div>
                <div className="text-sm text-beige-400">Prix</div>
              </div>
              <div className="h-8 w-px bg-beige-800/50" />
              <div className="text-center">
                <div className="text-2xl font-bold text-beige-100">
                  {service.duration ?? '—'} min
                </div>
                <div className="text-sm text-beige-400">Durée</div>
              </div>
              <div className="h-8 w-px bg-beige-800/50" />
              <div className="text-center">
                <div className="text-2xl font-bold text-beige-100">
                  {((Number(service.price) || 0) * 0.15).toFixed(2)} $CA
                </div>
                <div className="text-sm text-beige-400">Acompte (15%)</div>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-display font-bold text-beige-200 mb-4">
                Description du Service
              </h3>
              <div className="prose prose-invert max-w-none">
                <p className="text-beige-300 whitespace-pre-line">
                  {service.description}
                </p>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-display font-bold text-beige-200 mb-4">
                Ce qui est inclus
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {service.features?.map((feature, idx) => (
                  <div key={idx} className="flex items-center space-x-3 p-3 bg-noir-800/30 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-gold-400 flex-shrink-0" />
                    <span className="text-beige-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to={`/booking?service=${service.id}`}
                className="flex-1 inline-flex items-center justify-center px-6 py-4 bg-gradient-to-r from-gold-500 to-gold-600 text-noir-900 font-bold rounded-xl hover:from-gold-600 hover:to-gold-700 transition-all duration-300 group/btn"
              >
                <span>Réserver ce service</span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover/btn:translate-x-1 transition-transform" />
              </Link>
              <button
                onClick={onClose}
                className="px-6 py-4 border border-beige-800 text-beige-300 rounded-xl hover:bg-beige-800/30 transition-colors"
              >
                Voir d'autres services
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-noir-900 via-noir-800 to-noir-900">
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-gold-500/5 via-transparent to-gold-500/5" />
          <div className="absolute top-0 left-0 w-64 h-64 bg-gold-500/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold-500/10 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gold-400/10 border border-gold-400/30 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-gold-400" />
              <span className="text-gold-400 text-sm font-medium">Services Exclusifs</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-display font-bold text-gold-400 mb-6">
              L'Excellence WIGVIVAL
            </h1>
            <p className="text-xl text-beige-300 mb-10">
              Découvrez nos services premium de customisation, restauration et styling, 
              réalisés avec passion et expertise par nos maîtres-artisans.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto mb-12">
              {statsLoading ? (
                Array.from({length:4}).map((_,i)=>(
                  <div key={i} className="text-center p-4 bg-noir-800/30 rounded-xl border border-beige-800/20 animate-pulse h-28" />
                ))
              ) : (
                [
                  { value: stats?.servicesCount ?? services.length, label: 'Services', icon: <Scissors className="w-6 h-6" /> },
                  { value: `${(stats?.fromPrice ?? 0).toFixed(2)}$`, label: 'À partir de', icon: <DollarSign className="w-6 h-6" /> },
                  { value: `${(stats?.premiumPrice ?? 0).toFixed(2)}$`, label: 'Service Premium', icon: <Star className="w-6 h-6" /> },
                  { value: stats?.guaranteeLabel ?? 'Qualité', label: 'Garantie', icon: <Shield className="w-6 h-6" /> }
                ].map((stat, idx) => (
                  <div key={idx} className="text-center p-4 bg-noir-800/30 rounded-xl border border-beige-800/20">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-gold-400/10 rounded-full mb-3 mx-auto">
                      <div className="text-gold-400">
                        {stat.icon}
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-gold-400 mb-1">{stat.value}</div>
                    <div className="text-sm text-beige-400">{stat.label}</div>
                  </div>
                ))
              )}
            </div>
          </motion.div>

          <section className="py-12 pb-20">
            <div className="container mx-auto px-4">
              <div className="mb-12">
                <div className="flex flex-wrap justify-center gap-3">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setFilter(category.id)}
                      className={`inline-flex items-center space-x-2 px-5 py-3 rounded-xl border transition-all duration-300 ${
                        filter === category.id
                          ? 'bg-gold-400/20 border-gold-400/50 text-gold-400'
                          : 'border-beige-800/30 text-beige-400 hover:border-beige-700 hover:text-beige-300'
                      }`}
                    >
                      <span>{category.icon}</span>
                      <span className="font-medium">{category.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {loading ? (
                <div className="flex justify-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold-400"></div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                    {filteredServices.map((service, index) => (
                      <div 
                        key={service.id} 
                        onClick={() => setSelectedService(service)}
                        className="cursor-pointer"
                      >
                        <ServiceCard service={service} index={index} />
                      </div>
                    ))}
                  </div>

                  {filteredServices.length === 0 && (
                    <div className="text-center py-20">
                      <Scissors className="w-16 h-16 text-beige-600 mx-auto mb-6" />
                      <h3 className="text-2xl font-display font-bold text-beige-300 mb-3">
                        Aucun service disponible
                      </h3>
                      <p className="text-beige-400">
                        Aucun service ne correspond à vos critères. Essayez une autre catégorie.
                      </p>
                    </div>
                  )}
                </>
              )}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-20 bg-gradient-to-r from-gold-500/10 via-gold-400/5 to-gold-500/10 border border-gold-400/20 rounded-2xl p-8 text-center"
              >
                <h2 className="text-3xl font-display font-bold text-gold-400 mb-4">
                  Prêt à sublimer votre perruque ?
                </h2>
                <p className="text-beige-300 mb-8 max-w-2xl mx-auto">
                  Nos experts sont prêts à vous offrir une expérience unique et personnalisée. 
                  Réservez votre consultation dès aujourd'hui.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    to="/booking"
                    className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-gold-500 to-gold-600 text-noir-900 font-bold rounded-xl hover:from-gold-600 hover:to-gold-700 transition-all duration-300 group"
                  >
                    <span>Réserver un service</span>
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    to="/contact"
                    className="inline-flex items-center justify-center px-8 py-4 border border-beige-800 text-beige-300 rounded-xl hover:bg-beige-800/30 transition-colors"
                  >
                    Nous contacter
                  </Link>
                </div>
              </motion.div>
            </div>
          </section>

          <section className="py-20 bg-noir-800/30">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-display font-bold text-gold-400 mb-6">
                  Notre Processus en 3 Étapes
                </h2>
                <p className="text-beige-300 text-lg max-w-2xl mx-auto">
                  Une expérience fluide et professionnelle de la réservation à la récupération
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    step: '01',
                    title: 'Réservation & Acompte',
                    description: 'Réservez votre service en ligne et payez l\'acompte de 15% pour confirmer votre créneau.',
                    icon: <Calendar className="w-8 h-8" />
                  },
                  {
                    step: '02',
                    title: 'Traitement Expert',
                    description: 'Nos maîtres-artisans travaillent minutieusement sur votre perruque avec des techniques exclusives.',
                    icon: <Scissors className="w-8 h-8" />
                  },
                  {
                    step: '03',
                    title: 'Récupération & Satisfaction',
                    description: 'Récupérez votre perruque parfaitement restaurée et bénéficiez de nos conseils d\'entretien.',
                    icon: <CheckCircle className="w-8 h-8" />
                  }
                ].map((step, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.2 }}
                    className="relative"
                  >
                    <div className="absolute -top-4 -left-4 w-8 h-8 bg-gold-400 text-noir-900 rounded-full flex items-center justify-center text-sm font-bold">
                      {step.step}
                    </div>
                    <div className="bg-noir-800/50 backdrop-blur-sm rounded-2xl border border-beige-800/30 p-8 h-full">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-gold-400/10 rounded-xl mb-6">
                        <div className="text-gold-400">
                          {step.icon}
                        </div>
                      </div>
                      <h3 className="text-xl font-display font-bold text-gold-400 mb-4">
                        {step.title}
                      </h3>
                      <p className="text-beige-300">
                        {step.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {selectedService && (
            <ServiceDetailModal 
              service={selectedService} 
              onClose={() => setSelectedService(null)} 
            />
          )}
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;
