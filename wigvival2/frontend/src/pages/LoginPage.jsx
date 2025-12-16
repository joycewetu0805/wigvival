import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  LogIn,
  Mail,
  Lock,
  Eye,
  EyeOff,
  UserPlus
} from 'lucide-react';
import api from '../services/api';
import { toast } from 'react-toastify';

const LoginPage = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(formData.email)) {
      toast.error('Adresse e-mail invalide');
      return;
    }
    if (!formData.password || formData.password.length < 6) {
      toast.error('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setProcessing(true);
    try {
      if (isLogin) {
        // Login
        const res = await api.post('/auth/login', {
          email: formData.email,
          password: formData.password
        });
        const token = res?.data?.token;
        if (token) {
          localStorage.setItem('wigvival_token', token);
          // optional: store user info
          localStorage.setItem('wigvival_user', JSON.stringify(res.data.user || {}));
          toast.success('Connexion réussie');
          navigate('/dashboard');
        } else {
          throw new Error(res?.data?.message || 'Réponse invalide du serveur');
        }
      } else {
        // Register
        if (!formData.firstName || !formData.lastName || !formData.phone) {
          toast.error('Complétez tous les champs d\'inscription');
          setProcessing(false);
          return;
        }
        const res = await api.post('/auth/register', {
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          email: formData.email,
          password: formData.password
        });
        toast.success(res?.data?.message || 'Inscription réussie — vous êtes connecté(e)');
        // if API returns token on register, store and redirect
        if (res?.data?.token) {
          localStorage.setItem('wigvival_token', res.data.token);
          localStorage.setItem('wigvival_user', JSON.stringify(res.data.user || {}));
          navigate('/dashboard');
        } else {
          // otherwise go to login or verification flow if needed
          setIsLogin(true);
        }
      }
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || 'Erreur réseau';
      toast.error(msg);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-noir-900 to-noir-800 py-12 flex items-center justify-center">
      <div className="container mx-auto px-4 max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-noir-800 to-noir-900 rounded-2xl border border-beige-800/30 p-8"
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-gold-500 to-gold-600 rounded-2xl mb-4">
              <LogIn className="w-8 h-8 text-noir-900" />
            </div>
            <h1 className="text-3xl font-display font-bold text-gold-400">
              {isLogin ? 'Connexion' : 'Inscription'}
            </h1>
            <p className="text-beige-400 mt-2">
              {isLogin
                ? 'Connectez-vous à votre compte WIGVIVAL'
                : 'Créez votre compte pour réserver vos services'}
            </p>
          </div>

          <div className="flex mb-8">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 text-center rounded-l-xl border transition-all ${
                isLogin
                  ? 'bg-gold-400/20 border-gold-400/50 text-gold-400'
                  : 'border-beige-800/30 text-beige-400 hover:bg-beige-800/10'
              }`}
              type="button"
            >
              Connexion
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 text-center rounded-r-xl border transition-all ${
                !isLogin
                  ? 'bg-gold-400/20 border-gold-400/50 text-gold-400'
                  : 'border-beige-800/30 text-beige-400 hover:bg-beige-800/10'
              }`}
              type="button"
            >
              Inscription
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-beige-300 mb-2">Prénom</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full bg-noir-700 border border-beige-800/50 rounded-lg px-4 py-3 text-beige-100 focus:outline-none focus:border-gold-400"
                      required={!isLogin}
                    />
                  </div>
                  <div>
                    <label className="block text-beige-300 mb-2">Nom</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full bg-noir-700 border border-beige-800/50 rounded-lg px-4 py-3 text-beige-100 focus:outline-none focus:border-gold-400"
                      required={!isLogin}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-beige-300 mb-2">Téléphone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full bg-noir-700 border border-beige-800/50 rounded-lg px-4 py-3 text-beige-100 focus:outline-none focus:border-gold-400"
                    required={!isLogin}
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-beige-300 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-beige-500" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-noir-700 border border-beige-800/50 rounded-lg pl-12 pr-4 py-3 text-beige-100 focus:outline-none focus:border-gold-400"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-beige-300 mb-2">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-beige-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full bg-noir-700 border border-beige-800/50 rounded-lg pl-12 pr-12 py-3 text-beige-100 focus:outline-none focus:border-gold-400"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-beige-500 hover:text-beige-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {isLogin && (
                <div className="text-right mt-2">
                  <Link to="/forgot-password" className="text-sm text-gold-400 hover:text-gold-300">
                    Mot de passe oublié ?
                  </Link>
                </div>
              )}
            </div>

            {!isLogin && (
              <div className="p-4 bg-noir-700/30 rounded-xl">
                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    required
                    className="mt-1 w-4 h-4 text-gold-400 bg-noir-700 border-beige-800/50 rounded focus:ring-gold-400 focus:ring-2"
                  />
                  <span className="text-sm text-beige-300">
                    J'accepte les conditions générales et la politique de confidentialité de WIGVIVAL.
                  </span>
                </label>
              </div>
            )}

            <button
              type="submit"
              disabled={processing}
              className={`w-full inline-flex items-center justify-center px-6 py-4 ${processing ? 'opacity-80 cursor-not-allowed' : ''} bg-gradient-to-r from-gold-500 to-gold-600 text-noir-900 font-bold rounded-xl hover:from-gold-600 hover:to-gold-700 transition-all group`}
            >
              {processing ? (
                <span>Traitement…</span>
              ) : isLogin ? (
                <>
                  <span>Se connecter</span>
                  <LogIn className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              ) : (
                <>
                  <span>S'inscrire</span>
                  <UserPlus className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="text-center mt-8 pt-6 border-t border-beige-800/30">
            <p className="text-beige-400">
              {isLogin ? "Pas encore de compte ?" : "Déjà un compte ?"}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-gold-400 hover:text-gold-300 ml-2 font-medium"
                type="button"
              >
                {isLogin ? "S'inscrire" : "Se connecter"}
              </button>
            </p>
          </div>

          <div className="text-center mt-6">
            <Link to="/" className="text-beige-400 hover:text-beige-300 text-sm">
              ← Retour à l'accueil
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
