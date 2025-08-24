import React from 'react';
import Hero from '../components/Hero';
import ServiceCard from '../components/ServiceCard';
import { Service } from '../types';
import { motion } from 'framer-motion';

interface HomePageProps {
  services: Service[];
  onServiceClick: (service: Service) => void;
  onNavigateToServices: () => void;
  onWhatsApp: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ 
  services, 
  onServiceClick, 
  onNavigateToServices, 
  onWhatsApp 
}) => {
  const featuredServices = services.filter(service => service.featured).slice(0, 3);

  return (
    <div className="bg-black">
      <Hero onNavigateToServices={onNavigateToServices} onWhatsApp={onWhatsApp} />
      
      {/* Featured Services Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-white text-3xl md:text-4xl font-bold mb-4">
              Serviços em Destaque
            </h2>
            <div className="w-24 h-1 bg-red-500 mx-auto mb-6"></div>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Conheça nossos serviços mais populares, desenvolvidos com técnicas especializadas e produtos de alta qualidade
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredServices.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <ServiceCard service={service} onClick={onServiceClick} />
              </motion.div>
            ))}
          </div>

          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <motion.button
              onClick={onNavigateToServices}
              className="bg-red-500 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-red-600 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Ver Todos os Serviços
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { number: '500+', label: 'Clientes Satisfeitos' },
              { number: '5+', label: 'Anos de Experiência' },
              { number: '24/7', label: 'Atendimento WhatsApp' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <div className="text-red-500 text-4xl md:text-5xl font-bold mb-2">
                  {stat.number}
                </div>
                <div className="text-white text-lg">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
