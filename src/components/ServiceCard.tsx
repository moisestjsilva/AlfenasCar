import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Star } from 'lucide-react';
import { Service } from '../types';

interface ServiceCardProps {
  service: Service;
  onClick: (service: Service) => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, onClick }) => {
  return (
    <motion.div
      className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800 hover:border-red-500 transition-all duration-300 cursor-pointer group"
      onClick={() => onClick(service)}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative">
        <img
          src={service.image}
          alt={service.name}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
        />
        {service.featured && (
          <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
            <Star size={12} fill="currentColor" />
            <span>Destaque</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>
      
      <div className="p-6">
        <h3 className="text-white text-xl font-bold mb-2 group-hover:text-red-500 transition-colors">
          {service.name}
        </h3>
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
          {service.shortDescription}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-gray-400">
            <Clock size={16} />
            <span className="text-sm">{service.duration}</span>
          </div>
          <div className="text-right">
            <span className="text-gray-400 text-sm">A partir de</span>
            <div className="text-red-500 text-xl font-bold">
              R$ {service.price.toFixed(2)}
            </div>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-800">
          <span className="inline-block bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-xs font-medium">
            {service.category}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default ServiceCard;
