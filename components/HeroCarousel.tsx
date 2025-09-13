
import React, { useState, useEffect, useCallback } from 'react';

const HERO_SLIDES = [
  {
    id: 1,
    imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2574&auto=format&fit=crop',
    title: 'Bienvenue chez Wafi',
    subtitle: 'Votre destination beauté et technologie au Sénégal'
  },
  {
    id: 2,
    imageUrl: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=2574&auto=format&fit=crop',
    title: 'Produits de Beauté Premium',
    subtitle: 'Révélez votre beauté naturelle avec nos soins d\'exception'
  },
  {
    id: 3,
    imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=2574&auto=format&fit=crop',
    title: 'Technologie de Pointe',
    subtitle: 'Les dernières innovations tech à portée de main'
  },
  {
    id: 4,
    imageUrl: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=2574&auto=format&fit=crop',
    title: 'Parfums & Cosmétiques',
    subtitle: 'Des fragrances uniques et des accessoires tendance'
  }
];

const HeroCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNext = useCallback(() => {
    setCurrentIndex(prevIndex => (prevIndex + 1) % HERO_SLIDES.length);
  }, []);

  const goToPrevious = () => {
    setCurrentIndex(prevIndex => (prevIndex - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      goToNext();
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, [goToNext]);

  return (
    <div className="relative w-full h-[60vh] max-h-[600px] rounded-xl overflow-hidden shadow-2xl mb-16 bg-gradient-to-r from-rose-500 to-pink-500">
      {HERO_SLIDES.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
        >
          <img src={slide.imageUrl} alt={slide.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent flex flex-col justify-center items-center text-center p-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight" style={{textShadow: '2px 2px 8px rgba(0,0,0,0.8)'}}>{slide.title}</h2>
              <p className="text-xl md:text-2xl text-gray-100 mb-8 font-light" style={{textShadow: '1px 1px 4px rgba(0,0,0,0.7)'}}>{slide.subtitle}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-rose-500 hover:bg-rose-600 text-white font-bold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg">
                  Découvrir nos produits
                </button>
                <button className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-gray-800 font-bold py-4 px-8 rounded-full transition-all duration-300">
                  Nous contacter
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button onClick={goToPrevious} className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-sm p-3 rounded-full text-white transition-all duration-300 hover:scale-110">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
      </button>
      <button onClick={goToNext} className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-sm p-3 rounded-full text-white transition-all duration-300 hover:scale-110">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
      </button>
      
      {/* Navigation Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3">
        {HERO_SLIDES.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-4 h-4 rounded-full transition-all duration-300 ${currentIndex === index ? 'bg-white scale-125 shadow-lg' : 'bg-white/50 hover:bg-white/70'}`}
              aria-label={`Go to slide ${index + 1}`}
           ></button>
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
