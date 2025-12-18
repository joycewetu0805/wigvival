import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  Scissors,
  User,
  Phone,
  Mail,
  ChevronRight,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';

const BookingPage = () => {
  const navigate = useNavigate();

  // Steps
  const [step, setStep] = useState(1);

  // Data from API
  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);

  // Selections
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedTime, setSelectedTime] = useState('');

  // Form
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    notes: ''
  });

  // UI state
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Load services
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoadingServices(true);
      try {
        const res = await api.get('/services');
        if (!mounted) return;
        // Expect array of services; filter active ones
        setServices(Array.isArray(res.data) ? res.data.filter(s => s.is_active !== false) : []);
      } catch (err) {
        console.error(err);
        toast.error('Impossible de charger les services.');
        setServices([]);
      } finally {
        if (mounted) setLoadingServices(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  // When user picks date & service -> fetch availability
  useEffect(() => {
    if (!selectedService || !selectedDate) {
      setAvailableTimes([]);
      setSelectedTime('');
      return;
    }
    let mounted = true;
    const fetchAvail = async () => {
      setCheckingAvailability(true);
      setAvailableTimes([]);
      setSelectedTime('');
      try {
        // Backend expected endpoint (adjust if needed)
        const res = await api.get(`/services/${selectedService.id}/availability`, {
          params: { date: selectedDate }
        });
        if (!mounted) return;
        // Expect array of times: ["09:00", "09:30", ...]
        setAvailableTimes(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error(err);
        toast.error('Impossible de récupérer les créneaux disponibles.');
        setAvailableTimes([]);
      } finally {
        if (mounted) setCheckingAvailability(false);
      }
    };
    fetchAvail();
    return () => { mounted = false; };
  }, [selectedService, selectedDate]);

  // Helpers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const calculateDeposit = () => {
    return selectedService ? (selectedService.price * 0.15).toFixed(2) : '0.00';
  };

  const calculateTotal = () => {
    if (!selectedService) return '0.00';
    const price = Number(selectedService.price || 0);
    const tps = price * 0.05;
    const tvq = price * 0.09975;
    return (price + tps + tvq).toFixed(2);
  };

  // Submit reservation -> create appointment server-side, then redirect to payment
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedService) return toast.error('Sélectionne d\'abord un service.');
    if (!selectedDate || !selectedTime) return toast.error('Sélectionne la date et l\'heure.');
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim()) {
      return toast.error('Complète les informations personnelles requises.');
    }
    if (!validateEmail(formData.email)) return toast.error('Email invalide.');

    setSubmitting(true);
    try {
      const payload = {
        serviceId: selectedService.id,
        date: selectedDate,
        time: selectedTime,
        customer: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone || null
        },
        notes: formData.notes || null,
        depositAmount: Number(calculateDeposit())
      };
      const res = await api.post('/appointments', payload);
      // Expect created appointment with id
      const appointmentId = res?.data?.id || res?.data?.appointmentId;
      if (!appointmentId) {
        toast.success('Réservation créée. Vérifie ton tableau de bord.');
        setStep(4);
        return;
      }
      toast.success('Réservation créée — redirection vers le paiement.');
      // Navigate to payment page (server should create unpaid appointment)
      navigate(`/payment/${appointmentId}`);
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.message || 'Impossible de créer la réservation.';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // accessibility helpers
  const minDate = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-gradient-to-b from-noir-900 to-noir-800 py-8">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-gold-400 mb-2">Réservez Votre Prestation</h1>
          <p className="text-beige-300">Choisis un service, une date, et confirme en payant l'acompte.</p>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          {/* Steps bar simplified for mobile accessibility */}
          <div className="mb-6 grid grid-cols-4 gap-2 text-xs text-center">
            {[1,2,3,4].map(n => (
              <div key={n} className={`py-2 rounded ${step >= n ? 'bg-gold-400/10 text-gold-300' : 'bg-noir-800/40 text-beige-400'}`}>
                {n === 1 && 'Service'}
                {n === 2 && 'Date'}
                {n === 3 && 'Infos'}
                {n === 4 && 'Fin'}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-noir-800/50 rounded-2xl border border-beige-800/30 p-6">

                {/* STEP 1 */}
                {step === 1 && (
                  <>
                    <h2 className="text-xl font-bold text-gold-400 mb-4">1 — Choisis un service</h2>
                    {loadingServices ? (
                      <div className="space-y-3">
                        {[1,2,3].map(i => <div key={i} className="h-20 bg-noir-800/30 rounded animate-pulse" />)}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {services.length === 0 && <div className="text-beige-400">Aucun service disponible.</div>}
                        {services.map(s => (
                          <button
                            key={s.id}
                            onClick={() => { setSelectedService(s); }}
                            aria-pressed={selectedService?.id === s.id}
                            className={`w-full text-left p-4 rounded-lg border transition ${selectedService?.id === s.id ? 'border-gold-400 bg-gold-400/10' : 'border-beige-800/30 hover:border-beige-700'}`}
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="font-bold text-beige-100">{s.name}</div>
                                <div className="text-sm text-beige-400 mt-1 line-clamp-2">{s.description}</div>
                                <div className="mt-2 text-sm text-beige-300">{s.duration} min • {s.is_featured ? 'Premium' : 'Standard'}</div>
                              </div>
                              <div className="text-right">
                                <div className="text-gold-400 font-bold">{Number(s.price).toFixed(2)} $CA</div>
                                <ChevronRight className={`w-5 h-5 mt-2 ${selectedService?.id === s.id ? 'text-gold-400' : 'text-beige-600'}`} />
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}

                    <div className="flex justify-end mt-6">
                      <button
                        onClick={() => setStep(2)}
                        disabled={!selectedService}
                        className={`px-6 py-3 rounded-lg font-bold ${selectedService ? 'bg-gradient-to-r from-gold-500 to-gold-600' : 'bg-beige-800/50 text-beige-500 cursor-not-allowed'}`}
                      >
                        Suivant
                      </button>
                    </div>
                  </>
                )}

                {/* STEP 2 */}
                {step === 2 && (
                  <>
                    <h2 className="text-xl font-bold text-gold-400 mb-4">2 — Date & créneau</h2>

                    <label className="block text-beige-300 mb-2">Date souhaitée</label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={e => setSelectedDate(e.target.value)}
                      min={minDate}
                      className="w-full bg-noir-700 border border-beige-800/50 rounded-lg px-3 py-2 mb-4 text-beige-100"
                    />

                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-beige-300">Créneaux disponibles</div>
                        {checkingAvailability && <div className="text-sm text-beige-400">Chargement...</div>}
                      </div>

                      {selectedDate && !checkingAvailability && availableTimes.length === 0 && (
                        <div className="p-4 rounded bg-noir-800/30 text-beige-400">Aucun créneau disponible pour cette date.</div>
                      )}

                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-2">
                        {availableTimes.map(t => (
                          <button
                            key={t}
                            onClick={() => setSelectedTime(t)}
                            className={`p-2 rounded-lg text-sm ${selectedTime === t ? 'bg-gold-400/10 border border-gold-400 text-gold-400' : 'bg-noir-800/30 border border-beige-800/20 text-beige-300'}`}
                          >
                            <div className="font-medium">{t}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between mt-6">
                      <button onClick={() => setStep(1)} className="px-4 py-2 border rounded text-beige-300">Retour</button>
                      <button
                        onClick={() => setStep(3)}
                        disabled={!selectedDate || !selectedTime}
                        className={`px-6 py-3 rounded-lg font-bold ${selectedDate && selectedTime ? 'bg-gradient-to-r from-gold-500 to-gold-600' : 'bg-beige-800/50 text-beige-500 cursor-not-allowed'}`}
                      >
                        Suivant
                      </button>
                    </div>
                  </>
                )}

                {/* STEP 3 */}
                {step === 3 && (
                  <>
                    <h2 className="text-xl font-bold text-gold-400 mb-4">3 — Vos informations</h2>
                    <form onSubmit={handleSubmit}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="Prénom" required className="p-3 bg-noir-700 border rounded" />
                        <input name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Nom" required className="p-3 bg-noir-700 border rounded" />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                        <input name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="Email" required className="p-3 bg-noir-700 border rounded" />
                        <input name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Téléphone (optionnel)" className="p-3 bg-noir-700 border rounded" />
                      </div>

                      <textarea name="notes" value={formData.notes} onChange={handleInputChange} placeholder="Notes ou infos particulières (optionnel)" rows="3" className="w-full mt-3 p-3 bg-noir-700 border rounded" />

                      <div className="p-3 bg-noir-700/30 rounded mt-4 text-sm">
                        <div className="flex items-start gap-3">
                          <AlertCircle className="w-5 h-5 text-gold-400 mt-1" />
                          <div>
                            En confirmant, un acompte de <strong>{calculateDeposit()} $CA</strong> sera requis. Le montant total est <strong>{calculateTotal()} $CA</strong>.
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center mt-4">
                        <input id="terms" type="checkbox" required className="mr-3" />
                        <label htmlFor="terms" className="text-sm text-beige-300">J'accepte les conditions et le prélèvement de l'acompte.</label>
                      </div>

                      <div className="flex justify-between mt-6">
                        <button type="button" onClick={() => setStep(2)} className="px-4 py-2 border rounded text-beige-300">Retour</button>
                        <button type="submit" disabled={submitting} className={`px-6 py-3 rounded-lg font-bold ${submitting ? 'opacity-60 cursor-not-allowed' : 'bg-gradient-to-r from-gold-500 to-gold-600'}`}>
                          {submitting ? 'Création...' : 'Confirmer & Payer l\'acompte'}
                        </button>
                      </div>
                    </form>
                  </>
                )}

                {/* STEP 4 (confirmation fallback) */}
                {step === 4 && (
                  <div className="text-center py-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full mb-4">
                      <CheckCircle className="w-8 h-8 text-green-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gold-400">Réservation enregistrée</h3>
                    <p className="text-beige-300">Vérifie ton email ou ton tableau de bord pour le détail et le paiement.</p>
                    <div className="mt-4">
                      <button onClick={() => navigate('/dashboard')} className="px-6 py-2 rounded bg-gradient-to-r from-gold-500 to-gold-600">Voir mon tableau</button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right column summary */}
            <aside className="lg:col-span-1">
              <div className="sticky top-20 space-y-4">
                <div className="bg-gradient-to-br from-noir-800 to-noir-900 rounded-2xl border border-gold-500/10 p-4">
                  <h3 className="text-lg font-bold text-gold-400 mb-3">Récapitulatif</h3>
                  {!selectedService ? (
                    <div className="text-beige-400">Choisis un service pour voir le récapitulatif.</div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-gold-400/10 rounded"><Scissors className="w-5 h-5 text-gold-400" /></div>
                        <div>
                          <div className="font-bold text-beige-100">{selectedService.name}</div>
                          <div className="text-sm text-beige-400">{selectedService.duration} min</div>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-beige-800/20 text-sm text-beige-300">
                        <div className="flex justify-between"><span>Sous-total</span><span className="text-beige-100">{Number(selectedService.price || 0).toFixed(2)} $CA</span></div>
                        <div className="flex justify-between"><span>TPS (5%)</span><span>{(Number(selectedService.price || 0) * 0.05).toFixed(2)} $CA</span></div>
                        <div className="flex justify-between"><span>TVQ (9.975%)</span><span>{(Number(selectedService.price || 0) * 0.09975).toFixed(2)} $CA</span></div>
                        <div className="flex justify-between font-bold text-gold-400 pt-3"><span>Total</span><span>{calculateTotal()} $CA</span></div>
                        <div className="flex justify-between text-sm pt-2"><span>Acompte (15%)</span><span className="font-bold text-gold-400">{calculateDeposit()} $CA</span></div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-noir-800/30 rounded p-4 border border-beige-800/20">
                  <div className="flex items-center gap-3 mb-2"><Phone className="w-5 h-5 text-gold-400"/><div className="text-sm text-beige-300">+1 (514) 123-4567</div></div>
                  <div className="flex items-center gap-3 mb-2"><Mail className="w-5 h-5 text-gold-400"/><div className="text-sm text-beige-300">contact@wigvival.ca</div></div>
                  <div className="flex items-center gap-3"><Clock className="w-5 h-5 text-gold-400"/><div className="text-sm text-beige-300">Lun-Sam: 9h-20h</div></div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
