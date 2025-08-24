import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Calendar, MessageCircle, Star } from 'lucide-react';
import { Service } from '../types';

interface ServiceModalProps {
  service: Service | null;
  isOpen: boolean;
  onClose: () => void;
  onSchedule: (service: Service) => void;
  onWhatsApp: (service: Service) => void;
}

const ServiceModal: React.FC<ServiceModalProps> = ({ 
  service, 
  isOpen, 
  onClose, 
  onSchedule, 
  onWhatsApp 
}) => {
  if (!service) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-gray-900 rounded-xl border border-gray-800 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white z-10 bg-black/50 rounded-full p-2"
            >
              <X size={24} />
            </button>

            <div className="relative">
              <img
                src={service.image}
                alt={service.name}
                className="w-full h-64 object-cover"
              />
              {service.featured && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                  <Star size={14} fill="currentColor" />
                  <span>Destaque</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>

            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-white text-2xl font-bold mb-2">{service.name}</h2>
                  <span className="inline-block bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-sm font-medium">
                    {service.category}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-gray-400 text-sm">A partir de</span>
                  <div className="text-red-500 text-3xl font-bold">
                    R$ {service.price.toFixed(2)}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4 mb-6 text-gray-400">
                <div className="flex items-center space-x-2">
                  <Clock size={18} />
                  <span>Duração: {service.duration}</span>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-white text-lg font-semibold mb-3">Descrição do Serviço</h3>
                <p className="text-gray-300 leading-relaxed">{service.description}</p>
              </div>

              <div className="mb-6">
                <h3 className="text-white text-lg font-semibold mb-3">O que está incluído:</h3>
                <ul className="text-gray-300 space-y-2">
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full" />
                    <span>Produtos de alta qualidade</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full" />
                    <span>Mão de obra especializada</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full" />
                    <span>Garantia de qualidade</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full" />
                    <span>Atendimento personalizado</span>
                  </li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                <motion.button
                  onClick={() => onSchedule(service)}
                  className="flex-1 bg-red-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-600 transition-colors flex items-center justify-center space-x-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Calendar size={20} />
                  <span>Agendar Agora</span>
                </motion.button>
                
                <motion.button
                  onClick={() => onWhatsApp(service)}
                  className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <MessageCircle size={20} />
                  <span>WhatsApp</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ServiceModal;
