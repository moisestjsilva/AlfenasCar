import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { ptBR } from 'date-fns/locale';
import { format, addMinutes, parse, getDay, setHours, setMinutes, isBefore, isEqual, startOfToday } from 'date-fns';
import { Service, AdminSettings, Appointment } from '../types';
import { ArrowLeft, Calendar, Clock, User, Phone, Mail, Send } from 'lucide-react';

interface SchedulingPageProps {
  service: Service;
  settings: AdminSettings;
  appointments: Appointment[];
  onCreateAppointment: (appointmentData: Omit<Appointment, 'id' | 'status'>) => void;
  onBack: () => void;
}

const SchedulingPage: React.FC<SchedulingPageProps> = ({ service, settings, appointments, onCreateAppointment, onBack }) => {
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [customerDetails, setCustomerDetails] = useState({ name: '', email: '', phone: '' });

  const timeSlots = useMemo(() => {
    if (!selectedDay) return [];

    const dayOfWeek = getDay(selectedDay);
    const dayName = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][dayOfWeek] as keyof typeof settings.schedule.days;
    const daySchedule = settings.schedule.days[dayName];

    if (!daySchedule.enabled) return [];

    const slots = [];
    const { slotDuration } = settings.schedule;
    const serviceDuration = parseInt(service.duration.split(' ')[0], 10);

    let currentTime = parse(daySchedule.startTime, 'HH:mm', selectedDay);
    const endTime = parse(daySchedule.endTime, 'HH:mm', selectedDay);
    const breakStartTime = daySchedule.breakStartTime ? parse(daySchedule.breakStartTime, 'HH:mm', selectedDay) : null;
    const breakEndTime = daySchedule.breakEndTime ? parse(daySchedule.breakEndTime, 'HH:mm', selectedDay) : null;

    while (isBefore(addMinutes(currentTime, serviceDuration), endTime) || isEqual(addMinutes(currentTime, serviceDuration), endTime)) {
      const slotEnd = addMinutes(currentTime, serviceDuration);
      
      let isAvailable = true;

      // Check for break time
      if (breakStartTime && breakEndTime) {
        if (
          (isBefore(currentTime, breakEndTime) && isBefore(breakStartTime, slotEnd)) ||
          (isEqual(currentTime, breakStartTime))
        ) {
          isAvailable = false;
        }
      }

      // Check for existing appointments
      for (const appt of appointments) {
        if (appt.status === 'cancelled') continue;
        const apptDate = parse(appt.date, 'yyyy-MM-dd', new Date());
        if (isEqual(apptDate, selectedDay)) {
          const apptStart = parse(appt.time, 'HH:mm', selectedDay);
          const apptService = mockServices.find(s => s.id === appt.serviceId);
          const apptDuration = apptService ? parseInt(apptService.duration.split(' ')[0], 10) : slotDuration;
          const apptEnd = addMinutes(apptStart, apptDuration);

          if (
            (isBefore(currentTime, apptEnd) && isBefore(apptStart, slotEnd)) ||
            (isEqual(currentTime, apptStart))
          ) {
            isAvailable = false;
            break;
          }
        }
      }
      
      // Check if slot is in the past
      if (isBefore(currentTime, new Date())) {
        isAvailable = false;
      }

      if (isAvailable) {
        slots.push(format(currentTime, 'HH:mm'));
      }

      currentTime = addMinutes(currentTime, slotDuration);
    }

    return slots;
  }, [selectedDay, appointments, settings, service]);

  const handleDayClick = (day: Date) => {
    setSelectedDay(day);
    setSelectedTime(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDay || !selectedTime || !customerDetails.name || !customerDetails.email) {
      alert('Por favor, preencha todos os campos e selecione um horário.');
      return;
    }
    onCreateAppointment({
      serviceId: service.id,
      serviceName: service.name,
      customerName: customerDetails.name,
      customerEmail: customerDetails.email,
      customerPhone: customerDetails.phone,
      date: format(selectedDay, 'yyyy-MM-dd'),
      time: selectedTime,
    });
  };

  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const disabledDays = Object.entries(settings.schedule.days)
    .filter(([, schedule]) => !schedule.enabled)
    .map(([day]) => dayNames.indexOf(day));

  return (
    <div className="min-h-screen bg-black py-20">
      <style>{`
        .rdp { --rdp-cell-size: 45px; --rdp-accent-color: #ef4444; --rdp-background-color: #dc2626; }
        .rdp-months { background: #1f2937; border-radius: 0.5rem; padding: 1rem; border: 1px solid #374151; }
        .rdp-caption_label, .rdp-nav_button, .rdp-head_cell { color: #fff; }
        .rdp-day { color: #d1d5db; }
        .rdp-day_today { font-weight: bold; color: #ef4444; }
        .rdp-day_selected { background-color: #ef4444 !important; color: #fff !important; }
        .rdp-day_disabled { color: #4b5563; }
      `}</style>
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <button onClick={onBack} className="flex items-center space-x-2 text-red-500 hover:text-red-400 mb-8">
            <ArrowLeft size={20} />
            <span>Voltar aos Serviços</span>
          </button>
          <div className="text-center mb-12">
            <h1 className="text-white text-4xl md:text-5xl font-bold mb-4">Agende seu Horário</h1>
            <p className="text-gray-400 text-lg">Serviço: <span className="text-red-500 font-semibold">{service.name}</span></p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Calendar and Time Slots */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h2 className="text-white text-2xl font-bold mb-4 flex items-center"><Calendar className="mr-3 text-red-500"/>1. Selecione a Data</h2>
              <div className="flex justify-center">
                <DayPicker
                  mode="single"
                  selected={selectedDay}
                  onSelect={handleDayClick}
                  locale={ptBR}
                  disabled={[{ before: startOfToday() }, { dayOfWeek: disabledDays }]}
                  showOutsideDays
                  fixedWeeks
                />
              </div>
            </div>
            {selectedDay && (
              <motion.div className="bg-gray-900 rounded-lg p-6 border border-gray-800 mt-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 className="text-white text-2xl font-bold mb-4 flex items-center"><Clock className="mr-3 text-red-500"/>2. Escolha o Horário</h2>
                <p className="text-gray-400 mb-4">Horários disponíveis para {format(selectedDay, 'PPP', { locale: ptBR })}:</p>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {timeSlots.length > 0 ? timeSlots.map(time => (
                    <motion.button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`p-3 rounded-lg text-center font-semibold transition-colors ${selectedTime === time ? 'bg-red-500 text-white' : 'bg-gray-800 text-gray-300 hover:bg-red-500/50'}`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {time}
                    </motion.button>
                  )) : (
                    <p className="text-gray-500 col-span-full">Nenhum horário disponível para esta data.</p>
                  )}
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Customer Form */}
          {selectedDay && selectedTime && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
              <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 sticky top-20">
                <h2 className="text-white text-2xl font-bold mb-4">3. Seus Dados</h2>
                <div className="bg-gray-800 p-4 rounded-lg mb-6">
                  <p className="text-white font-semibold">{service.name}</p>
                  <p className="text-gray-300">{format(selectedDay, 'PPP', { locale: ptBR })} às {selectedTime}</p>
                  <p className="text-red-500 font-bold mt-2">R$ {service.price.toFixed(2)}</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-white text-sm font-medium mb-2 flex items-center"><User size={16} className="mr-2"/>Nome Completo</label>
                    <input type="text" value={customerDetails.name} onChange={(e) => setCustomerDetails({...customerDetails, name: e.target.value})} className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-red-500" required />
                  </div>
                  <div>
                    <label className="block text-white text-sm font-medium mb-2 flex items-center"><Mail size={16} className="mr-2"/>E-mail</label>
                    <input type="email" value={customerDetails.email} onChange={(e) => setCustomerDetails({...customerDetails, email: e.target.value})} className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-red-500" required />
                  </div>
                  <div>
                    <label className="block text-white text-sm font-medium mb-2 flex items-center"><Phone size={16} className="mr-2"/>Telefone (WhatsApp)</label>
                    <input type="tel" value={customerDetails.phone} onChange={(e) => setCustomerDetails({...customerDetails, phone: e.target.value})} className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-red-500" />
                  </div>
                  <motion.button type="submit" className="w-full bg-red-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-600 transition-colors flex items-center justify-center space-x-2" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Send size={20} />
                    <span>Confirmar Agendamento</span>
                  </motion.button>
                </form>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

// A mock service list to prevent breaking the component if the service is not found
const mockServices: Service[] = [
  {
    id: '1',
    name: 'Lavagem Completa',
    shortDescription: 'Lavagem externa e interna completa',
    description: 'Serviço completo de lavagem externa e interna do veículo, incluindo aspiração, limpeza dos tapetes, painel e vidros.',
    price: 35.00,
    duration: '60 min',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=300&fit=crop',
    category: 'Lavagem',
    featured: true
  },
  {
    id: '2',
    name: 'Enceramento Premium',
    shortDescription: 'Enceramento de alta qualidade',
    description: 'Enceramento premium com cera importada, proporcionando proteção duradoura e brilho excepcional à pintura.',
    price: 80.00,
    duration: '90 min',
    image: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=500&h=300&fit=crop',
    category: 'Enceramento',
    featured: true
  },
];

export default SchedulingPage;
