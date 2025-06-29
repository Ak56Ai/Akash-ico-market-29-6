import React from 'react';
import { Star, Quote } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      name: "Alex Thompson",
      role: "ICO Investor",
      image: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      content: "The platform's user-friendly interface and robust security features made investing in ICOs a breeze."
    },
    {
      name: "Sarah Chen",
      role: "Project Founder",
      image: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      content: "Launching our ICO on MeCoin platform helped us reach a global audience and achieve our funding goals."
    },
    {
      name: "Michael Roberts",
      role: "Crypto Enthusiast",
      image: "https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      content: "The transparency and security measures give me confidence in every investment I make through the platform."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black pt-24">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            What Our <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">Users Say</span>
          </h1>
          <p className="text-gray-300 text-lg">
            Hear from our community of investors and project founders about their
            experience with the MeCoin platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="relative group transform transition-all duration-300 hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-2xl blur-xl opacity-80 group-hover:opacity-100"></div>
              
              <div className="relative h-full rounded-2xl p-1">
                <div className="h-full rounded-xl bg-gray-800/90 backdrop-blur-sm border border-white/10 p-8">
                  <Quote className="h-8 w-8 text-purple-400 mb-6" />
                  
                  <p className="text-gray-300 mb-6">{testimonial.content}</p>
                  
                  <div className="flex items-center">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover mr-4"
                    />
                    <div>
                      <h3 className="text-white font-semibold">{testimonial.name}</h3>
                      <p className="text-gray-400 text-sm">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/30 to-blue-600/30 rounded-3xl blur-xl"></div>
            
            <div className="relative rounded-3xl p-1">
              <div className="rounded-2xl bg-gray-800/90 backdrop-blur-sm border border-white/10 p-8 text-center">
                <div className="flex justify-center mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-8 w-8 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Join Our Growing Community</h3>
                <p className="text-gray-300 mb-6">
                  Become part of our success story and experience the future of ICO investments.
                </p>
                <a 
                  href="#"
                  className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 text-white font-medium transition-all transform hover:scale-105"
                >
                  Get Started Today
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;