import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, MessageCircle, Send } from 'lucide-react';
import { AdminSettings } from '../types';

interface ContactPageProps {
  settings: AdminSettings;
  onWhatsApp: () => void;
}

const ContactPage: React.FC<ContactPageProps> = ({ settings, onWhatsApp }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

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
            Entre em Contato
          </h1>
          <div className="flex items-center justify-center space-x-1 mb-6">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-6 h-4 bg-red-500 transform skew-x-12"
                style={{ marginLeft: i > 0 ? '-6px' : '0' }}
              />
            ))}
          </div>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Estamos prontos para atender você. Entre em contato conosco através dos canais abaixo
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Contact Info */}
          <motion.div
            className="lg:col-span-1 space-y-8"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h2 className="text-white text-xl font-bold mb-6">Informações de Contato</h2>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <MapPin className="text-red-500" size={20} />
                  <div>
                    <p className="text-white font-medium">Endereço</p>
                    <p className="text-gray-400">{settings.contactAddress}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Phone className="text-red-500" size={20} />
                  <div>
                    <p className="text-white font-medium">Telefone</p>
                    <p className="text-gray-400">{settings.contactPhone}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Mail className="text-red-500" size={20} />
                  <div>
                    <p className="text-white font-medium">E-mail</p>
                    <p className="text-gray-400">{settings.contactEmail}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Clock className="text-red-500" size={20} />
                  <div>
                    <p className="text-white font-medium">Horários</p>
                    {settings.operatingHours.map(hour => (
                      <p key={hour.id} className="text-gray-400">{hour.day}: {hour.time}</p>
                    ))}
                  </div>
                </div>
              </div>
              
              <motion.button
                onClick={onWhatsApp}
                className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 mt-6"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <MessageCircle size={20} />
                <span>WhatsApp</span>
              </motion.button>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h2 className="text-white text-xl font-bold mb-6">Envie uma Mensagem</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Nome</label>
                    <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-red-500" required />
                  </div>
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">E-mail</label>
                    <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-red-500" required />
                  </div>
                </div>
                
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Telefone</label>
                  <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-red-500" />
                </div>
                
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Mensagem</label>
                  <textarea value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-red-500 h-32" required />
                </div>
                
                <motion.button type="submit" className="w-full bg-red-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-600 transition-colors flex items-center justify-center space-x-2" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Send size={20} />
                  <span>Enviar Mensagem</span>
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>

        {/* Map Section */}
        <motion.div
          className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800 h-96"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <iframe
            src={settings.googleMapsUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Localização da AlfenasCar"
          ></iframe>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactPage;
