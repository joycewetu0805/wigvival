import React, { useEffect, useMemo, useState, useCallback, Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Scissors,
  BarChart3,
  Download
} from 'lucide-react';
import api from '../services/api'; // axios instance
import { toast } from 'react-toastify';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

// Lazy subcomponents
const StatusPill = ({ status }) => {
  if (status === 'confirmé') return (
    <span className="inline-flex items-center px-3 py-1 bg-green-500/20 text-green-400 text-sm rounded-full">
      <CheckCircle className="w-3 h-3 mr-1" /> Confirmé
    </span>
  );
  if (status === 'en attente') return (
    <span className="inline-flex items-center px-3 py-1 bg-yellow-500/20 text-yellow-400 text-sm rounded-full">
      <Clock className="w-3 h-3 mr-1" /> En attente
    </span>
  );
  return (
    <span className="inline-flex items-center px-3 py-1 bg-blue-500/20 text-blue-400 text-sm rounded-full">
      <XCircle className="w-3 h-3 mr-1" /> {status}
    </span>
  );
};

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([]);
  const [revenueSeries, setRevenueSeries] = useState([]);
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [popularService, setPopularService] = useState(null);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [sRes, rRes, aRes, pRes] = await Promise.all([
        api.get('/admin/stats'),        // { stats: [...] }
        api.get('/admin/revenue/series'), // [{ date, revenue }]
        api.get('/appointments?limit=10'), // recent appts
        api.get('/services/top')         // popular service
      ]);

      setStats(sRes.data?.stats ?? []);
      setRevenueSeries(rRes.data ?? []);
      setRecentAppointments(aRes.data ?? []);
      setPopularService(pRes.data ?? null);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Impossible de charger les données du tableau de bord');
      toast.error('Erreur chargement dashboard — voir console.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    // simple polling every 60s to keep admin view fresh (can be disabled if websockets used)
    const interval = setInterval(fetchData, 60_000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const exportCSV = (rows = []) => {
    if (!rows.length) return;
    const headers = Object.keys(rows[0]);
    const csv = [headers.join(',')]
      .concat(rows.map(r => headers.map(h => `"${String(r[h] ?? '')}"`).join(',')))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `appointments_export_${new Date().toISOString().slice(0,10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const filteredAppointments = useMemo(() => {
    if (filter === 'all') return recentAppointments;
    return recentAppointments.filter(a => a.status === filter);
  }, [recentAppointments, filter]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-noir-900 to-noir-800 py-8">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">

          {/* Header */}
          <header>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-gold-400">Tableau de bord Admin</h1>
            <p className="text-beige-300">Vue d'ensemble et actions rapides</p>
          </header>

          {/* Loading / Error */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-gold-400" />
            </div>
          ) : error ? (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-300">{error}</div>
          ) : null}

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(stats.length ? stats : [
              { title: "Rendez-vous Aujourd'hui", value: 0, icon: <Calendar className="w-6 h-6" />, change: '+0' }
            ]).map((stat, i) => (
              <article key={i} className="bg-noir-800/70 rounded-2xl border border-beige-800/30 p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="p-3 bg-gold-400/10 rounded-xl">{stat.icon}</div>
                  <div className={`text-sm font-medium ${String(stat.change).startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>{stat.change}</div>
                </div>
                <div className="text-2xl md:text-3xl font-bold text-beige-100 mb-1">{stat.value}</div>
                <div className="text-sm text-beige-400">{stat.title}</div>
              </article>
            ))}
          </div>

          {/* Charts + Popular */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <section className="lg:col-span-2 bg-noir-800/80 rounded-2xl border border-beige-800/30 p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-display font-bold text-beige-100">Revenue mensuel</h2>
                <div className="flex items-center space-x-3 text-sm text-beige-400">
                  <TrendingUp className="w-4 h-4" />
                  <span>{stats.find(s=>s.key==='monthly_growth')?.value ?? '+0%'} ce mois</span>
                </div>
              </div>

              <div className="h-64">
                {revenueSeries.length ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueSeries} margin={{ top: 10, right: 12, left: -12, bottom: 0 }}>
                      <defs>
                        <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f6c555" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#f6c555" stopOpacity={0.05}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.06} />
                      <XAxis dataKey="date" tick={{ fill: '#d4c9be' }} />
                      <YAxis tickFormatter={v => `$${v}`} tick={{ fill: '#d4c9be' }} />
                      <Tooltip formatter={(v) => [`$${v}`, 'Revenue']} />
                      <Area type="monotone" dataKey="revenue" stroke="#f6c555" fillOpacity={1} fill="url(#grad)" />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-beige-400">
                    <div className="text-center">
                      <BarChart3 className="w-12 h-12 mx-auto mb-3 text-beige-600" />
                      <div>Pas de données de revenue</div>
                    </div>
                  </div>
                )}
              </div>
            </section>

            <aside className="bg-noir-800/80 rounded-2xl border border-beige-800/30 p-5">
              <h3 className="text-lg font-display font-bold text-beige-100 mb-4">Service Populaire</h3>
              {popularService ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-gold-400/10 rounded-xl"><Scissors className="w-6 h-6 text-gold-400" /></div>
                    <div>
                      <div className="font-bold text-beige-100">{popularService.name}</div>
                      <div className="text-sm text-beige-400">{popularService.category}</div>
                    </div>
                  </div>
                  <div className="text-sm text-beige-400">
                    <div className="flex justify-between"><span>Prix</span><span className="text-gold-400 font-bold">${popularService.price}</span></div>
                    <div className="flex justify-between mt-1"><span>Durée</span><span className="text-beige-300">{popularService.duration} min</span></div>
                    <div className="flex justify-between mt-1"><span>Réservations</span><span className="text-beige-300">{popularService.bookings_count ?? 0} ce mois</span></div>
                  </div>
                </div>
              ) : (
                <div className="text-beige-400">Aucun service populaire détecté</div>
              )}
            </aside>
          </div>

          {/* Appointments table */}
          <div className="bg-noir-800/80 rounded-2xl border border-beige-800/30 p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-display font-bold text-beige-100">Rendez-vous Récents</h2>
              <div className="flex items-center space-x-3">
                <select value={filter} onChange={(e)=>setFilter(e.target.value)} className="bg-noir-800 border border-beige-800/20 rounded-md px-3 py-2 text-sm text-beige-300">
                  <option value="all">Tous</option>
                  <option value="confirmé">Confirmés</option>
                  <option value="en attente">En attente</option>
                  <option value="terminé">Terminés</option>
                </select>
                <button onClick={()=>exportCSV(filteredAppointments)} className="inline-flex items-center gap-2 px-3 py-2 bg-gold-400/10 border border-gold-400/30 text-gold-400 rounded-md text-sm">
                  <Download className="w-4 h-4" /> Export
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-beige-400 border-b border-beige-800/20">
                    <th className="py-3">Client</th>
                    <th className="py-3">Service</th>
                    <th className="py-3">Horaire</th>
                    <th className="py-3">Statut</th>
                    <th className="py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAppointments.map(appt => (
                    <tr key={appt.id} className="border-b border-beige-800/10 hover:bg-noir-900/30 transition-colors">
                      <td className="py-3"><div className="font-medium text-beige-100">{appt.client_name ?? appt.client}</div></td>
                      <td className="py-3 text-beige-300">{appt.service_name ?? appt.service}</td>
                      <td className="py-3 text-beige-300">{appt.time_display ?? appt.time}</td>
                      <td className="py-3"><StatusPill status={appt.status} /></td>
                      <td className="py-3">
                        <div className="flex gap-2">
                          <button onClick={()=>window.location.href=`/admin/appointments/${appt.id}`} className="px-3 py-1 rounded-md bg-gold-400/10 border border-gold-400/30 text-gold-400 text-sm">Gérer</button>
                          <button onClick={()=>window.location.href=`/admin/appointments/${appt.id}?details=1`} className="px-3 py-1 rounded-md bg-noir-700 border border-beige-800/20 text-beige-300 text-sm">Détails</button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filteredAppointments.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-beige-400">Aucun rendez-vous correspondant</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;