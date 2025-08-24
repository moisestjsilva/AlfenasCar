import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Save, X, Settings, FileText, Info, Clock, Calendar, Check, Ban, BadgeInfo } from 'lucide-react';
import { Service, AdminSettings, Appointment, DaySchedule, ScheduleSettings } from '../types';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface AdminPanelProps {
  services: Service[];
  onUpdateServices: (services: Service[]) => void;
  settings: AdminSettings;
  onUpdateSettings: (settings: AdminSettings) => void;
  appointments: Appointment[];
  onUpdateAppointments: (appointments: Appointment[]) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ services, onUpdateServices, settings, onUpdateSettings, appointments, onUpdateAppointments }) => {
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<Service>>({});
  const [localSettings, setLocalSettings] = useState<AdminSettings>(settings);
  const [activeTab, setActiveTab] = useState('agenda');

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setLocalSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleScheduleSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const [day, field] = name.split('.');
    
    setLocalSettings(prev => {
      const newSchedule = { ...prev.schedule };
      if (day === 'slotDuration') {
        newSchedule.slotDuration = parseInt(value, 10);
      } else {
        const dayKey = day as keyof ScheduleSettings['days'];
        const daySchedule = { ...newSchedule.days[dayKey] };
        
        if (type === 'checkbox') {
          daySchedule.enabled = checked;
        } else {
          (daySchedule as any)[field] = value;
        }
        newSchedule.days[dayKey] = daySchedule;
      }
      return { ...prev, schedule: newSchedule };
    });
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
      image: formData.image || 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/500x300',
      category: formData.category || '',
      featured: formData.featured || false
    };
    const updatedServices = editingService
      ? services.map(s => s.id === editingService.id ? serviceData : s)
      : [...services, serviceData];
    onUpdateServices(updatedServices);
    setShowForm(false);
  };

  const handleAppointmentStatusChange = (id: string, status: Appointment['status']) => {
    const updated = appointments.map(app => app.id === id ? { ...app, status } : app);
    onUpdateAppointments(updated);
  };

  const renderAgendaTab = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <h2 className="text-white text-2xl font-bold mb-6">Gerenciar Agendamentos</h2>
      <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-800">
              <tr>
                <th className="p-4 text-white font-semibold text-sm">Cliente</th>
                <th className="p-4 text-white font-semibold text-sm">Serviço</th>
                <th className="p-4 text-white font-semibold text-sm">Data & Hora</th>
                <th className="p-4 text-white font-semibold text-sm">Status</th>
                <th className="p-4 text-white font-semibold text-sm">Ações</th>
              </tr>
            </thead>
            <tbody>
              {appointments.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(app => (
                <tr key={app.id} className="border-b border-gray-800 last:border-b-0">
                  <td className="p-4 text-white">
                    <div className="font-medium">{app.customerName}</div>
                    <div className="text-sm text-gray-400">{app.customerEmail}</div>
                  </td>
                  <td className="p-4 text-gray-300">{app.serviceName}</td>
                  <td className="p-4 text-gray-300">
                    {format(parseISO(app.date), "dd/MM/yyyy", { locale: ptBR })} às {app.time}
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      app.status === 'confirmed' ? 'bg-green-500/20 text-green-400' :
                      app.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                      app.status === 'completed' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="p-4">
                    {app.status === 'pending' && (
                      <motion.button onClick={() => handleAppointmentStatusChange(app.id, 'confirmed')} className="text-green-400 hover:text-green-300 mr-2 p-1" title="Confirmar">
                        <Check size={18} />
                      </motion.button>
                    )}
                    {app.status !== 'cancelled' && (
                       <motion.button onClick={() => handleAppointmentStatusChange(app.id, 'cancelled')} className="text-red-400 hover:text-red-300 p-1" title="Cancelar">
                         <Ban size={18} />
                       </motion.button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );

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
      <div className="space-y-6">
        {/* Section: Horários */}
        <div className="p-4 border border-gray-700 rounded-lg">
          <h3 className="text-lg font-semibold text-red-500 mb-4 flex items-center"><Clock className="mr-2" size={20}/>Horário de Funcionamento</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-white text-sm font-medium mb-2">Duração do Slot (minutos)</label>
              <input type="number" name="slotDuration" value={localSettings.schedule.slotDuration} onChange={handleScheduleSettingsChange} className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-red-500" />
            </div>
            {Object.entries(localSettings.schedule.days).map(([day, schedule]) => (
              <div key={day} className="p-3 bg-gray-800/50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-white font-medium capitalize">{day}</span>
                  <input type="checkbox" name={`${day}.enabled`} checked={schedule.enabled} onChange={handleScheduleSettingsChange} className="form-checkbox h-5 w-5 text-red-600 bg-gray-700 border-gray-600 rounded focus:ring-red-500" />
                </div>
                {schedule.enabled && (
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <label className="text-xs text-gray-400">Início</label>
                      <input type="time" name={`${day}.startTime`} value={schedule.startTime} onChange={handleScheduleSettingsChange} className="w-full bg-gray-700 border border-gray-600 rounded-md p-1 text-white text-sm" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400">Fim</label>
                      <input type="time" name={`${day}.endTime`} value={schedule.endTime} onChange={handleScheduleSettingsChange} className="w-full bg-gray-700 border border-gray-600 rounded-md p-1 text-white text-sm" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400">Início Pausa</label>
                      <input type="time" name={`${day}.breakStartTime`} value={schedule.breakStartTime || ''} onChange={handleScheduleSettingsChange} className="w-full bg-gray-700 border border-gray-600 rounded-md p-1 text-white text-sm" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400">Fim Pausa</label>
                      <input type="time" name={`${day}.breakEndTime`} value={schedule.breakEndTime || ''} onChange={handleScheduleSettingsChange} className="w-full bg-gray-700 border border-gray-600 rounded-md p-1 text-white text-sm" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Section: Contato */}
        <div className="p-4 border border-gray-700 rounded-lg">
          <h3 className="text-lg font-semibold text-red-500 mb-4 flex items-center"><Info className="mr-2" size={20}/>Informações de Contato</h3>
          <div className="space-y-4">
            <input type="text" name="whatsappNumber" placeholder="Número do WhatsApp" value={localSettings.whatsappNumber} onChange={handleSettingsChange} className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-red-500" />
            <input type="text" name="contactAddress" placeholder="Endereço" value={localSettings.contactAddress} onChange={handleSettingsChange} className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-red-500" />
            <input type="text" name="contactPhone" placeholder="Telefone de Contato" value={localSettings.contactPhone} onChange={handleSettingsChange} className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-red-500" />
            <input type="email" name="contactEmail" placeholder="Email de Contato" value={localSettings.contactEmail} onChange={handleSettingsChange} className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-red-500" />
          </div>
        </div>

        {/* Section: Conteúdo */}
        <div className="p-4 border border-gray-700 rounded-lg">
          <h3 className="text-lg font-semibold text-red-500 mb-4 flex items-center"><FileText className="mr-2" size={20}/>Conteúdo das Páginas</h3>
          <div className="space-y-4">
            <textarea name="aboutPageContent" placeholder="Conteúdo da Página 'Sobre'" value={localSettings.aboutPageContent} onChange={handleSettingsChange} className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-red-500 h-32" />
            <textarea name="whatsappMessage" placeholder="Mensagem Padrão do WhatsApp" value={localSettings.whatsappMessage} onChange={handleSettingsChange} className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-red-500 h-24" />
          </div>
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
            <button onClick={() => setActiveTab('agenda')} className={`py-4 px-1 font-medium ${activeTab === 'agenda' ? 'text-red-500 border-b-2 border-red-500' : 'text-gray-400 hover:text-white'}`}>Agenda</button>
            <button onClick={() => setActiveTab('services')} className={`py-4 px-1 font-medium ${activeTab === 'services' ? 'text-red-500 border-b-2 border-red-500' : 'text-gray-400 hover:text-white'}`}>Serviços</button>
            <button onClick={() => setActiveTab('settings')} className={`py-4 px-1 font-medium ${activeTab === 'settings' ? 'text-red-500 border-b-2 border-red-500' : 'text-gray-400 hover:text-white'}`}>Configurações</button>
          </nav>
        </div>

        {activeTab === 'agenda' && renderAgendaTab()}
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
                    <input type="text" value={formData.duration || ''} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 text-white" placeholder="Duração (ex: 60 min)"/>
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
