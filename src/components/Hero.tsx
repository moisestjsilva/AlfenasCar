import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MessageCircle, Star } from 'lucide-react';

interface HeroProps {
  onNavigateToServices: () => void;
  onWhatsApp: () => void;
}

const Hero: React.FC<HeroProps> = ({ onNavigateToServices, onWhatsApp }) => {
  const RedArrows = () => (
    <div className="flex items-center justify-center space-x-1 mb-8">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="w-8 h-6 bg-red-500 transform skew-x-12"
          style={{ marginLeft: i > 0 ? '-10px' : '0' }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1, duration: 0.5 }}
        />
      ))}
    </div>
  );

  return (
    <section className="relative min-h-screen bg-black overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900" />
        <div className="absolute inset-0 opacity-10">
          <div className="grid grid-cols-12 h-full">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="border-r border-gray-800" />
            ))}
          </div>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 h-screen flex items-center">
        <div className="w-full">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <RedArrows />
            
            <motion.h1 
              className="text-white text-5xl md:text-7xl font-bold tracking-wider mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              ALFENAS CAR
            </motion.h1>
            
            <motion.p 
              className="text-white text-lg md:text-xl tracking-widest mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              ESTÉTICA AUTOMOTIVA
            </motion.p>

            <motion.div
              className="max-w-2xl mx-auto mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              <h2 className="text-gray-300 text-xl md:text-2xl mb-4 font-light">
                Transforme seu veículo com nossos serviços especializados
              </h2>
              <p className="text-gray-400 text-lg">
                Lavagem, enceramento, polimento e detalhamento automotivo de alta qualidade
              </p>
            </motion.div>

            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.8 }}
            >
              <motion.button
                onClick={onNavigateToServices}
                className="bg-red-500 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-red-600 transition-colors flex items-center space-x-3 shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Calendar size={24} />
                <span>Ver Serviços</span>
              </motion.button>
              
              <motion.button
                onClick={onWhatsApp}
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-black transition-colors flex items-center space-x-3"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <MessageCircle size={24} />
                <span>WhatsApp</span>
              </motion.button>
            </motion.div>

            <motion.div
              className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.8 }}
            >
              {[
                { icon: Star, title: 'Qualidade Premium', desc: 'Produtos e técnicas de primeira linha' },
                { icon: Calendar, title: 'Agendamento Fácil', desc: 'Agende online de forma rápida' },
                { icon: MessageCircle, title: 'Atendimento 24/7', desc: 'Suporte via WhatsApp sempre disponível' }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="text-center p-6 bg-gray-900/50 rounded-lg border border-gray-800"
                  whileHover={{ scale: 1.05, borderColor: '#ef4444' }}
                  transition={{ duration: 0.3 }}
                >
                  <item.icon className="text-red-500 w-12 h-12 mx-auto mb-4" />
                  <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-400 text-sm">{item.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Animated Background Elements */}
      <motion.div
        className="absolute top-1/4 left-10 w-20 h-20 bg-red-500/10 rounded-full"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.3, 0.1]
        }}
        transition={{ 
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-1/4 right-10 w-32 h-32 bg-red-500/10 rounded-full"
        animate={{ 
          scale: [1.2, 1, 1.2],
          opacity: [0.1, 0.2, 0.1]
        }}
        transition={{ 
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </section>
  );
};

export default Hero;
