import React, { useState } from 'react';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import AdminPanel from './components/AdminPanel';
import ServiceModal from './components/ServiceModal';
import Login from './components/Login';
import { mockServices } from './data/mockServices';
import { Service, AdminSettings } from './types';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [services, setServices] = useState<Service[]>(mockServices);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [user, setUser] = useState<{ email: string; role: string } | null>(null);

  const [settings, setSettings] = useState<AdminSettings>({
    whatsappNumber: '5535999999999',
    whatsappMessage: 'Olá! Gostaria de mais informações sobre o serviço: {serviceName}',
    googleCalendarId: 'seu-email-de-calendario@group.calendar.google.com',
    googleMapsUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3709.325983052494!2d-45.9189618850519!3d-21.42678698572635!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94b5f4a6e5e4e5d1%3A0x8e5e4e5d1e5e4e5d!2sAlfenas%2C%20MG!5e0!3m2!1spt-BR!2sbr!4v1678886400000',
    aboutPageContent: `A AlfenasCar nasceu da paixão por automóveis e do compromisso em oferecer serviços de estética automotiva de excelência. Fundada em Alfenas, nossa empresa rapidamente se estabeleceu como referência na região.\n\nCom uma equipe altamente qualificada e produtos de primeira linha, transformamos e protegemos seu veículo com técnicas especializadas e atenção aos mínimos detalhes.\n\nNossa missão é superar as expectativas dos clientes, oferecendo não apenas serviços de qualidade, mas uma experiência completa de cuidado automotivo.`,
    contactAddress: 'Rua das Flores, 123, Centro, Alfenas - MG',
    contactPhone: '(35) 99999-9999',
    contactEmail: 'contato@alfenascar.com',
    operatingHours: [
      { id: '1', day: 'Segunda a Sexta', time: '8h às 18h' },
      { id: '2', day: 'Sábado', time: '8h às 14h' }
    ]
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
    alert(`Redirecionando para o Google Calendar para agendar: ${service.name}`);
    setShowServiceModal(false);
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
      case 'admin':
        return user?.role === 'admin' ? (
          <AdminPanel
            services={services}
            onUpdateServices={setServices}
            settings={settings}
            onUpdateSettings={setSettings}
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
