import React from 'react';
import { motion } from 'framer-motion';
import { Star, Users, Award, Clock, Gem, ShieldCheck, Lightbulb } from 'lucide-react';
import { AdminSettings } from '../types';

interface AboutPageProps {
  settings: AdminSettings;
}

const AboutPage: React.FC<AboutPageProps> = ({ settings }) => {
  const values = [
    {
      icon: Gem,
      title: 'Qualidade',
      description: 'Utilizamos apenas produtos premium e técnicas especializadas para garantir os melhores resultados.'
    },
    {
      icon: ShieldCheck,
      title: 'Confiança',
      description: 'Transparência em todos os processos e compromisso com prazos e orçamentos acordados.'
    },
    {
      icon: Lightbulb,
      title: 'Inovação',
      description: 'Sempre atualizados com as mais modernas técnicas e equipamentos do mercado automotivo.'
    }
  ];

  return (
    <div className="min-h-screen bg-black py-20">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-white text-4xl md:text-5xl font-bold mb-4">
            Sobre a AlfenasCar
          </h1>
          <div className="w-24 h-1 bg-red-500 mx-auto mb-6"></div>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            Especializada em estética automotiva, oferecemos serviços de qualidade superior com mais de 5 anos de experiência no mercado
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="text-white text-3xl font-bold mb-6">Nossa História</h2>
            <div className="space-y-4 text-gray-300 leading-relaxed whitespace-pre-wrap">
              {settings.aboutPageContent}
            </div>
          </motion.div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <img
              src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop"
              alt="AlfenasCar - Estética Automotiva"
              className="rounded-lg w-full h-96 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-lg" />
          </motion.div>
        </div>

        {/* Stats Section */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {[
            { icon: Users, number: '500+', label: 'Clientes Atendidos' },
            { icon: Star, number: '5', label: 'Estrelas de Avaliação' },
            { icon: Award, number: '5+', label: 'Anos de Experiência' },
            { icon: Clock, number: '24/7', label: 'Suporte WhatsApp' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="text-center p-6 bg-gray-900 rounded-lg border border-gray-800"
              whileHover={{ scale: 1.05, borderColor: '#ef4444' }}
              transition={{ duration: 0.3 }}
            >
              <stat.icon className="text-red-500 w-12 h-12 mx-auto mb-4" />
              <div className="text-red-500 text-3xl font-bold mb-2">{stat.number}</div>
              <div className="text-white font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Values Section */}
        <motion.div
          className="bg-gray-900 rounded-xl p-8 md:p-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <h2 className="text-white text-3xl font-bold text-center mb-12">Nossos Valores</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1 + (index * 0.2) }}
              >
                <div className="w-16 h-16 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-8 h-8" />
                </div>
                <h3 className="text-white text-xl font-bold mb-3">{value.title}</h3>
                <p className="text-gray-400 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutPage;
