import React, { useState } from 'react';
import { Menu, X, User, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  user: { email: string; role: string } | null;
  onLogin: () => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentPage, onNavigate, user, onLogin, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { id: 'home', label: 'Home' },
    { id: 'services', label: 'Serviços' },
    { id: 'about', label: 'Sobre' },
    { id: 'contact', label: 'Contato' }
  ];

  return (
    <header className="bg-black border-b border-gray-800 relative z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <motion.div 
            className="flex items-center cursor-pointer"
            onClick={() => onNavigate('home')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <img 
              src="https://www.dropbox.com/scl/fi/tqmzx0smafj2ssd7ee08m/1000677808-removebg-preview.png?rlkey=pywnxysxyf8fvq6hb395he0zh&st=82jio2c3&dl=1"
              alt="Logo AlfenasCar"
              className="h-16"
            />
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`text-white hover:text-red-500 transition-colors font-medium ${
                  currentPage === item.id ? 'text-red-500' : ''
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {item.label}
              </motion.button>
            ))}
            
            {/* User Menu */}
            {user ? (
              <div className="flex items-center space-x-4">
                {user.role === 'admin' && (
                  <motion.button
                    onClick={() => onNavigate('admin')}
                    className="text-white hover:text-red-500 transition-colors font-medium"
                    whileHover={{ scale: 1.1 }}
                  >
                    Admin
                  </motion.button>
                )}
                <motion.button
                  onClick={onLogout}
                  className="flex items-center space-x-2 text-white hover:text-red-500 transition-colors"
                  whileHover={{ scale: 1.1 }}
                >
                  <LogOut size={18} />
                  <span>Sair</span>
                </motion.button>
              </div>
            ) : (
              <motion.button
                onClick={onLogin}
                className="flex items-center space-x-2 text-white hover:text-red-500 transition-colors"
                whileHover={{ scale: 1.1 }}
              >
                <User size={18} />
                <span>Login</span>
              </motion.button>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            whileTap={{ scale: 0.95 }}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-gray-900 rounded-lg mt-2 overflow-hidden"
            >
              <div className="p-4 space-y-4">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      onNavigate(item.id);
                      setIsMenuOpen(false);
                    }}
                    className={`block w-full text-left text-white hover:text-red-500 transition-colors py-2 ${
                      currentPage === item.id ? 'text-red-500' : ''
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
                
                {user ? (
                  <div className="space-y-2 pt-2 border-t border-gray-700">
                    {user.role === 'admin' && (
                      <button
                        onClick={() => {
                          onNavigate('admin');
                          setIsMenuOpen(false);
                        }}
                        className="block w-full text-left text-white hover:text-red-500 transition-colors py-2"
                      >
                        Admin
                      </button>
                    )}
                    <button
                      onClick={() => {
                        onLogout();
                        setIsMenuOpen(false);
                      }}
                      className="block w-full text-left text-white hover:text-red-500 transition-colors py-2"
                    >
                      Sair
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      onLogin();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left text-white hover:text-red-500 transition-colors py-2 pt-2 border-t border-gray-700"
                  >
                    Login
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;
