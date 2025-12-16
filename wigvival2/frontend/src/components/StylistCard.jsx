import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { User, Star, Award, Sparkles, Scissors, Heart, Mail, Phone } from 'lucide-react';

const getInitials = (first = '', last = '') => {
  const a = (first || '').trim().charAt(0) || '';
  const b = (last || '').trim().charAt(0) || '';
  return (a + b).toUpperCase() || 'W';
};

const StylistCard = React.memo(function StylistCard({ stylist = {}, index = 0 }) {
  const {
    firstName = '',
    lastName = '',
    title = '',
    bio = '',
    specialties = [],
    experience = '—',
    rating = '—',
    photoUrl = ''
  } = stylist;

  const initials = getInitials(firstName, lastName);
  const fullName = `${firstName} ${lastName}`.trim() || 'Artisan WIGVIVAL';

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }} className="group relative">
      <div className="relative bg-gradient-to-b from-noir-800/80 to-noir-900/90 backdrop-blur-sm rounded-2xl border border-beige-800/30 overflow-hidden hover:border-gold-400/50 transition-all duration-300 h-full flex flex-col">
        {/* Header / Photo */}
        <div className="relative h-48 overflow-hidden flex items-center justify-center bg-noir-900">
          {photoUrl ? (
            <img
              src={photoUrl}
              alt={`Portrait de ${fullName}`}
              loading="lazy"
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gold-400/20 to-noir-800">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center" aria-hidden>
                <span className="text-4xl font-display font-bold text-noir-900">{initials}</span>
              </div>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-noir-900/80 via-transparent to-transparent" aria-hidden />
          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="text-2xl font-display font-bold text-gold-400 leading-tight">{fullName}</h3>
            <p className="text-beige-300 text-sm truncate">{title}</p>
          </div>

          <div className="absolute top-4 right-4">
            <div className="flex items-center space-x-1 px-3 py-1 bg-noir-900/80 backdrop-blur-sm rounded-full">
              <Star className="w-4 h-4 text-gold-400" />
              <span className="text-sm font-bold text-beige-100">{rating}</span>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 flex-1 flex flex-col">
          <p className="text-beige-300 text-sm leading-relaxed mb-4 line-clamp-3">{bio}</p>

          <div className="mb-4">
            <h4 className="text-sm font-bold text-beige-200 mb-3 flex items-center">
              <Sparkles className="w-4 h-4 mr-2 text-gold-400" /> Spécialités
            </h4>
            <div className="flex flex-wrap gap-2">
              {specialties && specialties.length ? specialties.map((s, i) => (
                <span key={i} className="px-3 py-1 bg-gold-400/10 text-gold-400 text-xs rounded-full border border-gold-400/20">{s}</span>
              )) : <span className="text-sm text-beige-400">Aucune spécialité renseignée</span>}
            </div>
          </div>

          <div className="mb-4">
            <div className="flex items-center justify-between p-3 bg-noir-700/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gold-400/10 rounded-lg"><Award className="w-5 h-5 text-gold-400" /></div>
                <div><div className="text-sm text-beige-400">Expérience</div><div className="font-bold text-beige-100">{experience}</div></div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gold-400/10 rounded-lg"><Scissors className="w-5 h-5 text-gold-400" /></div>
                <div><div className="text-sm text-beige-400">Services</div><div className="font-bold text-beige-100">{specialties.length}</div></div>
              </div>
            </div>
          </div>

          <div className="mt-auto pt-4 border-t border-beige-800/30">
            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                <button aria-label={`Favoris ${fullName}`} className="p-2 text-beige-400 hover:text-gold-400 hover:bg-gold-400/10 rounded-lg transition-colors"><Heart className="w-4 h-4" /></button>
                <button aria-label={`Envoyer un email à ${fullName}`} className="p-2 text-beige-400 hover:text-gold-400 hover:bg-gold-400/10 rounded-lg transition-colors"><Mail className="w-4 h-4" /></button>
                <button aria-label={`Appeler ${fullName}`} className="p-2 text-beige-400 hover:text-gold-400 hover:bg-gold-400/10 rounded-lg transition-colors"><Phone className="w-4 h-4" /></button>
              </div>

              <button aria-label={`Voir portfolio de ${fullName}`} className="px-4 py-2 bg-gradient-to-r from-gold-500/10 to-gold-400/5 border border-gold-400/30 text-gold-400 text-sm font-medium rounded-lg hover:from-gold-400/20 hover:to-gold-400/10 transition-all">Voir le portfolio</button>
            </div>
          </div>
        </div>

        <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b-2 border-r-2 border-gold-400/30 rounded-br-2xl" aria-hidden />
      </div>
    </motion.div>
  );
});

StylistCard.propTypes = {
  stylist: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    title: PropTypes.string,
    bio: PropTypes.string,
    specialties: PropTypes.array,
    experience: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    rating: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    photoUrl: PropTypes.string
  }),
  index: PropTypes.number
};

export default StylistCard;
