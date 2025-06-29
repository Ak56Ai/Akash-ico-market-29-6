import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import ProjectListingModal from './ProjectListingModal';
import { supabase } from '../lib/supabase';

interface HeroAd {
  id: string;
  image_url: string;
  title: string;
  tagline: string;
  is_active: boolean;
  display_order: number;
}

const HeroSection: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [heroAds, setHeroAds] = useState<HeroAd[]>([]);
  const [loading, setLoading] = useState(true);

  // Fallback slides if database fails
  const fallbackSlides = [
    {
      title: "Unlock the Future of Crypto Investing in ICO!",
      tagline: "Discover, invest, and grow with exclusive ICO opportunities on all L1 and L2 networks. Fast, secure, and rewarding – join the next wave of blockchain innovation.",
      bgImage: "https://kufggdtvwplpngdlirpt.supabase.co/storage/v1/object/sign/hero/Under%20the%20Lake.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8xM2E2NzY1Yy0xNGM1LTRjZWUtYjU4ZC0wMWEzYTNlOTdmODAiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJoZXJvL1VuZGVyIHRoZSBMYWtlLmpwZyIsImlhdCI6MTc1MDMyMTg0MiwiZXhwIjoxNzgxODU3ODQyfQ.LLUCYFFLx-M_Vm9Aw6O6X9P3EMAsiDfZcsxyMQfoOvc"
    },
    {
      title: "Launch Your Next Big Idea on Any EVM Chain!",
      tagline: "Seamlessly create, manage, and participate in ICOs across all EVM-compatible blockchains like Ethereum, Polygon, Binance Smart Chain, and more.",
      bgImage: "https://kufggdtvwplpngdlirpt.supabase.co/storage/v1/object/sign/hero/Mauve.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8xM2E2NzY1Yy0xNGM1LTRjZWUtYjU4ZC0wMWEzYTNlOTdmODAiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJoZXJvL01hdXZlLmpwZyIsImlhdCI6MTc1MDMyMTk1NywiZXhwIjoxNzgxODU3OTU3fQ.Qp5zxnPOj8yC6TBb61ybBBISZHSnZ15YWySX-sBNEt0"
    },
    {
      title: "Your Gateway to ICOs Across All EVM Chains!",
      tagline: "Build, launch, and invest in ICOs effortlessly on Ethereum, Binance Smart Chain, Polygon, and beyond. One platform. Unlimited possibilities.",
      bgImage: "https://kufggdtvwplpngdlirpt.supabase.co/storage/v1/object/sign/hero/Under%20the%20Lake.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8xM2E2NzY1Yy0xNGM1LTRjZWUtYjU4ZC0wMWEzYTNlOTdmODAiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJoZXJvL1VuZGVyIHRoZSBMYWtlLmpwZyIsImlhdCI6MTc1MDMyMTk3NiwiZXhwIjoxNzgxODU3OTc2fQ.raKCH04eqBLJq8Ff89s5WjrC1TupBM7bFiMz1DPucPc"
    }
  ];

  useEffect(() => {
    fetchHeroAds();
  }, []);

  useEffect(() => {
    const slides = heroAds.length > 0 ? heroAds : fallbackSlides;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    
    return () => clearInterval(timer);
  }, [heroAds]);

  const fetchHeroAds = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('hero_ads')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) {
        console.error('Error fetching hero ads:', error);
        setHeroAds([]);
      } else {
        setHeroAds(data || []);
      }
    } catch (error) {
      console.error('Error fetching hero ads:', error);
      setHeroAds([]);
    } finally {
      setLoading(false);
    }
  };

  // Use hero ads if available, otherwise fallback to default slides
  const slides = heroAds.length > 0 ? heroAds.map(ad => ({
    title: ad.title,
    tagline: ad.tagline,
    bgImage: ad.image_url
  })) : fallbackSlides;

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-custom-dark z-10">
      {/* Background images */}
      <div className="absolute inset-0 z-0">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <img
              src={slide.bgImage}
              alt="Hero background"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-dark-bg/80 dark:bg-dark-bg/90" />
          </div>
        ))}
      </div>
      
      <div className="container mx-auto px-4 pt-32 relative z-0">
        <div className="max-w-3xl mx-auto md:mx-0">
          {slides.map((slide, index) => (
            <div 
              key={index} 
              className={`transition-all duration-1000 transform ${
                index === currentSlide 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-12'
              }`}
              style={{display: index === currentSlide ? 'block' : 'none'}}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                {slide.title.split(' ').map((word, i) => (
                  <span key={i} className={
                    word === "Future" || 
                    word === "ICO!" || 
                    word === "Big" || 
                    word === "Chain!" || 
                    word === "Gateway" ||
                    word === "Chains!"
                      ? 'gradient-text'
                      : 'text-dark-text'
                  }>
                    {word}{' '}
                  </span>
                ))}
              </h1>
              <p className="text-xl text-dark-text/80 mb-8">
                {slide.tagline}
              </p>
            </div>
          ))}

          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mt-8">
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn-primary inline-flex items-center justify-center"
            >
              List New Project
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
            <button className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-dark-accent1/20 backdrop-blur-sm hover:bg-dark-accent1/30 text-dark-text font-medium border border-dark-accent1/30 transition-all">
              Buy ICO
            </button>
          </div>
        </div>
        
        {/* Slide indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide 
                  ? 'bg-dark-accent2 w-8' 
                  : 'bg-dark-accent1/50 hover:bg-dark-accent1/80'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
      
      <ProjectListingModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </section>
  );
};

export default HeroSection;