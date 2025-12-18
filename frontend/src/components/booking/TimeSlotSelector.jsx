// Modifier pour utiliser le système de disponibilités
const TimeSlotSelector = ({
  selectedDate,
  selectedTime,
  availableSlots,
  loading,
  onDateSelect,
  onTimeSelect,
  onBack
}) => {
  const [date, setDate] = useState(selectedDate || new Date());
  const [slots, setSlots] = useState([]);
  const [filteredSlots, setFilteredSlots] = useState([]);
  const [selectedStylist, setSelectedStylist] = useState('all');

  // Récupérer les créneaux disponibles pour la date sélectionnée
  useEffect(() => {
    if (selectedService) {
      fetchAvailableSlots();
    }
  }, [date, selectedService, selectedStylist]);

  const fetchAvailableSlots = async () => {
    try {
      const response = await api.get('/availability/available-slots', {
        params: {
          serviceId: selectedService.id,
          date: date.toISOString().split('T')[0],
          stylistId: selectedStylist !== 'all' ? selectedStylist : undefined
        }
      });
      
      setSlots(response.data.slots);
      setFilteredSlots(response.data.slots);
    } catch (error) {
      toast.error('Erreur lors du chargement des créneaux');
    }
  };

  // Grouper les créneaux par heure
  const groupedSlots = filteredSlots.reduce((groups, slot) => {
    const hour = moment(slot.start).format('HH:00');
    if (!groups[hour]) {
      groups[hour] = [];
    }
    groups[hour].push(slot);
    return groups;
  }, {});

  return (
    <div>
      <h3 className="text-2xl font-display font-bold text-gold-400 mb-6">
        Sélectionnez un créneau
      </h3>

      {/* Sélecteur de date */}
      <div className="mb-8">
        <label className="block text-beige-300 mb-3">Date souhaitée</label>
        <input
          type="date"
          value={date.toISOString().split('T')[0]}
          onChange={(e) => setDate(new Date(e.target.value))}
          min={new Date().toISOString().split('T')[0]}
          className="w-full bg-noir-700 border border-beige-800/50 rounded-lg px-4 py-3 text-beige-100 focus:outline-none focus:border-gold-400"
        />
      </div>

      {/* Filtre par coiffeuse */}
      <div className="mb-8">
        <label className="block text-beige-300 mb-3">Coiffeuse</label>
        <select
          value={selectedStylist}
          onChange={(e) => setSelectedStylist(e.target.value)}
          className="w-full bg-noir-700 border border-beige-800/50 rounded-lg px-4 py-3 text-beige-100 focus:outline-none focus:border-gold-400"
        >
          <option value="all">Toutes les coiffeuses</option>
          <option value="stylist-1">Marie Dubois</option>
          <option value="stylist-2">Sophie Tremblay</option>
          <option value="stylist-3">Julie Martin</option>
        </select>
      </div>

      {/* Créneaux disponibles */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-bold text-beige-200">
            Créneaux disponibles
          </h4>
          <span className="text-sm text-beige-400">
            {filteredSlots.length} créneau{filteredSlots.length !== 1 ? 'x' : ''} disponible{filteredSlots.length !== 1 ? 's' : ''}
          </span>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold-400"></div>
          </div>
        ) : filteredSlots.length === 0 ? (
          <div className="text-center py-12 bg-noir-700/30 rounded-xl">
            <Clock className="w-12 h-12 text-beige-600 mx-auto mb-4" />
            <p className="text-beige-400">
              Aucun créneau disponible pour cette date.
            </p>
            <p className="text-sm text-beige-500 mt-2">
              Essayez une autre date ou contactez-nous pour plus d'options.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedSlots).map(([hour, hourSlots]) => (
              <div key={hour} className="space-y-3">
                <h5 className="text-beige-400 font-medium">{hour}</h5>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {hourSlots.map((slot, index) => (
                    <button
                      key={index}
                      onClick={() => onTimeSelect(slot)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        selectedTime?.start === slot.start
                          ? 'border-gold-400 bg-gold-400/10'
                          : 'border-beige-800/50 hover:border-beige-700 hover:bg-beige-800/10'
                      }`}
                    >
                      <div className="text-center">
                        <div className="font-bold text-beige-100">
                          {moment(slot.start).format('HH:mm')}
                        </div>
                        <div className="text-xs text-beige-400 mt-1">
                          {moment(slot.end).format('HH:mm')}
                        </div>
                        {slot.stylist && (
                          <div className="text-xs text-gold-400 mt-2">
                            {slot.stylist.firstName}
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-6 border-t border-beige-800/50">
        <button
          onClick={onBack}
          className="px-6 py-3 border border-beige-800 text-beige-300 rounded-lg hover:bg-beige-800/30 transition-colors"
        >
          Retour
        </button>
        
        {selectedTime && (
          <button
            onClick={() => onTimeSelect(selectedTime)}
            className="px-6 py-3 bg-gradient-to-r from-gold-500 to-gold-600 text-noir-900 font-bold rounded-lg hover:from-gold-600 hover:to-gold-700 transition-all"
          >
            Continuer vers le paiement
          </button>
        )}
      </div>
    </div>
  );
};