import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock,
  Send,
  CheckCircle
} from 'lucide-react';
import api from '../services/api';
import { toast } from 'react-toastify';

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.subject || !formData.message.trim()) {
      toast.error('Complète tous les champs requis.');
      return;
    }
    if (!validateEmail(formData.email)) {
      toast.error('Adresse e-mail invalide.');
      return;
    }

    setSubmitting(true);
    try {
      // Envoie vers backend — adapte l'endpoint si nécessaire
      await api.post('/contact', { ...formData });
      setSubmitted(true);
      toast.success('Message envoyé — on te répond sous 24h.');
      // reset form after short delay so user sees the success screen
      setTimeout(() => {
        setSubmitted(false);
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      }, 3000);
    } catch (err) {
      const msg = err?.response?.data?.message || 'Impossible d\'envoyer le message. Réessaie.';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-noir-900 to-noir-800 py-12">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-5xl font-display font-bold text-gold-400 mb-6">Contactez-nous</h1>
          <p className="text-xl text-beige-300">Nous sommes là pour répondre à toutes vos questions et prendre soin de votre perruque.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
            <div className="bg-gradient-to-br from-noir-800 to-noir-900 rounded-2xl border border-beige-800/30 p-8">
              <h2 className="text-2xl font-display font-bold text-gold-400 mb-6">Informations de contact</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-gold-400/10 rounded-lg"><MapPin className="w-6 h-6 text-gold-400" /></div>
                  <div>
                    <h3 className="font-bold text-beige-100 mb-1">Adresse</h3>
                    <p className="text-beige-300">123 Rue de la Beauté</p>
                    <p className="text-beige-400">Montréal, QC H3A 1A1</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-gold-400/10 rounded-lg"><Phone className="w-6 h-6 text-gold-400" /></div>
                  <div>
                    <h3 className="font-bold text-beige-100 mb-1">Téléphone</h3>
                    <a href="tel:+15141234567" className="text-beige-300 hover:text-gold-400 transition-colors">+1 (514) 123-4567</a>
                    <p className="text-beige-400 text-sm mt-1">Lun-Sam: 9h-20h</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-gold-400/10 rounded-lg"><Mail className="w-6 h-6 text-gold-400" /></div>
                  <div>
                    <h3 className="font-bold text-beige-100 mb-1">Email</h3>
                    <a href="mailto:contact@wigvival.ca" className="text-beige-300 hover:text-gold-400 transition-colors">contact@wigvival.ca</a>
                    <p className="text-beige-400 text-sm mt-1">Réponse sous 24h</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-gold-400/10 rounded-lg"><Clock className="w-6 h-6 text-gold-400" /></div>
                  <div>
                    <h3 className="font-bold text-beige-100 mb-1">Horaires</h3>
                    <p className="text-beige-300">Lundi - Samedi: 9h00 - 20h00</p>
                    <p className="text-beige-400">Dimanche: Fermé</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gold-500/10 to-transparent rounded-2xl border border-gold-400/20 p-8">
              <h3 className="text-xl font-display font-bold text-gold-400 mb-4">Besoin d'un rendez-vous urgent ?</h3>
              <p className="text-beige-300 mb-4">Pour une demande urgente, contacte-nous directement par téléphone.</p>
              <a href="tel:+15141234567" className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-gold-500 to-gold-600 text-noir-900 font-bold rounded-xl hover:from-gold-600 hover:to-gold-700 transition-all">
                <Phone className="w-5 h-5 mr-2" /> Appeler maintenant
              </a>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <div className="bg-gradient-to-br from-noir-800 to-noir-900 rounded-2xl border border-beige-800/30 p-8">
              <h2 className="text-2xl font-display font-bold text-gold-400 mb-6">Envoyez-nous un message</h2>

              {submitted ? (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/20 rounded-full mb-6"><CheckCircle className="w-10 h-10 text-green-400" /></div>
                  <h3 className="text-2xl font-display font-bold text-gold-400 mb-4">Message envoyé !</h3>
                  <p className="text-beige-300">Nous vous répondrons dans les plus brefs délais.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-beige-300 mb-2">Nom complet</label>
                    <input name="name" value={formData.name} onChange={handleInputChange} required className="w-full bg-noir-700 border border-beige-800/50 rounded-lg px-4 py-3 text-beige-100 focus:outline-none focus:border-gold-400" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-beige-300 mb-2">Email</label>
                      <input name="email" type="email" value={formData.email} onChange={handleInputChange} required className="w-full bg-noir-700 border border-beige-800/50 rounded-lg px-4 py-3 text-beige-100 focus:outline-none focus:border-gold-400" />
                    </div>
                    <div>
                      <label className="block text-beige-300 mb-2">Téléphone</label>
                      <input name="phone" value={formData.phone} onChange={handleInputChange} className="w-full bg-noir-700 border border-beige-800/50 rounded-lg px-4 py-3 text-beige-100 focus:outline-none focus:border-gold-400" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-beige-300 mb-2">Sujet</label>
                    <select name="subject" value={formData.subject} onChange={handleInputChange} required className="w-full bg-noir-700 border border-beige-800/50 rounded-lg px-4 py-3 text-beige-100 focus:outline-none focus:border-gold-400">
                      <option value="">Sélectionnez un sujet</option>
                      <option value="reservation">Réservation</option>
                      <option value="information">Demande d'information</option>
                      <option value="urgence">Demande urgente</option>
                      <option value="autre">Autre</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-beige-300 mb-2">Message</label>
                    <textarea name="message" value={formData.message} onChange={handleInputChange} rows="6" required className="w-full bg-noir-700 border border-beige-800/50 rounded-lg px-4 py-3 text-beige-100 focus:outline-none focus:border-gold-400" />
                  </div>

                  <button type="submit" disabled={submitting} className={`w-full inline-flex items-center justify-center px-6 py-4 ${submitting ? 'opacity-80 cursor-not-allowed' : ''} bg-gradient-to-r from-gold-500 to-gold-600 text-noir-900 font-bold rounded-xl hover:from-gold-600 hover:to-gold-700 transition-all group`}>
                    {submitting ? 'Envoi...' : (<><span>Envoyer le message</span><Send className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" /></>)}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
