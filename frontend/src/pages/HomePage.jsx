import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

import { 
  Scissors, 
  Sparkles, 
  Star, 
  Shield, 
  Users,
  ArrowRight,
  Calendar,
  Heart
} from 'lucide-react';
import ServiceCard from '../components/ServiceCard';
import StylistCard from '../components/StylistCard';
import api from '../services/api';
import { toast } from 'react-toastify';


const HomePage = () => {
  const [services, setServices] = useState([]);
  const [stylists, setStylists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [sRes, stRes] = await Promise.allSettled([
          api.get('/services'),
          api.get('/stylists')
        ]);
        if (sRes.status === 'fulfilled') setServices(Array.isArray(sRes.value.data) ? sRes.value.data : []);
        else {
          setServices([]);
          console.warn('services fetch failed', sRes.reason);
        }
        if (stRes.status === 'fulfilled') setStylists(Array.isArray(stRes.value.data) ? stRes.value.data : []);
        else {
          setStylists([]);
          console.warn('stylists fetch failed', stRes.reason);
        }
      } catch (err) {
        console.error(err);
        toast.error('Erreur lors du chargement de la page d\'accueil');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const featuredServices = (services || []).filter(s => s.is_featured).slice(0, 3);
  const featuredStylists = (stylists || []).slice(0, 2);


  return (
    <div className="min-h-screen bg-gradient-to-b from-noir-900 to-noir-800">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-gold-500/10 via-transparent to-gold-500/10" />
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gold-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gold-400/10 border border-gold-400/30 rounded-full mb-6">
                <Sparkles className="w-4 h-4 text-gold-400" />
                <span className="text-gold-400 text-sm font-medium">Salon Premium</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-gold-400 mb-6">
                L'Excellence
                <span className="block text-beige-100">Capillaire</span>
              </h1>
              
              <p className="text-xl text-beige-300 mb-8 max-w-lg">
                Découvrez l'art de la customisation et restauration de perruques. 
                Des services premium réalisés avec passion par nos maîtres-artisans.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/booking" className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-gold-500 to-gold-600 text-noir-900 font-bold rounded-xl hover:from-gold-600 hover:to-gold-700 transition-all duration-300 group">
                  <Calendar className="w-5 h-5 mr-2" />
                  <span>Réserver maintenant</span>
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/services" className="inline-flex items-center justify-center px-8 py-4 border border-beige-800 text-beige-300 rounded-xl hover:bg-beige-800/30 transition-colors">
                  <Scissors className="w-5 h-5 mr-2" />
                  <span>Voir nos services</span>
                </Link>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="relative">
              <div className="relative z-10 bg-gradient-to-br from-noir-800/80 to-noir-900/90 backdrop-blur-sm rounded-2xl border border-gold-400/20 p-8">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gold-400/10 rounded-2xl mb-4">
                    <Scissors className="w-10 h-10 text-gold-400" />
                  </div>
                  <h3 className="text-2xl font-display font-bold text-gold-400">Services en Vedette</h3>
                </div>
                
                <div className="space-y-4">
                  {loading ? (
                    Array.from({length:3}).map((_,i)=>(
                      <div key={i} className="p-4 bg-noir-700/30 rounded-xl border border-beige-800/20 animate-pulse" />
                    ))
                  ) : (
                    featuredServices.map((service) => (
                      <div key={service.id} className="flex items-center justify-between p-4 bg-noir-700/30 rounded-xl border border-beige-800/20 hover:border-gold-400/30 transition-colors">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gold-400/10 rounded-lg flex items-center justify-center">
                            <Star className="w-6 h-6 text-gold-400" />
                          </div>
                          <div>
                            <h4 className="font-bold text-beige-100">{service.name}</h4>
                            <p className="text-sm text-beige-400">{service.duration ?? '—'} minutes</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-gold-400">{(Number(service.price) || 0).toFixed(0)}$</div>
                          <Link to={`/booking?service=${service.id}`} className="text-sm text-beige-400 hover:text-gold-400 transition-colors">Réserver →</Link>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                
                <div className="mt-6 pt-6 border-t border-beige-800/30">
                  <div className="flex items-center justify-between">
                    <span className="text-beige-300">{services.length} services disponibles</span>
                    <Link to="/services" className="text-gold-400 hover:text-gold-300 transition-colors font-medium">Tout voir</Link>
                  </div>
                </div>
              </div>
              
              <div className="absolute -top-4 -right-4 w-8 h-8 border-t-2 border-r-2 border-gold-400/50 rounded-tr-2xl" />
              <div className="absolute -bottom-4 -left-4 w-8 h-8 border-b-2 border-l-2 border-gold-400/50 rounded-bl-2xl" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: `${Math.max(0, services.length * 50)}+`, label: 'Clients Satisfaits', icon: <Users className="w-8 h-8" /> },
              { value: '4.9★', label: 'Avis Clients', icon: <Star className="w-8 h-8" /> },
              { value: stylists.length || '—', label: 'Experts', icon: <Scissors className="w-8 h-8" /> },
              { value: '100%', label: 'Garantie Qualité', icon: <Shield className="w-8 h-8" /> }
            ].map((stat, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className="text-center p-6 bg-noir-800/30 rounded-2xl border border-beige-800/20 hover:border-gold-400/30 transition-colors">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gold-400/10 rounded-full mb-4 mx-auto">
                  <div className="text-gold-400">{stat.icon}</div>
                </div>
                <div className="text-3xl font-display font-bold text-gold-400 mb-2">{stat.value}</div>
                <div className="text-beige-300">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-display font-bold text-gold-400 mb-6">Nos Services Premium</h2>
            <p className="text-xl text-beige-300 max-w-2xl mx-auto">Découvrez notre sélection de services les plus populaires, réalisés avec excellence par notre équipe d'experts.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {loading ? Array.from({length:3}).map((_,i)=>(<div key={i} className="animate-pulse h-64 bg-noir-800/30 rounded-2xl" />)) : featuredServices.map((service, index) => (
              <ServiceCard key={service.id} service={service} index={index} />
            ))}
          </div>

          <div className="text-center">
            <Link to="/services" className="inline-flex items-center justify-center px-8 py-4 border-2 border-gold-400/30 text-gold-400 font-bold rounded-xl hover:bg-gold-400/10 transition-all group">
              <span>Découvrir tous nos services</span>
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Our Stylists */}
      <section className="py-20 bg-noir-800/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-display font-bold text-gold-400 mb-6">Notre Équipe d'Experts</h2>
            <p className="text-xl text-beige-300 max-w-2xl mx-auto">Rencontrez nos maîtres-artisans dévoués à sublimer votre perruque avec passion et expertise.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {loading ? Array.from({length:2}).map((_,i)=>(<div key={i} className="animate-pulse h-40 bg-noir-800/30 rounded-2xl" />)) : featuredStylists.map((stylist, index) => (
              <StylistCard key={stylist.id} stylist={stylist} index={index} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/contact" className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-gold-500/10 to-gold-400/5 border border-gold-400/30 text-gold-400 font-bold rounded-xl hover:bg-gold-400/20 transition-all">
              <Heart className="w-5 h-5 mr-2" />
              <span>Rencontrer notre équipe</span>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-gold-500/10 via-gold-400/5 to-gold-500/10 border border-gold-400/20 rounded-2xl p-12 text-center">
              <h2 className="text-4xl font-display font-bold text-gold-400 mb-6">Prêt à Sublimer Votre Perruque ?</h2>
              <p className="text-xl text-beige-300 mb-8 max-w-2xl mx-auto">Réservez dès maintenant votre consultation personnalisée avec nos experts. Un acompte de 15% confirme votre rendez-vous.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/booking" className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-gold-500 to-gold-600 text-noir-900 font-bold rounded-xl hover:from-gold-600 hover:to-gold-700 transition-all duration-300 group">
                  <Calendar className="w-5 h-5 mr-2" />
                  <span>Réserver un rendez-vous</span>
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/contact" className="inline-flex items-center justify-center px-8 py-4 border border-beige-800 text-beige-300 rounded-xl hover:bg-beige-800/30 transition-colors">
                  <span>Nous contacter</span>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
