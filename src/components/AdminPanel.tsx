import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Save, X, Settings, FileText, Info, Clock } from 'lucide-react';
import { Service, AdminSettings } from '../types';

interface AdminPanelProps {
  services: Service[];
  onUpdateServices: (services: Service[]) => void;
  settings: AdminSettings;
  onUpdateSettings: (settings: AdminSettings) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ services, onUpdateServices, settings, onUpdateSettings }) => {
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<Service>>({});
  const [localSettings, setLocalSettings] = useState<AdminSettings>(settings);
  const [activeTab, setActiveTab] = useState('services');

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setLocalSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleOperatingHoursChange = (id: string, field: 'day' | 'time', value: string) => {
    setLocalSettings(prev => ({
      ...prev,
      operatingHours: prev.operatingHours.map(h => h.id === id ? { ...h, [field]: value } : h)
    }));
  };

  const addOperatingHour = () => {
    setLocalSettings(prev => ({
      ...prev,
      operatingHours: [...prev.operatingHours, { id: Date.now().toString(), day: '', time: '' }]
    }));
  };

  const removeOperatingHour = (id: string) => {
    setLocalSettings(prev => ({
      ...prev,
      operatingHours: prev.operatingHours.filter(h => h.id !== id)
    }));
  };

  const handleSaveSettings = () => {
    onUpdateSettings(localSettings);
    alert('Configurações salvas com sucesso!');
  };

  const handleAddService = () => {
    setFormData({
      name: '', description: '', shortDescription: '', price: 0,
      duration: '', image: '', category: '', featured: false
    });
    setEditingService(null);
    setShowForm(true);
  };

  const handleEditService = (service: Service) => {
    setFormData(service);
    setEditingService(service);
    setShowForm(true);
  };

  const handleDeleteService = (serviceId: string) => {
    if (confirm('Tem certeza que deseja excluir este serviço?')) {
      onUpdateServices(services.filter(s => s.id !== serviceId));
    }
  };

  const handleSaveService = () => {
    if (!formData.name || !formData.price) return;
    const serviceData: Service = {
      id: editingService?.id || Date.now().toString(),
      name: formData.name || '',
      description: formData.description || '',
      shortDescription: formData.shortDescription || '',
      price: formData.price || 0,
      duration: formData.duration || '',
      image: formData.image || 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/500x300',
      category: formData.category || '',
      featured: formData.featured || false
    };
    const updatedServices = editingService
      ? services.map(s => s.id === editingService.id ? serviceData : s)
      : [...services, serviceData];
    onUpdateServices(updatedServices);
    setShowForm(false);
  };

  const renderServicesTab = () => (
    <>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-white text-2xl font-bold">Gerenciar Serviços</h2>
        <motion.button onClick={handleAddService} className="bg-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors flex items-center space-x-2" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Plus size={20} />
          <span>Adicionar Serviço</span>
        </motion.button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {services.map((service) => (
          <motion.div key={service.id} className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <img src={service.image} alt={service.name} className="w-full h-32 object-cover" />
            <div className="p-4">
              <h3 className="text-white font-bold mb-2">{service.name}</h3>
              <p className="text-gray-400 text-sm mb-2">{service.category}</p>
              <p className="text-red-500 font-bold">R$ {service.price.toFixed(2)}</p>
              <div className="flex space-x-2 mt-4">
                <motion.button onClick={() => handleEditService(service)} className="flex-1 bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700 transition-colors flex items-center justify-center space-x-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Edit size={16} /><span>Editar</span>
                </motion.button>
                <motion.button onClick={() => handleDeleteService(service.id)} className="flex-1 bg-red-600 text-white py-2 px-3 rounded text-sm hover:bg-red-700 transition-colors flex items-center justify-center space-x-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Trash2 size={16} /><span>Excluir</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </>
  );

  const renderSettingsTab = () => (
    <motion.div className="bg-gray-900 rounded-lg border border-gray-800 p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
      <div className="flex items-center space-x-3 mb-6">
        <h2 className="text-white text-2xl font-bold">Configurações Gerais do Site</h2>
      </div>
      <div className="space-y-6">
        {/* Section: Integrações */}
        <div className="p-4 border border-gray-700 rounded-lg">
          <h3 className="text-lg font-semibold text-red-500 mb-4 flex items-center"><Settings className="mr-2" size={20}/>Integrações</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-white text-sm font-medium mb-2">ID do Google Calendar</label>
              <input type="text" name="googleCalendarId" value={localSettings.googleCalendarId} onChange={handleSettingsChange} className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-red-500" />
            </div>
            <div>
              <label className="block text-white text-sm font-medium mb-2">URL do Google Maps (Embed)</label>
              <input type="text" name="googleMapsUrl" value={localSettings.googleMapsUrl} onChange={handleSettingsChange} className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-red-500" />
            </div>
          </div>
        </div>

        {/* Section: Contato */}
        <div className="p-4 border border-gray-700 rounded-lg">
          <h3 className="text-lg font-semibold text-red-500 mb-4 flex items-center"><Info className="mr-2" size={20}/>Informações de Contato</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-white text-sm font-medium mb-2">Número do WhatsApp</label>
              <input type="text" name="whatsappNumber" value={localSettings.whatsappNumber} onChange={handleSettingsChange} className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-red-500" />
            </div>
            <div>
              <label className="block text-white text-sm font-medium mb-2">Endereço</label>
              <input type="text" name="contactAddress" value={localSettings.contactAddress} onChange={handleSettingsChange} className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-red-500" />
            </div>
            <div>
              <label className="block text-white text-sm font-medium mb-2">Telefone de Contato</label>
              <input type="text" name="contactPhone" value={localSettings.contactPhone} onChange={handleSettingsChange} className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-red-500" />
            </div>
            <div>
              <label className="block text-white text-sm font-medium mb-2">Email de Contato</label>
              <input type="email" name="contactEmail" value={localSettings.contactEmail} onChange={handleSettingsChange} className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-red-500" />
            </div>
          </div>
        </div>

        {/* Section: Conteúdo */}
        <div className="p-4 border border-gray-700 rounded-lg">
          <h3 className="text-lg font-semibold text-red-500 mb-4 flex items-center"><FileText className="mr-2" size={20}/>Conteúdo das Páginas</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-white text-sm font-medium mb-2">Conteúdo da Página "Sobre"</label>
              <textarea name="aboutPageContent" value={localSettings.aboutPageContent} onChange={handleSettingsChange} className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-red-500 h-32" />
            </div>
            <div>
              <label className="block text-white text-sm font-medium mb-2">Mensagem Padrão do WhatsApp</label>
              <textarea name="whatsappMessage" value={localSettings.whatsappMessage} onChange={handleSettingsChange} className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-red-500 h-24" />
            </div>
          </div>
        </div>

        {/* Section: Horários */}
        <div className="p-4 border border-gray-700 rounded-lg">
          <h3 className="text-lg font-semibold text-red-500 mb-4 flex items-center"><Clock className="mr-2" size={20}/>Horário de Funcionamento</h3>
          <div className="space-y-2">
            {localSettings.operatingHours.map(hour => (
              <div key={hour.id} className="flex items-center space-x-2">
                <input type="text" value={hour.day} onChange={(e) => handleOperatingHoursChange(hour.id, 'day', e.target.value)} className="w-1/2 bg-gray-800 border border-gray-700 rounded-lg py-2 px-3 text-white" placeholder="Dia(s)"/>
                <input type="text" value={hour.time} onChange={(e) => handleOperatingHoursChange(hour.id, 'time', e.target.value)} className="w-1/2 bg-gray-800 border border-gray-700 rounded-lg py-2 px-3 text-white" placeholder="Horário"/>
                <button onClick={() => removeOperatingHour(hour.id)} className="text-red-500 hover:text-red-400 p-2"><Trash2 size={18}/></button>
              </div>
            ))}
          </div>
          <button onClick={addOperatingHour} className="text-red-500 hover:text-red-400 mt-2 text-sm flex items-center"><Plus size={16} className="mr-1"/>Adicionar horário</button>
        </div>

        <div className="flex justify-end mt-6">
          <motion.button onClick={handleSaveSettings} className="bg-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors flex items-center space-x-2" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Save size={20} /><span>Salvar Todas as Configurações</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-black py-20">
      <div className="container mx-auto px-4">
        <h1 className="text-white text-3xl font-bold mb-8">Painel Administrativo</h1>

        <div className="mb-8 border-b border-gray-700">
          <nav className="flex space-x-4">
            <button onClick={() => setActiveTab('services')} className={`py-4 px-1 font-medium ${activeTab === 'services' ? 'text-red-500 border-b-2 border-red-500' : 'text-gray-400 hover:text-white'}`}>Serviços</button>
            <button onClick={() => setActiveTab('settings')} className={`py-4 px-1 font-medium ${activeTab === 'settings' ? 'text-red-500 border-b-2 border-red-500' : 'text-gray-400 hover:text-white'}`}>Configurações do Site</button>
          </nav>
        </div>

        {activeTab === 'services' && renderServicesTab()}
        {activeTab === 'settings' && renderSettingsTab()}

        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowForm(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative bg-gray-900 rounded-xl border border-gray-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-white text-xl font-bold">{editingService ? 'Editar Serviço' : 'Adicionar Serviço'}</h2>
                  <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white"><X size={24} /></button>
                </div>
                <div className="space-y-4">
                  <input type="text" value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 text-white" placeholder="Nome"/>
                  <input type="text" value={formData.shortDescription || ''} onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 text-white" placeholder="Descrição Curta"/>
                  <textarea value={formData.description || ''} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 text-white h-24" placeholder="Descrição Completa"/>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="number" step="0.01" value={formData.price || ''} onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })} className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 text-white" placeholder="Preço (R$)"/>
                    <input type="text" value={formData.duration || ''} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 text-white" placeholder="Duração (ex: 45 min)"/>
                  </div>
                  <select value={formData.category || ''} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 text-white">
                    <option value="">Selecione uma categoria</option>
                    <option value="Lavagem">Lavagem</option><option value="Enceramento">Enceramento</option><option value="Detalhamento">Detalhamento</option><option value="Polimento">Polimento</option>
                  </select>
                  <input type="url" value={formData.image || ''} onChange={(e) => setFormData({ ...formData, image: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 text-white" placeholder="URL da Imagem"/>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="featured" checked={formData.featured || false} onChange={(e) => setFormData({ ...formData, featured: e.target.checked })} className="rounded"/>
                    <label htmlFor="featured" className="text-white text-sm">Serviço em destaque</label>
                  </div>
                  <div className="flex space-x-4 pt-4">
                    <motion.button onClick={handleSaveService} className="flex-1 bg-red-500 text-white py-3 px-6 rounded-lg font-semibold" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}><Save size={20} className="inline-block mr-2"/>Salvar</motion.button>
                    <motion.button onClick={() => setShowForm(false)} className="flex-1 bg-gray-600 text-white py-3 px-6 rounded-lg font-semibold" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>Cancelar</motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
