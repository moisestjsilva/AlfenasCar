import React, { useState } from 'react';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import AdminPanel from './components/AdminPanel';
import ServiceModal from './components/ServiceModal';
import Login from './components/Login';
import SchedulingPage from './pages/SchedulingPage';
import { mockServices } from './data/mockServices';
import { Service, AdminSettings, Appointment } from './types';
import { addDays, formatISO } from 'date-fns';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [services, setServices] = useState<Service[]>(mockServices);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [user, setUser] = useState<{ email: string; role: string } | null>(null);

  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: 'appt1',
      serviceId: '1',
      serviceName: 'Lavagem Completa',
      customerName: 'João da Silva',
      customerEmail: 'joao@example.com',
      customerPhone: '35912345678',
      date: formatISO(new Date(), { representation: 'date' }),
      time: '14:00',
      status: 'confirmed'
    },
    {
      id: 'appt2',
      serviceId: '2',
      serviceName: 'Enceramento Premium',
      customerName: 'Maria Oliveira',
      customerEmail: 'maria@example.com',
      customerPhone: '35987654321',
      date: formatISO(addDays(new Date(), 1), { representation: 'date' }),
      time: '10:00',
      status: 'pending'
    }
  ]);

  const [settings, setSettings] = useState<AdminSettings>({
    whatsappNumber: '5535999999999',
    whatsappMessage: 'Olá! Gostaria de mais informações sobre o serviço: {serviceName}',
    googleMapsUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3709.325983052494!2d-45.9189618850519!3d-21.42678698572635!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94b5f4a6e5e4e5d1%3A0x8e5e4e5d1e5e4e5d!2sAlfenas%2C%20MG!5e0!3m2!1spt-BR!2sbr!4v1678886400000',
    aboutPageContent: `A AlfenasCar nasceu da paixão por automóveis e do compromisso em oferecer serviços de estética automotiva de excelência. Fundada em Alfenas, nossa empresa rapidamente se estabeleceu como referência na região.\n\nCom uma equipe altamente qualificada e produtos de primeira linha, transformamos e protegemos seu veículo com técnicas especializadas e atenção aos mínimos detalhes.\n\nNossa missão é superar as expectativas dos clientes, oferecendo não apenas serviços de qualidade, mas uma experiência completa de cuidado automotivo.`,
    contactAddress: 'Rua das Flores, 123, Centro, Alfenas - MG',
    contactPhone: '(35) 99999-9999',
    contactEmail: 'contato@alfenascar.com',
    schedule: {
      slotDuration: 60,
      days: {
        sunday: { enabled: false, startTime: '09:00', endTime: '18:00' },
        monday: { enabled: true, startTime: '08:00', endTime: '18:00', breakStartTime: '12:00', breakEndTime: '13:00' },
        tuesday: { enabled: true, startTime: '08:00', endTime: '18:00', breakStartTime: '12:00', breakEndTime: '13:00' },
        wednesday: { enabled: true, startTime: '08:00', endTime: '18:00', breakStartTime: '12:00', breakEndTime: '13:00' },
        thursday: { enabled: true, startTime: '08:00', endTime: '18:00', breakStartTime: '12:00', breakEndTime: '13:00' },
        friday: { enabled: true, startTime: '08:00', endTime: '18:00', breakStartTime: '12:00', breakEndTime: '13:00' },
        saturday: { enabled: true, startTime: '09:00', endTime: '14:00' },
      }
    }
  });

  const handleLogin = (email: string, password: string) => {
    if (email === 'admin@alfenascar.com' && password === 'admin123') {
      setUser({ email, role: 'admin' });
      setCurrentPage('admin');
    } else if (email === 'user@test.com' && password === 'user123') {
      setUser({ email, role: 'user' });
      setCurrentPage('home');
    } else {
      alert('Credenciais inválidas');
      return;
    }
    setShowLogin(false);
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('home');
  };

  const handleServiceClick = (service: Service) => {
    setSelectedService(service);
    setShowServiceModal(true);
  };

  const handleSchedule = (service: Service) => {
    setSelectedService(service);
    setCurrentPage('scheduling');
    setShowServiceModal(false);
  };

  const handleCreateAppointment = (appointmentData: Omit<Appointment, 'id' | 'status'>) => {
    const newAppointment: Appointment = {
      ...appointmentData,
      id: Date.now().toString(),
      status: 'pending',
    };
    setAppointments(prev => [...prev, newAppointment]);
    alert('Agendamento solicitado com sucesso! Aguarde a confirmação.');
    setCurrentPage('home');
  };

  const handleUpdateAppointments = (updatedAppointments: Appointment[]) => {
    setAppointments(updatedAppointments);
  };

  const handleWhatsApp = (service?: Service) => {
    const baseMessage = service 
      ? settings.whatsappMessage.replace('{serviceName}', service.name)
      : 'Olá! Gostaria de mais informações sobre os serviços da AlfenasCar.';
    
    const message = encodeURIComponent(baseMessage);
    window.open(`https://wa.me/${settings.whatsappNumber}?text=${message}`, '_blank');
    
    if (service) {
      setShowServiceModal(false);
    }
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <HomePage
            services={services}
            onServiceClick={handleServiceClick}
            onNavigateToServices={() => setCurrentPage('services')}
            onWhatsApp={() => handleWhatsApp()}
          />
        );
      case 'services':
        return (
          <ServicesPage
            services={services}
            onServiceClick={handleServiceClick}
          />
        );
      case 'about':
        return <AboutPage settings={settings} />;
      case 'contact':
        return <ContactPage settings={settings} onWhatsApp={handleWhatsApp} />;
      case 'scheduling':
        if (!selectedService) {
          setCurrentPage('services');
          return null;
        }
        return (
          <SchedulingPage
            service={selectedService}
            settings={settings}
            appointments={appointments}
            onCreateAppointment={handleCreateAppointment}
            onBack={() => setCurrentPage('services')}
          />
        );
      case 'admin':
        return user?.role === 'admin' ? (
          <AdminPanel
            services={services}
            onUpdateServices={setServices}
            settings={settings}
            onUpdateSettings={setSettings}
            appointments={appointments}
            onUpdateAppointments={handleUpdateAppointments}
          />
        ) : (
          <div className="min-h-screen bg-black flex items-center justify-center">
            <p className="text-white text-xl">Acesso negado</p>
          </div>
        );
      default:
        return (
          <HomePage
            services={services}
            onServiceClick={handleServiceClick}
            onNavigateToServices={() => setCurrentPage('services')}
            onWhatsApp={() => handleWhatsApp()}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <Header
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        user={user}
        onLogin={() => setShowLogin(true)}
        onLogout={handleLogout}
      />
      
      {renderCurrentPage()}
      
      <ServiceModal
        service={selectedService}
        isOpen={showServiceModal}
        onClose={() => setShowServiceModal(false)}
        onSchedule={handleSchedule}
        onWhatsApp={handleWhatsApp}
      />
      
      <Login
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onLogin={handleLogin}
      />
    </div>
  );
}

export default App;
