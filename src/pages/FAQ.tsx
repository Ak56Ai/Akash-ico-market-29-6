import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "What is an ICO?",
      answer: "An ICO (Initial Coin Offering) is a fundraising method where new cryptocurrency projects sell tokens to investors to raise capital for development."
    },
    {
      question: "How do I participate in an ICO?",
      answer: "To participate, you need to create an account, complete KYC verification, connect your wallet, and select the ICO you want to invest in."
    },
    {
      question: "What payment methods are accepted?",
      answer: "We accept various cryptocurrencies including ETH, BNB, and USDT for ICO investments."
    },
    {
      question: "How are funds secured?",
      answer: "We implement multi-signature wallets, cold storage, and regular security audits to ensure the safety of all funds."
    },
    {
      question: "What is the minimum investment?",
      answer: "The minimum investment varies by project but typically starts at 1 USDT equivalent."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black pt-24">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Frequently Asked <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">Questions</span>
          </h1>
          <p className="text-gray-300 text-lg">
            Find answers to common questions about our platform, ICOs, and investment process.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className="relative group mb-4"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-xl blur-lg opacity-80"></div>
              
              <div className="relative rounded-xl p-1">
                <div className="rounded-lg bg-gray-800/90 backdrop-blur-sm border border-white/10 overflow-hidden">
                  <button
                    className="w-full px-6 py-4 flex items-center justify-between text-left"
                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  >
                    <span className="text-lg font-semibold text-white">{faq.question}</span>
                    {openIndex === index ? (
                      <ChevronUp className="h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                  
                  <div 
                    className={`px-6 transition-all duration-300 ease-in-out ${
                      openIndex === index ? 'max-h-48 pb-4' : 'max-h-0'
                    } overflow-hidden`}
                  >
                    <p className="text-gray-300">{faq.answer}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="max-w-2xl mx-auto mt-16">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/30 to-blue-600/30 rounded-3xl blur-xl"></div>
            
            <div className="relative rounded-3xl p-1">
              <div className="rounded-2xl bg-gray-800/90 backdrop-blur-sm border border-white/10 p-8 text-center">
                <h3 className="text-2xl font-bold text-white mb-4">Still Have Questions?</h3>
                <p className="text-gray-300 mb-6">
                  Our support team is here to help you 24/7. Don't hesitate to reach out.
                </p>
                <a 
                  href="/contact"
                  className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 text-white font-medium transition-all transform hover:scale-105"
                >
                  Contact Support
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;