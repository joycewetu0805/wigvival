import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  User,
  Settings,
  LogOut,
  Scissors,
  DollarSign
} from 'lucide-react';
import api from '../services/api';
import { toast } from 'react-toastify';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingCancel, setProcessingCancel] = useState({}); // { [id]: true }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [meRes, apptsRes] = await Promise.allSettled([
          api.get('/me'),
          api.get('/appointments') // backend should return appointments for current user
        ]);
        if (meRes.status === 'fulfilled' && meRes.value.data) setUser(meRes.value.data);
        if (apptsRes.status === 'fulfilled' && Array.isArray(apptsRes.value.data)) {
          setAppointments(apptsRes.value.data);
        } else {
          setAppointments([]);
        }
      } catch (err) {
        console.error(err);
        toast.error('Erreur lors du chargement du tableau de bord');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const cancelAppointment = async (id) => {
    if (!confirm('Confirmer l\'annulation de ce rendez-vous ?')) return;
    setProcessingCancel(prev => ({ ...prev, [id]: true }));
    // optimistic update
    const prev = appointments;
    setAppointments(prev.map(a => a.id === id ? { ...a, status: 'annulé' } : a));
    try {
      await api.post(`/appointments/${id}/cancel`);
      toast.success('Rendez-vous annulé');
    } catch (err) {
      // rollback
      setAppointments(prev);
      const msg = err?.response?.data?.message || 'Impossible d\'annuler';
      toast.error(msg);
    } finally {
      setProcessingCancel(prev => ({ ...prev, [id]: false }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-noir-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold-400"></div>
      </div>
    );
  }

  const upcomingCount = appointments.filter(a => a.status === 'confirmé').length;
  const doneCount = appointments.filter(a => a.status === 'terminé').length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-noir-900 to-noir-800 py-12">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-4xl font-display font-bold text-gold-400 mb-2">Tableau de bord</h1>
              <p className="text-beige-300">Bienvenue, {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : '—'}</p>
            </div>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <Link to="/booking" className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-gold-500 to-gold-600 text-noir-900 font-bold rounded-xl hover:from-gold-600 hover:to-gold-700 transition-all">
                <Calendar className="w-5 h-5 mr-2" /> Nouvelle réservation
              </Link>
              <button className="p-3 bg-noir-800/50 rounded-xl border border-beige-800/30 hover:bg-beige-800/30 transition-colors">
                <Settings className="w-5 h-5 text-beige-400" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-gradient-to-br from-noir-800 to-noir-900 rounded-2xl border border-beige-800/30 p-6">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-gold-500 to-gold-600 rounded-xl flex items-center justify-center">
                    <User className="w-8 h-8 text-noir-900" />
                  </div>
                  <div>
                    <h3 className="text-xl font-display font-bold text-beige-100">{user?.firstName ? `${user.firstName} ${user.lastName || ''}` : 'Utilisateur'}</h3>
                    <p className="text-beige-400">Client depuis {user?.createdAt ? new Date(user.createdAt).getFullYear() : '—'}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between"><span className="text-beige-400">Email</span><span className="text-beige-100">{user?.email || '—'}</span></div>
                  <div className="flex justify-between"><span className="text-beige-400">Téléphone</span><span className="text-beige-100">{user?.phone || '—'}</span></div>
                  <div className="flex justify-between"><span className="text-beige-400">Préférences</span><span className="text-beige-100">{user?.preferences || '—'}</span></div>
                </div>

                <button onClick={() => { localStorage.removeItem('wigvival_token'); navigate('/'); }} className="w-full mt-6 py-3 border border-beige-800/50 text-beige-300 rounded-xl hover:bg-beige-800/30 transition-colors flex items-center justify-center">
                  <LogOut className="w-5 h-5 mr-2" /> Déconnexion
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-noir-800/50 rounded-xl border border-beige-800/30 p-4 text-center">
                  <div className="text-2xl font-bold text-gold-400">{appointments.length}</div>
                  <div className="text-sm text-beige-400">Rendez-vous</div>
                </div>
                <div className="bg-noir-800/50 rounded-xl border border-beige-800/30 p-4 text-center">
                  <div className="text-2xl font-bold text-gold-400">{doneCount}</div>
                  <div className="text-sm text-beige-400">Terminés</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-gradient-to-br from-noir-800 to-noir-900 rounded-2xl border border-beige-800/30 p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-display font-bold text-gold-400">Mes Rendez-vous</h2>
                  <span className="text-beige-400">{appointments.length} rendez-vous</span>
                </div>

                <div className="space-y-4">
                  {appointments.length === 0 ? (
                    <div className="text-center py-12">
                      <Calendar className="w-16 h-16 text-beige-600 mx-auto mb-6" />
                      <h3 className="text-2xl font-display font-bold text-beige-300 mb-3">Aucun rendez-vous</h3>
                      <p className="text-beige-400 mb-6">Vous n'avez pas encore pris de rendez-vous.</p>
                      <Link to="/booking" className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-gold-500 to-gold-600 text-noir-900 font-bold rounded-xl hover:from-gold-600 hover:to-gold-700 transition-all">Prendre un rendez-vous</Link>
                    </div>
                  ) : (
                    appointments.map((a) => (
                      <div key={a.id} className="p-4 bg-noir-700/30 rounded-xl border border-beige-800/20 hover:border-beige-700/50 transition-colors">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center space-x-3 mb-2">
                              <Scissors className="w-5 h-5 text-gold-400" />
                              <h3 className="font-bold text-beige-100">{a.service?.name || a.service || '—'}</h3>
                            </div>
                            <div className="flex items-center space-x-6 text-sm">
                              <div className="flex items-center space-x-2 text-beige-400"><Calendar className="w-4 h-4" /><span>{new Date(a.date).toLocaleDateString()}</span></div>
                              <div className="flex items-center space-x-2 text-beige-400"><Clock className="w-4 h-4" /><span>{a.time || (new Date(a.date).toLocaleTimeString())}</span></div>
                              <div className="flex items-center space-x-2 text-beige-400"><DollarSign className="w-4 h-4" /><span>{(a.price || 0)}$</span></div>
                            </div>
                          </div>

                          <div>
                            {a.status === 'confirmé' && <span className="inline-flex items-center px-3 py-1 bg-green-500/20 text-green-400 text-sm rounded-full"><CheckCircle className="w-3 h-3 mr-1" />Confirmé</span>}
                            {a.status === 'terminé' && <span className="inline-flex items-center px-3 py-1 bg-blue-500/20 text-blue-400 text-sm rounded-full">Terminé</span>}
                            {a.status === 'annulé' && <span className="inline-flex items-center px-3 py-1 bg-red-500/20 text-red-400 text-sm rounded-full"><XCircle className="w-3 h-3 mr-1" />Annulé</span>}
                          </div>
                        </div>

                        <div className="flex justify-end space-x-3 mt-4">
                          <button onClick={() => navigate(`/appointments/${a.id}`)} className="px-4 py-2 text-sm bg-gold-400/10 text-gold-400 border border-gold-400/30 rounded-lg hover:bg-gold-400/20 transition-colors">Détails</button>
                          {a.status === 'confirmé' && (
                            <button onClick={() => cancelAppointment(a.id)} disabled={processingCancel[a.id]} className={`px-4 py-2 text-sm ${processingCancel[a.id] ? 'bg-beige-600 cursor-not-allowed' : 'bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20'} rounded-lg transition-colors`}>
                              Annuler
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardPage;
