import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { CreditCard, Lock, CheckCircle, AlertCircle, Calendar } from 'lucide-react';
import api from '../services/api';
import { toast } from 'react-toastify';

const PaymentPage = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');

  useEffect(() => {
    if (!appointmentId) {
      toast.error("Identifiant de rendez-vous manquant.");
      navigate('/dashboard');
      return;
    }
    fetchAppointmentDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appointmentId]);

  const fetchAppointmentDetails = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/appointments/${appointmentId}`);
      const data = response.data || null;
      if (!data) {
        toast.error('Rendez-vous introuvable');
        navigate('/dashboard');
        return;
      }
      setAppointment(data);
    } catch (error) {
      const msg = error?.response?.data?.message || 'Erreur lors du chargement du rendez-vous';
      toast.error(msg);
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!appointment) return;
    const price = Number(appointment.price) || 0;
    const depositAmount = +(price * 0.15).toFixed(2);
    if (depositAmount <= 0) {
      toast.error('Montant d\'acompte invalide.');
      return;
    }

    setProcessing(true);
    try {
      // mock payment id (replace with real provider in prod)
      const mockPaymentId = `pay_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

      const response = await api.post(`/appointments/${appointmentId}/deposit`, {
        paymentMethod,
        paymentId: mockPaymentId,
        amount: depositAmount
      });

      toast.success('Acompte payé avec succès !');
      navigate('/dashboard', { state: { paymentSuccess: true } });
    } catch (error) {
      const msg = error?.response?.data?.message || 'Erreur lors du paiement';
      toast.error(msg);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-noir-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold-400"></div>
      </div>
    );
  }

  if (!appointment) return null;

  // Safe numeric and date parsing
  const price = Number(appointment.price) || 0;
  const depositAmount = +(price * 0.15).toFixed(2);

  const parseDate = (d) => {
    const dt = d ? new Date(d) : null;
    return dt && !isNaN(dt.getTime()) ? dt : null;
  };
  const dueDate = parseDate(appointment.depositDueDate) || parseDate(appointment.date) || new Date(Date.now() + 3 * 24 * 3600 * 1000);
  const today = new Date();
  const isOverdue = dueDate ? today > dueDate : false;
  const daysLeft = dueDate ? Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24)) : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-noir-900 to-noir-800 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-noir-800/50 backdrop-blur-sm rounded-2xl border border-beige-800/30 p-8"
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gold-400/10 rounded-full mb-4">
              <CreditCard className="w-8 h-8 text-gold-400" />
            </div>
            <h1 className="text-3xl font-display font-bold text-gold-400 mb-2">
              Paiement de l'Acompte
            </h1>
            <p className="text-beige-300">
              Sécurisé et crypté - WIGVIVAL utilise une technologie de paiement sécurisée
            </p>
          </div>

          {isOverdue && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
              <div className="flex items-center space-x-3">
                <AlertCircle className="w-6 h-6 text-red-400" />
                <div>
                  <h3 className="font-bold text-red-400">Date limite dépassée</h3>
                  <p className="text-red-300 text-sm">
                    Votre rendez-vous sera automatiquement annulé si l'acompte n'est pas payé immédiatement.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="mb-8 p-6 bg-noir-700/30 rounded-xl">
            <h2 className="text-xl font-display font-bold text-beige-200 mb-4">
              Détails de la réservation
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-beige-400">Service</span>
                <span className="font-bold text-beige-100">{appointment.service?.name || '—'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-beige-400">Date</span>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gold-400" />
                  <span className="font-bold text-beige-100">
                    {parseDate(appointment.date) ? parseDate(appointment.date).toLocaleDateString('fr-CA', {
                      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                    }) : '—'}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-beige-400">Heure</span>
                <span className="font-bold text-beige-100">
                  {parseDate(appointment.date) ? parseDate(appointment.date).toLocaleTimeString('fr-CA', {
                    hour: '2-digit', minute: '2-digit'
                  }) : '—'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-beige-400">Prix total</span>
                <span className="text-beige-100">{price.toFixed(2)} $CA</span>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-display font-bold text-beige-200 mb-4">
              Détails du paiement
            </h2>

            <div className="space-y-6">
              <div className="p-4 bg-gold-400/5 border border-gold-400/20 rounded-xl">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-gold-400">Acompte requis</h3>
                    <p className="text-sm text-beige-400">15% du montant total</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gold-400">
                      {depositAmount.toFixed(2)} $CA
                    </div>
                    <div className="text-sm text-beige-400">
                      Reste à payer : {(price - depositAmount).toFixed(2)} $CA
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-beige-800/10 border border-beige-800/30 rounded-xl">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-beige-200">Date limite</h3>
                    <p className="text-sm text-beige-400">Paiement requis avant cette date</p>
                  </div>
                  <div className={`text-right ${isOverdue ? 'text-red-400' : 'text-beige-100'}`}>
                    <div className="font-bold">
                      {dueDate ? dueDate.toLocaleDateString('fr-CA', { weekday: 'long', month: 'long', day: 'numeric' }) : '—'}
                    </div>
                    <div className="text-sm">
                      {isOverdue ? 'Dépassée' : (daysLeft !== null ? `Dans ${daysLeft} jours` : '—')}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-beige-200 mb-3">Méthode de paiement</h3>
                <div className="grid grid-cols-2 gap-3">
                  {['card', 'paypal'].map((method) => (
                    <button
                      key={method}
                      onClick={() => setPaymentMethod(method)}
                      className={`p-4 rounded-xl border-2 transition-all ${paymentMethod === method ? 'border-gold-400 bg-gold-400/10' : 'border-beige-800/50 hover:border-beige-700'}`}
                      type="button"
                    >
                      <div className="flex items-center justify-center space-x-2">
                        {method === 'card' ? (
                          <>
                            <CreditCard className="w-5 h-5" />
                            <span>Carte bancaire</span>
                          </>
                        ) : (
                          <>
                            <div className="w-5 h-5 bg-blue-500 rounded" />
                            <span>PayPal</span>
                          </>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {paymentMethod === 'card' && (
            <div className="mb-8">
              <div className="space-y-4">
                <div>
                  <label className="block text-beige-300 mb-2">Numéro de carte</label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    className="w-full bg-noir-700 border border-beige-800/50 rounded-lg px-4 py-3 text-beige-100 placeholder-beige-500 focus:outline-none focus:border-gold-400"
                    aria-label="numéro de carte"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-beige-300 mb-2">Date d'expiration</label>
                    <input type="text" placeholder="MM/AA" className="w-full bg-noir-700 border border-beige-800/50 rounded-lg px-4 py-3 text-beige-100 placeholder-beige-500 focus:outline-none focus:border-gold-400" />
                  </div>
                  <div>
                    <label className="block text-beige-300 mb-2">CVV</label>
                    <input type="text" placeholder="123" className="w-full bg-noir-700 border border-beige-800/50 rounded-lg px-4 py-3 text-beige-100 placeholder-beige-500 focus:outline-none focus:border-gold-400" />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mb-8 p-4 bg-noir-700/20 rounded-lg">
            <div className="flex items-start space-x-3">
              <Lock className="w-5 h-5 text-gold-400 mt-0.5" />
              <div>
                <p className="text-sm text-beige-300">
                  Votre paiement est sécurisé et crypté. En payant l'acompte, vous acceptez les conditions générales de WIGVIVAL.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={handlePayment}
            disabled={processing || depositAmount <= 0}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${processing ? 'bg-beige-600 cursor-not-allowed' : 'bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700'}`}
          >
            {processing ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                <span>Traitement en cours...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <CheckCircle className="w-6 h-6" />
                <span>Payer {depositAmount.toFixed(2)} $CA</span>
              </div>
            )}
          </button>

          <button
            onClick={() => navigate('/dashboard')}
            className="w-full mt-4 text-center text-beige-400 hover:text-beige-300 transition-colors"
            type="button"
          >
            Retour au tableau de bord
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default PaymentPage;
