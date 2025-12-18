import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Scissors, Star, Clock, DollarSign, ChevronRight } from 'lucide-react';
import PropTypes from 'prop-types';


const categoryMeta = {
  customisation: { emoji: '✨', label: 'Customisation', bg: 'from-purple-500/20 to-purple-600/10', badge: 'bg-purple-500/20 text-purple-400' },
  restauration: { emoji: '💧', label: 'Restauration', bg: 'from-blue-500/20 to-blue-600/10', badge: 'bg-blue-500/20 text-blue-400' },
  styling: { emoji: '💨', label: 'Styling', bg: 'from-green-500/20 to-green-600/10', badge: 'bg-green-500/20 text-green-400' },
  default: { emoji: '✂️', label: 'Service', bg: 'from-gold-500/20 to-gold-600/10', badge: 'bg-gold-400/10 text-gold-400' }
};

const formatPrice = (n) =>
  typeof n === 'number'
    ? n.toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' }).replace('CA$', '$')
    : n;

const ServiceCard = React.memo(function ServiceCard({ service, index = 0, compact = false }) {
  const meta = categoryMeta[service.category] || categoryMeta.default;

  if (compact) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }} className="group">
        <Link
          to={`/booking?service=${service.id}`}
          aria-label={`Réserver ${service.name}`}
          className="block bg-gradient-to-br from-noir-800 to-noir-900 rounded-xl border border-beige-800/30 p-4 hover:border-gold-400/50 hover:shadow-lg transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${meta.bg} flex items-center justify-center`}>
                <span aria-hidden="true" className="text-lg">{meta.emoji}</span>
              </div>
              <div>
                <h3 className="font-bold text-beige-100">{service.name}</h3>
                <div className="flex items-center space-x-3 text-sm text-beige-400">
                  <span className="flex items-center"><Clock className="w-3 h-3 mr-1" />{service.duration}min</span>
                  <span className="flex items-center"><DollarSign className="w-3 h-3 mr-1" />{formatPrice(service.price)}</span>
                </div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-beige-600 group-hover:text-gold-400 transition-colors" />
          </div>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }} className="group relative">
      <div className="relative bg-gradient-to-b from-noir-800/80 to-noir-900/90 backdrop-blur-sm rounded-2xl border border-beige-800/30 overflow-hidden hover:border-gold-400/50 transition-all h-full flex flex-col">
        {service.is_featured && (
          <div className="absolute top-4 right-4 z-10">
            <div className="px-3 py-1 bg-gradient-to-r from-gold-500 to-gold-600 text-noir-900 text-xs font-bold rounded-full flex items-center space-x-1">
              <Star className="w-3 h-3" /><span>PREMIUM</span>
            </div>
          </div>
        )}

        <div className="h-48 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-gold-400/20 to-noir-800 flex items-center justify-center">
            <div className={`w-20 h-20 rounded-xl bg-gradient-to-br ${meta.bg} flex items-center justify-center`} aria-hidden>
              <span className="text-3xl">{meta.emoji}</span>
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-noir-900/90 via-transparent to-transparent" />
          <div className="absolute top-4 left-4">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${meta.badge}`}>{meta.label}</span>
          </div>
        </div>

        <div className="p-6 flex-1 flex flex-col">
          <div className="mb-4">
            <h3 className="text-xl font-display font-bold text-gold-400 mb-2">{service.name}</h3>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-beige-100">{formatPrice(service.price)}</div>
              <div className="flex items-center text-beige-400 text-sm"><Clock className="w-4 h-4 mr-1" />{service.duration} min</div>
            </div>
          </div>

          <p className="text-beige-300 text-sm mb-6 line-clamp-3">{service.description}</p>

          <div className="mb-6 space-y-2">
            {service.features?.slice(0, 3).map((f, i) => (
              <div key={i} className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 rounded-full bg-gold-400" />
                <span className="text-sm text-beige-400">{f}</span>
              </div>
            ))}
          </div>

          <div className="mb-4 p-3 bg-noir-700/30 rounded-lg border border-beige-800/20">
            <div className="flex justify-between items-center text-sm">
              <span className="text-beige-400">Acompte requis</span>
              <span className="text-gold-400 font-bold">{(service.price * 0.15).toFixed(2)} $CA (15%)</span>
            </div>
          </div>

          <div className="mt-auto">
            <Link to={`/booking?service=${service.id}`} aria-label={`Réserver ${service.name}`} className="w-full inline-flex items-center justify-center px-4 py-3 bg-gradient-to-r from-gold-500/10 to-gold-400/5 border border-gold-400/30 text-gold-400 font-medium rounded-xl hover:from-gold-400/20 hover:to-gold-400/10 transition-transform">
              <span>Réserver maintenant</span>
              <ChevronRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

ServiceCard.propTypes = {
  service: PropTypes.object.isRequired,
  index: PropTypes.number,
  compact: PropTypes.bool
};

export default ServiceCard;
