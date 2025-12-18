import React, { useEffect, useMemo, useState, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import {
  Award,
  Users,
  Sparkles,
  Heart,
  Target,
  Clock,
  Shield,
  Star,
  MapPin,
  Scissors
} from 'lucide-react';
import { ParallaxSection } from '../components/ui/ParallaxSection';
import api from '../services/api';
import { toast } from 'react-toastify';

const TestimonialSlider = lazy(() => import('../components/marketing/TestimonialSlider'));

const AboutPage = () => {
  const [values, setValues] = useState(null);
  const [milestones, setMilestones] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // fallback static content (keeps page functional if API fails)
  const defaultValues = [
    { icon: <Sparkles className="w-8 h-8" />, title: 'Excellence', description: 'Nous visons la perfection dans chaque détail.' },
    { icon: <Heart className="w-8 h-8" />, title: 'Passion', description: 'Notre amour pour l\'art capillaire se reflète dans chaque création.' },
    { icon: <Target className="w-8 h-8" />, title: 'Précision', description: 'Une approche méticuleuse pour des résultats impeccables.' },
    { icon: <Shield className="w-8 h-8" />, title: 'Confiance', description: 'Nous traitons chaque perruque avec le plus grand soin.' }
  ];
  const defaultMilestones = [
    { year: '2020', title: 'Fondation', description: 'Création de WIGVIVAL à Montréal' },
    { year: '2021', title: 'Expansion', description: 'Ouverture de notre salon premium' },
    { year: '2022', title: 'Reconnaissance', description: 'Certification excellence' },
    { year: '2023', title: 'Innovation', description: 'Techniques exclusives' },
    { year: '2024', title: 'Excellence', description: 'Référence dans le domaine' }
  ];
  const defaultStats = [
    { value: '500+', label: 'Clients Satisfaits', icon: <Users className="w-8 h-8" /> },
    { value: '4.9★', label: 'Note Moyenne', icon: <Star className="w-8 h-8" /> },
    { value: '98%', label: 'Taux de Retour', icon: <Heart className="w-8 h-8" /> },
    { value: '3', label: 'Experts Certifiés', icon: <Award className="w-8 h-8" /> }
  ];

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const [resAbout, resMilestones, resStats] = await Promise.allSettled([
          api.get('/about'), // expected { values: [], mission, vision }
          api.get('/about/milestones'),
          api.get('/about/stats')
        ]);
        if (!mounted) return;
        if (resAbout.status === 'fulfilled' && resAbout.value?.data?.values) setValues(resAbout.value.data.values);
        if (resMilestones.status === 'fulfilled' && Array.isArray(resMilestones.value?.data)) setMilestones(resMilestones.value.data);
        if (resStats.status === 'fulfilled' && Array.isArray(resStats.value?.data)) setStats(resStats.value.data);
      } catch (err) {
        console.error(err);
        toast.error('Impossible de charger les infos. Affichage local.');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  const valuesToRender = useMemo(() => values ?? defaultValues, [values]);
  const milestonesToRender = useMemo(() => milestones ?? defaultMilestones, [milestones]);
  const statsToRender = useMemo(() => stats ?? defaultStats, [stats]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-noir-900 to-noir-800" aria-labelledby="about-heading">
      <section aria-hidden="false" className="relative h-[80vh] overflow-hidden">
        <ParallaxSection speed={0.3}>
          <div className="absolute inset-0 bg-gradient-to-br from-gold-400/10 via-noir-900/80 to-noir-900" />
        </ParallaxSection>

        <div className="relative h-full flex items-center">
          <div className="container mx-auto px-4">
            <motion.header initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl">
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gold-400/10 border border-gold-400/30 rounded-full mb-6 backdrop-blur-sm">
                <Sparkles className="w-4 h-4 text-gold-400" />
                <span className="text-gold-400 text-sm font-medium">Notre Histoire</span>
              </div>

              <h1 id="about-heading" className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-gold-400 mb-6 leading-tight">
                L'Art de Sublimer <span className="block text-beige-100">Votre Beauté</span>
              </h1>

              <p className="text-xl text-beige-300 mb-8 max-w-3xl leading-relaxed">
                WIGVIVAL incarne l'excellence capillaire à Montréal — une fusion de technique, d'art et d'expérience client.
                {loading && <span className="ml-2 text-sm text-beige-400">Chargement des données...</span>}
              </p>
            </motion.header>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <article className="bg-noir-800/80 rounded-2xl border border-beige-800/30 p-8">
                <header className="inline-flex items-center justify-center w-16 h-16 bg-gold-400/10 rounded-2xl mb-6">
                  <Target className="w-8 h-8 text-gold-400" />
                </header>
                <h2 className="text-3xl font-display font-bold text-gold-400 mb-4">Notre Mission</h2>
                <p className="text-beige-300 leading-relaxed">Offrir une expérience capillaire exceptionnelle alliant technique, créativité et service personnalisé.</p>
              </article>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <article className="bg-noir-800/80 rounded-2xl border border-beige-800/30 p-8">
                <header className="inline-flex items-center justify-center w-16 h-16 bg-gold-400/10 rounded-2xl mb-6">
                  <Star className="w-8 h-8 text-gold-400" />
                </header>
                <h2 className="text-3xl font-display font-bold text-gold-400 mb-4">Notre Vision</h2>
                <p className="text-beige-300 leading-relaxed">Devenir la référence en customisation et restauration de perruques au Canada, en innovant sans cesse.</p>
              </article>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-noir-800/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h3 className="text-4xl font-display font-bold text-gold-400">Nos Valeurs</h3>
            <p className="text-beige-300 max-w-2xl mx-auto mt-3">Les principes qui guident chaque décision.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {valuesToRender.map((v, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-noir-800/60 rounded-2xl border border-beige-800/30 p-6">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-gold-400/10 rounded-2xl mb-4">{v.icon}</div>
                <h4 className="font-display font-bold text-gold-400 mb-2">{v.title}</h4>
                <p className="text-beige-300 text-sm">{v.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-display font-bold text-gold-400">Notre Parcours</h3>
            <p className="text-beige-300 max-w-2xl mx-auto mt-3">Étapes majeures vers l'excellence.</p>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-px bg-gradient-to-b from-transparent via-gold-400/50 to-transparent" />
            {milestonesToRender.map((m, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, x: idx % 2 === 0 ? -40 : 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className={`flex items-center mb-12 ${idx % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                <div className={`w-1/2 ${idx % 2 === 0 ? 'pr-12 text-right' : 'pl-12'}`}>
                  <div className="bg-noir-800/80 rounded-2xl border border-beige-800/30 p-6 max-w-md mx-auto">
                    <div className="text-gold-400 text-2xl font-display font-bold mb-2">{m.year}</div>
                    <h4 className="text-xl font-bold text-beige-100 mb-2">{m.title}</h4>
                    <p className="text-beige-300">{m.description}</p>
                  </div>
                </div>
                <div className="relative z-10">
                  <div className="w-6 h-6 bg-gold-400 rounded-full border-4 border-noir-900" />
                </div>
                <div className="w-1/2"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-gradient-to-br from-noir-900 via-noir-800 to-gold-900/20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {statsToRender.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gold-400/10 rounded-2xl mb-4 mx-auto">{s.icon}</div>
                <div className="text-3xl md:text-4xl font-display font-bold text-gold-400 mb-2">{s.value}</div>
                <div className="text-beige-300">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <Suspense fallback={<div className="text-center text-beige-400 py-12">Chargement des témoignages...</div>}>
            <TestimonialSlider />
          </Suspense>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-gold-500/10 via-gold-400/5 to-gold-500/10 border border-gold-400/20 rounded-2xl p-12 text-center">
            <h3 className="text-3xl font-display font-bold text-gold-400 mb-4">Prêt à Vivre l'Expérience WIGVIVAL ?</h3>
            <p className="text-beige-300 mb-6">Rejoins notre communauté et découvre l'excellence capillaire.</p>
            <div className="flex justify-center gap-4">
              <a href="/booking" className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-gold-500 to-gold-600 text-noir-900 font-bold rounded-xl">Réserver</a>
              <a href="/contact" className="inline-flex items-center px-6 py-3 border border-gold-400/30 text-gold-400 rounded-xl">Nous contacter</a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AboutPage;
