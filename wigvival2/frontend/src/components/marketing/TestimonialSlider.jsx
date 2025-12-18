import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Sophie Martin',
    role: 'Client VIP',
    content: "WIGVIVAL a transformé ma perruque de manière incroyable. Le service Plucking est d'une précision chirurgicale. Je recommande à 100% !",
    rating: 5,
    image: '/images/testimonials/sophie.jpg',
    service: 'PLUCKING'
  },
  {
    id: 2,
    name: 'Marie Dubois',
    role: 'Influenceuse Beauté',
    content: "La Luxury Restauration a redonné vie à ma perruque préférée. Le résultat est encore mieux que neuf. Un service vraiment premium.",
    rating: 5,
    image: '/images/testimonials/marie.jpg',
    service: 'LUXURY RESTAURATION'
  },
  {
    id: 3,
    name: 'Julie Tremblay',
    role: 'Artiste',
    content: "La teinture fantasy réalisée par Julie est une œuvre d'art. Les couleurs sont éclatantes et le travail est impeccable. Merci !",
    rating: 5,
    image: '/images/testimonials/julie.jpg',
    service: 'TEINTURE'
  },
  {
    id: 4,
    name: 'Isabelle Chen',
    role: 'Professionnelle',
    content: "Le Silkpress est parfaitement réalisé. Mes cheveux sont lisses, brillants et sans frisottis. Je reviendrai régulièrement.",
    rating: 5,
    image: '/images/testimonials/isabelle.jpg',
    service: 'SILKPRESS'
  }
];

const TestimonialSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => {
    setCurrentIndex((prev) => 
      prev === testimonials.length - 1 ? 0 : prev + 1
    );
  };

  const prev = () => {
    setCurrentIndex((prev) => 
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  return (
    <div className="relative py-20">
      <div className="absolute inset-0 bg-gradient-to-b from-noir-900/30 via-transparent to-noir-900/30" />
      
      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-display font-bold text-gold-400 mb-6">
            Témoignages Éloquents
          </h2>
          <p className="text-xl text-beige-300 max-w-2xl mx-auto">
            Découvrez ce que nos clients disent de leur expérience WIGVIVAL
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Testimonial Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {testimonials.slice(currentIndex, currentIndex + 2).map((testimonial, index) => (
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.2 }}
                  className="relative group"
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-gold-500/20 to-transparent rounded-3xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative bg-gradient-to-br from-noir-800/80 to-noir-900/90 backdrop-blur-sm rounded-2xl border border-beige-800/30 p-8 h-full">
                    {/* Quote Icon */}
                    <div className="absolute top-6 right-6">
                      <Quote className="w-8 h-8 text-gold-400/20" />
                    </div>

                    {/* Rating */}
                    <div className="flex mb-6">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < testimonial.rating
                              ? 'text-gold-400 fill-current'
                              : 'text-beige-600'
                          }`}
                        />
                      ))}
                    </div>

                    {/* Content */}
                    <p className="text-beige-300 text-lg italic mb-8 leading-relaxed">
                      "{testimonial.content}"
                    </p>

                    {/* Author */}
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center">
                        <span className="text-noir-900 font-bold text-xl">
                          {testimonial.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-bold text-beige-100">{testimonial.name}</h4>
                        <p className="text-beige-400 text-sm">{testimonial.role}</p>
                        <div className="mt-2">
                          <span className="px-3 py-1 bg-gold-400/10 text-gold-400 text-xs rounded-full">
                            {testimonial.service}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex justify-center items-center mt-12 space-x-6">
              <button
                onClick={prev}
                className="p-3 bg-gradient-to-r from-noir-800 to-noir-900 border border-beige-800/30 rounded-full text-gold-400 hover:bg-gold-400/10 hover:border-gold-400/50 transition-all duration-300 transform hover:scale-110"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              
              <div className="flex space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index % 2 === 0 ? index : index - 1)}
                    className="focus:outline-none"
                  >
                    <div className={`w-2 h-2 rounded-full transition-all ${
                      index >= currentIndex && index < currentIndex + 2
                        ? 'bg-gold-400'
                        : 'bg-beige-400/30'
                    }`} />
                  </button>
                ))}
              </div>
              
              <button
                onClick={next}
                className="p-3 bg-gradient-to-r from-noir-800 to-noir-900 border border-beige-800/30 rounded-full text-gold-400 hover:bg-gold-400/10 hover:border-gold-400/50 transition-all duration-300 transform hover:scale-110"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialSlider;