import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  Users,
  Plus,
  Trash2,
  X,
  Save,
  Edit
} from 'lucide-react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import api from '../../services/api';
import { toast } from 'react-toastify';

const emptyForm = {
  stylistId: '',
  serviceId: '',
  startDate: '',
  endDate: '',
  maxClients: 1,
  recurrenceRule: '',
  notes: ''
};

const AdminAvailability = () => {
  const [availabilities, setAvailabilities] = useState([]);
  const [stylists, setStylists] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [pollToggle, setPollToggle] = useState(0);
  const calendarRef = useRef(null);

  // fetch + polling
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [availRes, stylistsRes, servicesRes] = await Promise.all([
        api.get('/admin/availabilities'),
        api.get('/admin/stylists'),
        api.get('/services')
      ]);
      setAvailabilities(availRes.data || []);
      setStylists(stylistsRes.data || []);
      setServices(servicesRes.data || []);
    } catch (err) {
      console.error(err);
      toast.error('Erreur lors du chargement des disponibilités');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const id = setInterval(() => setPollToggle(t => t + 1), 60000); // refresh every 60s
    return () => clearInterval(id);
  }, [fetchData]);

  // refetch on poll toggle
  useEffect(() => {
    if (pollToggle > 0) fetchData();
  }, [pollToggle, fetchData]);

  // memoized calendar events
  const calendarEvents = useMemo(() => {
    return availabilities.map(avail => {
      const start = new Date(avail.startDate);
      const end = new Date(avail.endDate);
      return {
        id: String(avail.id),
        title: `${avail.stylist?.firstName || 'Coiffeuse'} — ${avail.service?.name || 'Tous services'}`,
        start: start.toISOString(),
        end: end.toISOString(),
        extendedProps: {
          stylist: avail.stylist,
          service: avail.service,
          maxClients: avail.maxClients,
          currentClients: avail.currentClients,
          notes: avail.notes
        },
        backgroundColor: (avail.currentClients >= avail.maxClients) ? '#ef4444' : '#10b981',
        borderColor: (avail.currentClients >= avail.maxClients) ? '#dc2626' : '#059669'
      };
    });
  }, [availabilities]);

  // select range in calendar
  const handleDateSelect = useCallback((selectInfo) => {
    setSelectedDate(selectInfo);
    // prefill ISO strings (local -> toISOString to keep server-side consistent)
    const startISO = new Date(selectInfo.start).toISOString().slice(0,16); // "YYYY-MM-DDTHH:mm"
    const endISO = new Date(selectInfo.end).toISOString().slice(0,16);
    setFormData(prev => ({ ...prev, startDate: startISO, endDate: endISO }));
    setShowForm(true);
  }, []);

  // simple client validation
  const validateForm = useCallback((data) => {
    if (!data.stylistId) return 'Sélectionnez une coiffeuse';
    if (!data.startDate || !data.endDate) return 'Choisissez date de début et de fin';
    if (new Date(data.endDate) <= new Date(data.startDate)) return 'La date de fin doit être après la date de début';
    if (data.maxClients < 1) return 'Nombre de clients invalide';
    return null;
  }, []);

  // optimistic create
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (submitting) return;
    const err = validateForm(formData);
    if (err) return toast.warn(err);

    setSubmitting(true);
    // prepare payload (server expects ISO strings)
    const payload = {
      ...formData,
      startDate: new Date(formData.startDate).toISOString(),
      endDate: new Date(formData.endDate).toISOString()
    };

    // optimistic UI
    const tempId = `temp-${Date.now()}`;
    const optimistic = {
      id: tempId,
      stylist: stylists.find(s => s.id === formData.stylistId) || null,
      service: services.find(s => s.id === formData.serviceId) || null,
      startDate: payload.startDate,
      endDate: payload.endDate,
      maxClients: payload.maxClients,
      currentClients: 0,
      notes: payload.notes
    };
    setAvailabilities(prev => [optimistic, ...prev]);
    setShowForm(false);

    try {
      const res = await api.post('/admin/availabilities', payload);
      // replace temp with real
      setAvailabilities(prev => prev.map(a => a.id === tempId ? res.data : a));
      toast.success('Disponibilité créée');
      // refresh calendar view
      if (calendarRef.current) calendarRef.current.getApi().refetchEvents();
    } catch (error) {
      console.error(error);
      // rollback optimistic
      setAvailabilities(prev => prev.filter(a => a.id !== tempId));
      toast.error('Erreur création disponibilité');
    } finally {
      setSubmitting(false);
      setFormData(emptyForm);
    }
  }, [formData, stylists, services, validateForm, submitting]);

  const deleteAvailability = useCallback(async (id) => {
    if (!window.confirm('Supprimer cette disponibilité ?')) return;
    try {
      // optimistic remove
      const previous = availabilities;
      setAvailabilities(prev => prev.filter(a => String(a.id) !== String(id)));
      await api.delete(`/admin/availabilities/${id}`);
      toast.success('Disponibilité supprimée');
    } catch (error) {
      console.error(error);
      toast.error('Erreur lors de la suppression');
      // refetch to restore state
      fetchData();
    }
  }, [availabilities, fetchData]);

  // helper for input change (keeps string / numbers)
  const updateField = useCallback((key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  }, []);

  // UI: loading / empty states
  if (loading) {
    return (
      <div className="py-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gold-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-bold text-gold-400">Gestion des Disponibilités</h1>
          <p className="text-beige-400 mt-2">Définissez les créneaux disponibles pour vos coiffeuses</p>
        </div>
        <button
          onClick={() => { setShowForm(s => !s); setFormData(emptyForm); }}
          className="px-6 py-3 bg-gradient-to-r from-gold-500 to-gold-600 text-noir-900 font-bold rounded-lg flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Ajouter une disponibilité</span>
        </button>
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-noir-800/50 backdrop-blur-sm rounded-2xl border border-beige-800/30 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-display font-bold text-beige-100">Nouvelle Disponibilité</h2>
            <button onClick={() => setShowForm(false)} className="p-2 hover:bg-beige-800/30 rounded-lg"><X className="w-5 h-5" /></button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-beige-300 mb-2">Coiffeuse</label>
                <select value={formData.stylistId} onChange={(e) => updateField('stylistId', e.target.value)} required className="w-full bg-noir-700 border border-beige-800/50 rounded-lg px-4 py-3">
                  <option value="">Sélectionner une coiffeuse</option>
                  {stylists.map(s => <option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-beige-300 mb-2">Service</label>
                <select value={formData.serviceId} onChange={(e) => updateField('serviceId', e.target.value)} className="w-full bg-noir-700 border border-beige-800/50 rounded-lg px-4 py-3">
                  <option value="">Tous les services</option>
                  {services.map(s => <option key={s.id} value={s.id}>{s.name} ({s.duration}min)</option>)}
                </select>
              </div>

              <div>
                <label className="block text-beige-300 mb-2">Début</label>
                <input type="datetime-local" value={formData.startDate} onChange={(e) => updateField('startDate', e.target.value)} required className="w-full bg-noir-700 border border-beige-800/50 rounded-lg px-4 py-3" />
              </div>

              <div>
                <label className="block text-beige-300 mb-2">Fin</label>
                <input type="datetime-local" value={formData.endDate} onChange={(e) => updateField('endDate', e.target.value)} required className="w-full bg-noir-700 border border-beige-800/50 rounded-lg px-4 py-3" />
              </div>

              <div>
                <label className="block text-beige-300 mb-2">Max clients</label>
                <input type="number" min={1} max={20} value={formData.maxClients} onChange={(e) => updateField('maxClients', Number(e.target.value) || 1)} className="w-full bg-noir-700 border border-beige-800/50 rounded-lg px-4 py-3" />
              </div>

              <div>
                <label className="block text-beige-300 mb-2">Récurrence</label>
                <select value={formData.recurrenceRule} onChange={(e) => updateField('recurrenceRule', e.target.value)} className="w-full bg-noir-700 border border-beige-800/50 rounded-lg px-4 py-3">
                  <option value="">Aucune</option>
                  <option value="daily">Quotidienne</option>
                  <option value="weekly">Hebdomadaire</option>
                  <option value="monthly">Mensuelle</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-beige-300 mb-2">Notes</label>
              <textarea value={formData.notes} onChange={(e) => updateField('notes', e.target.value)} rows={3} className="w-full bg-noir-700 border border-beige-800/50 rounded-lg px-4 py-3" />
            </div>

            <div className="flex justify-end space-x-3">
              <button type="button" onClick={() => setShowForm(false)} className="px-6 py-3 border rounded-lg">Annuler</button>
              <button type="submit" disabled={submitting} className={`px-6 py-3 rounded-lg font-bold ${submitting ? 'bg-beige-800/40' : 'bg-gold-400'}`}>
                {submitting ? 'Enregistrement...' : (<><Save className="w-4 h-4 inline-block mr-2" />Enregistrer</>)}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="bg-noir-800/50 rounded-2xl border border-beige-800/30 p-6">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          headerToolbar={{ left: 'prev,next today', center: 'title', right: 'dayGridMonth,timeGridWeek,timeGridDay' }}
          events={calendarEvents}
          selectable
          select={handleDateSelect}
          eventClick={(info) => {
            // open quick delete confirm
            const confirmDel = window.confirm('Supprimer cette disponibilité ?');
            if (confirmDel) deleteAvailability(info.event.id);
          }}
          eventContent={(arg) => (
            <div className="p-1">
              <div className="font-medium text-sm truncate">{arg.event.title}</div>
              <div className="flex items-center justify-between text-xs mt-1">
                <div className="flex items-center space-x-1"><Users className="w-3 h-3" /> <span>{arg.event.extendedProps.currentClients}/{arg.event.extendedProps.maxClients}</span></div>
                <div className="flex items-center space-x-1"><Clock className="w-3 h-3" /> <span>{new Date(arg.event.start).toLocaleTimeString('fr-CA',{hour:'2-digit',minute:'2-digit'})}</span></div>
              </div>
            </div>
          )}
          height="auto"
          slotMinTime="08:00:00"
          slotMaxTime="21:00:00"
          locale="fr"
        />
      </div>

      <div className="bg-noir-800/50 rounded-2xl border border-beige-800/30 p-6">
        <h2 className="text-xl font-display font-bold text-beige-100 mb-4">Liste des Disponibilités</h2>
        {availabilities.length === 0 ? (
          <div className="text-center text-beige-400 py-8">Aucune disponibilité trouvée.</div>
        ) : (
          <div className="space-y-4">
            {availabilities.map(avail => (
              <div key={avail.id} className="p-4 bg-noir-700/30 rounded-xl flex justify-between items-start">
                <div>
                  <div className="flex items-center space-x-4 mb-2">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gold-400" />
                      <span className="font-bold text-beige-100">{new Date(avail.startDate).toLocaleDateString('fr-CA',{weekday:'long',month:'long',day:'numeric'})}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gold-400" />
                      <span className="text-beige-300">{new Date(avail.startDate).toLocaleTimeString('fr-CA',{hour:'2-digit',minute:'2-digit'})} - {new Date(avail.endDate).toLocaleTimeString('fr-CA',{hour:'2-digit',minute:'2-digit'})}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6">
                    <div><span className="text-beige-400">Coiffeuse:</span> <span className="font-medium text-beige-200">{avail.stylist?.firstName} {avail.stylist?.lastName}</span></div>
                    <div><span className="text-beige-400">Service:</span> <span className="font-medium text-beige-200">{avail.service?.name || 'Tous services'}</span></div>
                    <div className="flex items-center"><Users className="w-4 h-4 text-beige-400" /><span className={`ml-1 ${avail.currentClients >= avail.maxClients ? 'text-red-400' : 'text-beige-200'}`}>{avail.currentClients}/{avail.maxClients}</span></div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button onClick={() => {
                    // quick edit: prefill form and open
                    setFormData({
                      stylistId: avail.stylist?.id || '',
                      serviceId: avail.service?.id || '',
                      startDate: new Date(avail.startDate).toISOString().slice(0,16),
                      endDate: new Date(avail.endDate).toISOString().slice(0,16),
                      maxClients: avail.maxClients || 1,
                      recurrenceRule: avail.recurrenceRule || '',
                      notes: avail.notes || ''
                    });
                    setShowForm(true);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }} className="p-2 hover:bg-beige-800/20 rounded-lg"><Edit className="w-4 h-4 text-beige-400" /></button>

                  <button onClick={() => deleteAvailability(avail.id)} className="p-2 hover:bg-red-500/10 rounded-lg"><Trash2 className="w-4 h-4 text-red-400" /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAvailability;
