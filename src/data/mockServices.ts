import { faker } from '@faker-js/faker';
import { Service } from '../types';

export const mockServices: Service[] = [
  {
    id: '1',
    name: 'Lavagem Completa',
    shortDescription: 'Lavagem externa e interna completa',
    description: 'Serviço completo de lavagem externa e interna do veículo, incluindo aspiração, limpeza dos tapetes, painel e vidros.',
    price: 35.00,
    duration: '45 min',
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
  {
    id: '3',
    name: 'Detalhamento Completo',
    shortDescription: 'Detalhamento interno e externo',
    description: 'Serviço completo de detalhamento automotivo incluindo polimento, enceramento, limpeza profunda dos bancos e tratamento de couro.',
    price: 250.00,
    duration: '4 horas',
    image: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=500&h=300&fit=crop',
    category: 'Detalhamento',
    featured: true
  },
  {
    id: '4',
    name: 'Lavagem Simples',
    shortDescription: 'Lavagem externa básica',
    description: 'Lavagem externa básica do veículo com secagem e limpeza dos vidros.',
    price: 20.00,
    duration: '30 min',
    image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=500&h=300&fit=crop',
    category: 'Lavagem'
  },
  {
    id: '5',
    name: 'Cera Carnaúba',
    shortDescription: 'Enceramento com cera natural',
    description: 'Aplicação de cera de carnaúba natural, proporcionando proteção e brilho natural à pintura do veículo.',
    price: 60.00,
    duration: '60 min',
    image: 'https://images.unsplash.com/photo-1562141961-d607a25f2152?w=500&h=300&fit=crop',
    category: 'Enceramento'
  },
  {
    id: '6',
    name: 'Polimento Técnico',
    shortDescription: 'Remoção de riscos e marcas',
    description: 'Polimento técnico para remoção de micro riscos, marcas de água e oxidação leve da pintura.',
    price: 150.00,
    duration: '2 horas',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=500&h=300&fit=crop',
    category: 'Polimento'
  }
];
