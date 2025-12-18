import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Scissors, 
  Droplets, 
  Wind, 
  Star, 
  CheckCircle,
  Clock,
  DollarSign,
  Info
} from 'lucide-react';
import api from '../../services/api';

const ServiceSelector = ({ services: propServices, selectedService, onSelect, onNext }) => {
  const [services, setServices] = useState(propServices || []);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(!propServices);
  const [detailedView, setDetailedView] = useState(null);

  useEffect(() => {
    if (!propServices) {
      fetchServices();
    }
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await api.get('/services');
      setServices(response.data);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredServices = services.filter(service => {
    if (!service.is_active) return false;
    if (filter === 'all') return true;
    return service.category === filter;
  });
// Mettre à jour les catégories dans ServiceSelector.jsx
const categories = [
  { id: 'all', name: 'Tous', icon: <Scissors className="w-4 h-4" />, count: services.filter(s => s.is_active).length },
  { id: 'customisation', name: 'Customisation', icon: <Sparkles className="w-4 h-4" />, count: services.filter(s => s.category === 'customisation' && s.is_active).length },
  { id: 'restauration', name: 'Restauration', icon: <Droplets className="w-4 h-4" />, count: services.filter(s => s.category === 'restauration' && s.is_active).length },
  { id: 'styling', name: 'Styling', icon: <Wind className="w-4 h-4" />, count: services.filter(s => s.category === 'styling' && s.is_active).length }
];

// Mettre à jour la fonction getCategoryIcon
const getCategoryIcon = (category) => {
  switch(category) {
    case 'customisation': return <Sparkles className="w-5 h-5" />;
    case 'restauration': return <Droplets className="w-5 h-5" />;
    case 'styling': return <Wind className="w-5 h-5" />;
    default: return <Scissors className="w-5 h-5" />;
  }
};

  if (loading) {
    return (
      <div className="py-12">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold-400"></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* En-tête */}
      <div className="mb-8">
        <h3 className="text-2xl font-display font-bold text-gold-400 mb-4">
          Choisissez Votre Service
        </h3>
        <p className="text-beige-300">
          Sélectionnez l'un de nos services premium pour sublimer votre perruque
        </p>
      </div>

      {/* Filtres */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setFilter(category.id)}
              className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all ${
                filter === category.id
                  ? 'bg-gold-400/20 border-gold-400/50 text-gold-400'
                  : 'border-beige-800/30 text-beige-400 hover:border-beige-700 hover:text-beige-300'
              }`}
            >
              <span>{category.icon}</span>
              <span className="font-medium">{category.name}</span>
              <span className="text-xs bg-beige-800/50 px-2 py-0.5 rounded-full">
                {category.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      <div className="space-y-4 mb-8">
        {filteredServices.map((service) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`relative cursor-pointer transition-all duration-300 ${
              selectedService?.id === service.id
                ? 'ring-2 ring-gold-400 ring-offset-2 ring-offset-noir-800'
                : 'hover:scale-[1.02]'
            }`}
            onClick={() => onSelect(service)}
          >
            <div className="bg-gradient-to-r from-noir-800/80 to-noir-900/90 backdrop-blur-sm rounded-xl border border-beige-800/30 overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  {/* Informations de base */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="p-2 bg-gold-400/10 rounded-lg">
                        {getCategoryIcon(service.category)}
                      </div>
                      <div>
                        <h4 className="text-lg font-display font-bold text-gold-400">
                          {service.name}
                        </h4>
                        <div className="flex items-center space-x-4 mt-1">
                          <div className="flex items-center space-x-1 text-beige-400 text-sm">
                            <Clock className="w-4 h-4" />
                            <span>{service.duration} min</span>
                          </div>
                          <div className="flex items-center space-x-1 text-beige-100 text-sm font-bold">
                            <DollarSign className="w-4 h-4" />
                            <span>{service.price.toFixed(2)} $CA</span>
                          </div>
                          {service.is_featured && (
                            <div className="flex items-center space-x-1 text-gold-400 text-sm">
                              <Star className="w-4 h-4" />
                              <span>Premium</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Description courte */}
                    <p className="text-beige-300 text-sm line-clamp-2 mb-4">
                      {service.description.substring(0, 150)}...
                    </p>

                    {/* Features */}
                    <div className="flex flex-wrap gap-2">
                      {service.features?.slice(0, 3).map((feature, idx) => (
                        <div
                          key={idx}
                          className="inline-flex items-center space-x-1 px-3 py-1 bg-beige-800/20 rounded-full text-xs text-beige-400"
                        >
                          <CheckCircle className="w-3 h-3" />
                          <span>{feature}</span>
                        </div>
                      ))}
                      {service.features?.length > 3 && (
                        <div className="inline-flex items-center px-3 py-1 bg-beige-800/20 rounded-full text-xs text-beige-400">
                          +{service.features.length - 3} autres
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bouton de sélection */}
                  <div className="ml-4">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedService?.id === service.id
                        ? 'border-gold-400 bg-gold-400'
                        : 'border-beige-600'
                    }`}>
                      {selectedService?.id === service.id && (
                        <div className="w-2 h-2 rounded-full bg-noir-900" />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Acompte requis */}
              <div className="px-6 py-3 bg-noir-700/30 border-t border-beige-800/20">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2 text-beige-400">
                    <Info className="w-4 h-4" />
                    <span>Acompte requis pour confirmer</span>
                  </div>
                  <div className="text-gold-400 font-bold">
                    {(service.price * 0.15).toFixed(2)} $CA (15%)
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredServices.length === 0 && (
        <div className="text-center py-12 bg-noir-800/30 rounded-xl">
          <Scissors className="w-12 h-12 text-beige-600 mx-auto mb-4" />
          <p className="text-beige-400">
            Aucun service disponible dans cette catégorie.
          </p>
        </div>
      )}

      {/* Bouton de navigation */}
      <div className="flex justify-between pt-6 border-t border-beige-800/50">
        <div className="text-sm text-beige-400">
          {selectedService && (
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-gold-400" />
              <span>
                Service sélectionné : <strong className="text-gold-400">{selectedService.name}</strong>
              </span>
            </div>
          )}
        </div>
        
        <button
          onClick={onNext}
          disabled={!selectedService}
          className={`px-6 py-3 rounded-lg font-bold transition-all ${
            selectedService
              ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-noir-900 hover:from-gold-600 hover:to-gold-700'
              : 'bg-beige-800/50 text-beige-500 cursor-not-allowed'
          }`}
        >
          Choisir une date
        </button>
      </div>
    </div>
  );
};

export default ServiceSelector;