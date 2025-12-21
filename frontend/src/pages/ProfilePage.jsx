import { useEffect, useState } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';

const ProfilePage = () => {
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    preferences: '',
  });

  useEffect(() => {
    const loadMe = async () => {
      try {
        const res = await api.get('/me');
        setForm({
          first_name: res.data.first_name || '',
          last_name: res.data.last_name || '',
          phone: res.data.phone || '',
          preferences: res.data.preferences || '',
        });
      } catch {
        toast.error('Impossible de charger le profil');
      }
    };
    loadMe();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put('/users/me', form);
      toast.success('Profil mis à jour');
    } catch {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Mon profil</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="first_name"
          value={form.first_name}
          onChange={handleChange}
          placeholder="Prénom"
          className="w-full p-3 border rounded"
        />
        <input
          name="last_name"
          value={form.last_name}
          onChange={handleChange}
          placeholder="Nom"
          className="w-full p-3 border rounded"
        />
        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Téléphone"
          className="w-full p-3 border rounded"
        />
        <textarea
          name="preferences"
          value={form.preferences}
          onChange={handleChange}
          placeholder="Préférences (modèles préférés, styles…)"
          className="w-full p-3 border rounded"
        />

        <button
          type="submit"
          className="px-6 py-3 rounded bg-black text-white"
        >
          Enregistrer
        </button>
      </form>
    </div>
  );
};

export default ProfilePage;
