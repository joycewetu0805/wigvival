import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Image, 
  Filter, 
  Star, 
  Heart, 
  ZoomIn,
  ChevronRight,
  X,
  Grid,
  List,
  Camera
} from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';

const GalleryPage = () => {
  const [filter, setFilter] = useState('all');
  const [selectedImage, setSelectedImage] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [likedImages, setLikedImages] = useState({});
  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      setLoading(true);
      try {
        // try common endpoints; adjust if your API uses a different route
        const [imgsRes, catsRes] = await Promise.allSettled([
          api.get('/gallery'),         // expects array of images
          api.get('/gallery/categories') // expects array of categories {id,name,count}
        ]);
        if (imgsRes.status === 'fulfilled' && Array.isArray(imgsRes.value.data)) {
          setImages(imgsRes.value.data);
        } else {
          // fallback endpoint name
          const other = await api.get('/images').catch(()=>({data:[]}));
          setImages(Array.isArray(other.data) ? other.data : []);
        }
        if (catsRes.status === 'fulfilled' && Array.isArray(catsRes.value.data)) {
          setCategories(catsRes.value.data);
        } else {
          // derive categories client-side
          const derived = [...new Set(images.map(i => i.category || 'other'))].map(id => ({ id, name: id, count: images.filter(i => (i.category||'other')===id).length }));
          setCategories(derived);
        }
      } catch (err) {
        console.error(err);
        toast.error('Impossible de charger la galerie');
        setImages([]);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredImages = images.filter(image => {
    if (filter === 'all') return true;
    if (filter === 'featured') return image.is_featured;
    if (filter === 'before_after') return image.before_after;
    return image.category === filter;
  });

  const toggleLike = async (imageId) => {
    // optimistic update
    setLikedImages(prev => ({ ...prev, [imageId]: !prev[imageId] }));
    try {
      await api.post(`/gallery/${imageId}/like`);
    } catch (err) {
      // rollback on error
      setLikedImages(prev => ({ ...prev, [imageId]: !prev[imageId] }));
      toast.error('Impossible d\'enregistrer votre like');
    }
  };

  const LightboxModal = ({ image, onClose }) => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="relative max-w-6xl w-full max-h-[90vh]" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute -top-12 right-0 p-2 text-white hover:text-gold-400 z-10"><X className="w-6 h-6" /></button>
        <div className="bg-noir-900 rounded-2xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="relative h-[60vh] lg:h-[70vh] bg-noir-800">
              {/* replace with real image when available */}
              <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${image.url || image.src || ''})` }} />
              <div className="absolute top-4 left-4 flex space-x-2">
                {image.is_featured && (<span className="px-3 py-1 bg-gradient-to-r from-gold-500 to-gold-600 text-noir-900 text-xs font-bold rounded-full flex items-center space-x-1"><Star className="w-3 h-3" /><span>VEDETTE</span></span>)}
                {image.before_after && (<span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-xs font-medium rounded-full">Avant/Après</span>)}
              </div>
              <div className="absolute bottom-4 right-4 flex space-x-2">
                <button onClick={() => toggleLike(image.id)} className={`p-2 rounded-lg backdrop-blur-sm ${likedImages[image.id] ? 'bg-red-500/20 text-red-400' : 'bg-black/30 text-white hover:bg-red-500/20 hover:text-red-400'}`}>
                  <Heart className={`w-5 h-5 ${likedImages[image.id] ? 'fill-current' : ''}`} />
                </button>
                <button className="p-2 bg-black/30 text-white rounded-lg backdrop-blur-sm hover:bg-gold-400/20 hover:text-gold-400"><ZoomIn className="w-5 h-5" /></button>
              </div>
            </div>

            <div className="p-8">
              <div className="mb-6">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${image.category==='customisation'?'bg-purple-500/20 text-purple-400': image.category==='restauration'?'bg-blue-500/20 text-blue-400':'bg-green-500/20 text-green-400'}`}>
                  {image.category ? image.category.charAt(0).toUpperCase() + image.category.slice(1) : 'Autre'}
                </span>
              </div>

              <h2 className="text-3xl font-display font-bold text-gold-400 mb-4">{image.title}</h2>
              <p className="text-beige-300 mb-6 leading-relaxed">{image.description}</p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center">
                    <span className="text-noir-900 font-bold">
                      {(image.stylist || '—').split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <div className="text-sm text-beige-400">Réalisé par</div>
                    <div className="font-bold text-beige-100">{image.stylist || '—'}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-beige-400">{image.date || '—'}</div>
                  <div className="flex items-center space-x-1">
                    <Heart className="w-4 h-4 text-red-400" />
                    <span className="text-beige-300">{(image.likes || 0) + (likedImages[image.id] ? 1 : 0)}</span>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h4 className="text-sm font-bold text-beige-200 mb-3">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {(image.tags || []).map((tag, idx) => (<span key={idx} className="px-3 py-1 bg-beige-800/30 text-beige-400 text-xs rounded-full">#{tag}</span>))}
                </div>
              </div>

              <div className="pt-6 border-t border-beige-800/30">
                <p className="text-beige-400 text-sm mb-4">Ce service vous intéresse ?</p>
                <Link to={`/booking?service=${image.serviceId || ''}`} className="w-full block text-center py-3 bg-gradient-to-r from-gold-500/10 to-gold-400/5 border border-gold-400/30 text-gold-400 font-medium rounded-xl hover:from-gold-400/20 hover:to-gold-400/10 hover:border-gold-400/50 transition-all duration-300">
                  Réserver une consultation
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-noir-900 to-noir-800">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="container mx-auto px-4 relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gold-400/10 border border-gold-400/30 rounded-full mb-6">
              <Image className="w-4 h-4 text-gold-400" />
              <span className="text-gold-400 text-sm font-medium">Notre Galerie</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-display font-bold text-gold-400 mb-6">Nos Réalisations</h1>
            <p className="text-xl text-beige-300 mb-10">Découvrez l'excellence de notre travail à travers nos transformations les plus remarquables.</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto mb-12">
              {loading ? Array.from({length:4}).map((_,i)=>(<div key={i} className="text-center p-4 bg-noir-800/30 rounded-xl border border-beige-800/20 animate-pulse" />)) : [
                { value: images.length, label: 'Réalisations', icon: <Image className="w-6 h-6" /> },
                { value: images.filter(img=>img.before_after).length, label: 'Transformations', icon: <Filter className="w-6 h-6" /> },
                { value: images.filter(img=>img.is_featured).length, label: 'Vedettes', icon: <Star className="w-6 h-6" /> },
                { value: Math.floor((images.reduce((s,i)=>s + (i.likes||0),0))/100)*100, label: 'Appréciations', icon: <Heart className="w-6 h-6" /> }
              ].map((stat, idx) => (
                <div key={idx} className="text-center p-4 bg-noir-800/30 rounded-xl border border-beige-800/20">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gold-400/10 rounded-full mb-3 mx-auto">{stat.icon}</div>
                  <div className="text-2xl font-bold text-gold-400 mb-1">{stat.value}</div>
                  <div className="text-sm text-beige-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Controls */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
            <div className="flex items-center space-x-2">
              <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg ${viewMode==='grid'?'bg-gold-400/20 text-gold-400':'text-beige-400'}`}><Grid className="w-5 h-5" /></button>
              <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg ${viewMode==='list'?'bg-gold-400/20 text-gold-400':'text-beige-400'}`}><List className="w-5 h-5" /></button>
            </div>

            <div className="flex flex-wrap gap-2 justify-center">
              <button key="all" onClick={()=>setFilter('all')} className={`inline-flex items-center space-x-2 px-4 py-2 rounded-xl border ${filter==='all'?'bg-gold-400/20 border-gold-400/50 text-gold-400':'border-beige-800/30 text-beige-400'}`}><span>Tous</span></button>
              <button key="featured" onClick={()=>setFilter('featured')} className={`inline-flex items-center px-4 py-2 rounded-xl border ${filter==='featured'?'bg-gold-400/20 text-gold-400':'border-beige-800/30 text-beige-400'}`}><span>Vedettes</span></button>
              <button key="before_after" onClick={()=>setFilter('before_after')} className={`inline-flex items-center px-4 py-2 rounded-xl border ${filter==='before_after'?'bg-gold-400/20 text-gold-400':'border-beige-800/30 text-beige-400'}`}><span>Avant/Après</span></button>
              {(categories || []).map(cat => (
                <button key={cat.id} onClick={()=>setFilter(cat.id)} className={`inline-flex items-center space-x-2 px-4 py-2 rounded-xl border ${filter===cat.id?'bg-gold-400/20 text-gold-400':'border-beige-800/30 text-beige-400'}`}>
                  <span>{cat.name}</span><span className="text-xs bg-beige-800/50 px-2 py-0.5 rounded-full">{cat.count ?? images.filter(i=>i.category===cat.id).length}</span>
                </button>
              ))}
            </div>

            <div className="text-beige-400 text-sm">{filteredImages.length} réalisation{filteredImages.length !== 1 ? 's' : ''}</div>
          </div>
        </div>
      </section>

      {/* Gallery Grid/List */}
      <section className="py-12 pb-20">
        <div className="container mx-auto px-4">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredImages.map((image, index) => (
                <motion.div key={image.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index*0.03 }} className="group relative cursor-pointer" onClick={()=>setSelectedImage(image)}>
                  <div className="relative h-64 rounded-2xl overflow-hidden">
                    <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${image.url || image.src || ''})` }} />
                    <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                      <h3 className="font-bold text-beige-100 text-lg mb-1 group-hover:text-gold-400 transition-colors">{image.title}</h3>
                      <p className="text-beige-400 text-sm line-clamp-2">{image.description}</p>
                    </div>
                    <div className="absolute top-4 left-4 z-20 flex space-x-2">
                      {image.is_featured && (<div className="px-2 py-1 bg-gradient-to-r from-gold-500 to-gold-600 text-noir-900 text-xs font-bold rounded-full">★</div>)}
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${image.category==='customisation'?'bg-purple-500/20 text-purple-400': image.category==='restauration'?'bg-blue-500/20 text-blue-400':'bg-green-500/20 text-green-400'}`}>{(image.category||'').charAt(0).toUpperCase()}</div>
                    </div>
                    <button onClick={(e)=>{ e.stopPropagation(); toggleLike(image.id); }} className="absolute top-4 right-4 z-20 p-2 bg-black/30 backdrop-blur-sm rounded-full text-white hover:text-red-400 transition-colors">
                      <Heart className={`w-4 h-4 ${likedImages[image.id] ? 'fill-current text-red-400' : ''}`} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredImages.map((image, index) => (
                <motion.div key={image.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index*0.03 }} className="group bg-noir-800/30 rounded-2xl border border-beige-800/30 overflow-hidden hover:border-gold-400/30 transition-all cursor-pointer" onClick={()=>setSelectedImage(image)}>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
                    <div className="relative h-48 rounded-xl overflow-hidden">
                      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${image.url || image.src || ''})` }} />
                      {image.is_featured && (<div className="absolute top-2 right-2 px-2 py-1 bg-gradient-to-r from-gold-500 to-gold-600 text-noir-900 text-xs font-bold rounded-full">VEDETTE</div>)}
                    </div>
                    <div className="md:col-span-2">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-xl font-display font-bold text-gold-400 mb-1">{image.title}</h3>
                          <div className="flex items-center space-x-3 text-sm text-beige-400">
                            <span>{image.date}</span><span>•</span><span>Par {image.stylist}</span><span>•</span>
                            <div className="flex items-center space-x-1"><Heart className="w-3 h-3"/><span>{(image.likes||0) + (likedImages[image.id]?1:0)}</span></div>
                          </div>
                        </div>
                        <button onClick={(e)=>{ e.stopPropagation(); toggleLike(image.id); }} className={`p-2 rounded-lg ${likedImages[image.id] ? 'bg-red-500/20 text-red-400' : 'text-beige-400 hover:text-red-400'}`}><Heart className={`w-5 h-5 ${likedImages[image.id] ? 'fill-current' : ''}`} /></button>
                      </div>
                      <p className="text-beige-300 mb-4 line-clamp-2">{image.description}</p>
                      <div className="flex flex-wrap gap-2">{(image.tags||[]).slice(0,3).map((t,i)=>(<span key={i} className="px-3 py-1 bg-beige-800/30 text-beige-400 text-xs rounded-full">#{t}</span>))}{(image.tags||[]).length>3 && <span className="px-3 py-1 bg-beige-800/30 text-beige-400 text-xs rounded-full">+{image.tags.length-3}</span>}</div>
                    </div>
                  </div>
                  <div className="px-6 py-3 bg-noir-800/50 border-t border-beige-800/30 flex justify-between items-center">
                    <span className="text-sm text-beige-400 flex items-center">Cliquez pour voir les détails <ChevronRight className="w-4 h-4 ml-1" /></span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${image.category==='customisation'?'bg-purple-500/20 text-purple-400': image.category==='restauration'?'bg-blue-500/20 text-blue-400':'bg-green-500/20 text-green-400'}`}>{image.category ? (image.category==='customisation'?'Customisation': image.category==='restauration'?'Restauration':'Styling') : 'Autre'}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {filteredImages.length === 0 && (!loading) && (
            <div className="text-center py-20">
              <Image className="w-16 h-16 text-beige-600 mx-auto mb-6" />
              <h3 className="text-2xl font-display font-bold text-beige-300 mb-3">Aucune réalisation trouvée</h3>
              <p className="text-beige-400">Aucune image ne correspond à vos critères. Essayez une autre catégorie.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-noir-800/30">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto text-center">
            <div className="bg-gradient-to-r from-gold-500/10 via-gold-400/5 to-gold-500/10 border border-gold-400/20 rounded-2xl p-12">
              <h2 className="text-4xl font-display font-bold text-gold-400 mb-6">Inspiré par nos réalisations ?</h2>
              <p className="text-xl text-beige-300 mb-8 max-w-2xl mx-auto">Chaque transformation commence par une consultation. Réservez la vôtre dès aujourd'hui.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/booking" className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-gold-500 to-gold-600 text-noir-900 font-bold rounded-xl hover:from-gold-600 hover:to-gold-700 transition-all duration-300 group">
                  <span>Réserver une consultation</span><ChevronRight className="w-5 h-5 ml-2" />
                </Link>
                <Link to="/contact" className="inline-flex items-center justify-center px-8 py-4 border border-beige-800 text-beige-300 rounded-xl hover:bg-beige-800/30 transition-colors">
                  <span>Nous contacter</span>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {selectedImage && <LightboxModal image={selectedImage} onClose={() => setSelectedImage(null)} />}
    </div>
  );
};

export default GalleryPage;
