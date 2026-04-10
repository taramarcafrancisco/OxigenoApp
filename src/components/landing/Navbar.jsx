import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  
  const navLinks = [
    { name: 'Inicio', href: createPageUrl('Landing') },
    { name: 'Producto', href: createPageUrl('Landing') + '#producto' },
    { name: 'Cómo funciona', href: createPageUrl('Landing') + '#como-funciona' },
    { name: 'Planes', href: createPageUrl('Landing') + '#planes' },
    { name: 'Contacto', href: createPageUrl('Landing') + '#contacto' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/90 backdrop-blur-lg border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={createPageUrl('Landing')} className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-sky-400 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">U</span>
            </div>
            <span className="text-xl font-semibold text-white">oxigeno</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm text-slate-300 hover:text-white transition-colors font-medium"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link to={createPageUrl('Dashboard')}>
              <Button
                variant="ghost"
                className="text-slate-300 hover:text-white hover:bg-slate-800"
              >
                Ingresar
              </Button>
            </Link>
            <Link to={createPageUrl('Dashboard')}>
              <Button className="bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/25">
                Probar demo
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-slate-300"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-slate-900 border-b border-slate-800"
          >
            <div className="px-4 py-4 space-y-3">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="block py-2 text-slate-300 hover:text-white font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </a>
              ))}

              <div className="pt-4 flex flex-col gap-2">
                <Link to={createPageUrl('Dashboard')}>
                  <Button
                    variant="outline"
                    className="w-full border-slate-700 text-white bg-transparent hover:bg-slate-800"
                  >
                    Ingresar
                  </Button>
                </Link>
                <Link to={createPageUrl('Dashboard')}>
                  <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                    Probar demo
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}