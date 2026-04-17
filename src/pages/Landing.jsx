import React, { useState, useRef } from 'react';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card } from "../components/ui/card";
import { motion } from 'framer-motion';
import AnimatedBackground from '../components/landing/AnimatedBackground';

import {
  Dumbbell,
  Activity,
  Users,
  ShieldCheck,
  Mail,
  Phone,
  MapPin,
  ChevronDown,
  CalendarClock,
  BadgeCheck
} from 'lucide-react';
import { createPageUrl } from "../utils";
import { useAuth } from "../lib/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const featuresRef = useRef(null);
  const contactRef = useRef(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  const [isLogging, setIsLogging] = useState(false);
  const [loginError, setLoginError] = useState(null);
  const [shake, setShake] = useState(false);

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 450);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError(null);

    if (!email || !password) {
      setLoginError("Completá usuario y contraseña");
      triggerShake();
      return;
    }

    setIsLogging(true);

    try {
      const res = await login(email, password);
      const loggedUser = res?.user ?? res?.data?.user ?? res;

      if (!loggedUser) {
        setLoginError("No se recibió el usuario desde el login");
        triggerShake();
        return;
      }

      if (loggedUser?.estado === 0) {
        setLoginError("Usuario deshabilitado");
        triggerShake();
        return;
      }

      navigate(createPageUrl("Dashboard"));
    } catch (err) {
      console.error("Login error:", err);
      setLoginError(err?.message || "Usuario o contraseña incorrectos");
      triggerShake();
    } finally {
      setIsLogging(false);
    }
  };

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToContact = () => {
    contactRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const features = [
    {
      icon: Users,
      title: 'Gestión de Socios',
      description: 'Administra altas, bajas, vencimientos, planes y estado de cuenta de cada alumno.'
    },
    {
      icon: CalendarClock,
      title: 'Clases y Turnos',
      description: 'Organiza clases grupales, reservas, cupos y asistencia desde una sola plataforma.'
    },
    {
      icon: ShieldCheck,
      title: 'Control de Acceso',
      description: 'Valida ingresos y mejora el seguimiento de asistencia en tiempo real.'
    },
    {
      icon: Activity,
      title: 'Seguimiento Fitness',
      description: 'Centraliza rutinas, evolución, objetivos y atención personalizada de tus clientes.'
    }
  ];

  const steps = [
    {
      number: '01',
      title: 'Registrá tus socios',
      description: 'Cargá alumnos, planes, vencimientos y datos de contacto en pocos pasos.'
    },
    {
      number: '02',
      title: 'Administrá el gimnasio',
      description: 'Controlá pagos, accesos, clases, cupos y comunicación desde un solo lugar.'
    },
    {
      number: '03',
      title: 'Mejorá la experiencia',
      description: 'Brindá una gestión más ágil, profesional y enfocada en el crecimiento de tu gimnasio.'
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section
        className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center px-4 py-6 lg:py-4 relative overflow-hidden"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0, 0, 0, 0.72), rgba(0, 0, 0, 0.72)), url('https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2000&auto=format&fit=crop')",
        }}
      >
        <AnimatedBackground />

        <div className="w-full max-w-7xl grid lg:grid-cols-2 gap-10 lg:gap-12 items-center relative z-10">
          {/* Left side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-lime-500/10 border border-lime-400/20 text-lime-300 text-xs md:text-sm font-medium">
              <Dumbbell className="w-3.5 h-3.5 md:w-4 md:h-4" />
              Software de gestión para gimnasios
            </div>

            <h1 className="max-w-3xl text-3xl md:text-[2.85rem] lg:text-[3.35rem] font-extrabold leading-[0.98] tracking-tight">
              Potenciá tu
              <span className="block bg-gradient-to-r from-lime-400 via-emerald-400 to-orange-400 bg-clip-text text-transparent">
                gimnasio con una gestión más inteligente
              </span>
            </h1>

            <p className="max-w-xl text-base md:text-lg text-zinc-300 leading-relaxed">
              Controlá socios, cuotas, accesos, clases y seguimiento deportivo
              desde una plataforma moderna, rápida y pensada para negocios fitness.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button
                onClick={scrollToFeatures}
                className="bg-lime-500 hover:bg-lime-400 text-black px-7 py-5 text-base md:text-lg font-semibold shadow-lg rounded-2xl"
              >
                Ver funcionalidades
              </Button>

              <Button
                onClick={scrollToContact}
                variant="outline"
                className="px-7 py-5 text-base md:text-lg border-white/20 bg-white/5 hover:bg-white/10 rounded-2xl text-white"
              >
                Pedir asesoramiento
              </Button>
            </div>

            <button
              type="button"
              onClick={scrollToContact}
              className="group inline-flex max-w-md items-center gap-3 rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-left backdrop-blur-sm transition-all hover:border-lime-400/30 hover:bg-white/5"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-lime-400 to-orange-500 text-sm font-extrabold text-black">
                15'
              </span>
              <span>
                <span className="block text-sm font-semibold text-white">
                  Solicitar demo personalizada
                </span>
                <span className="block text-sm text-zinc-400 group-hover:text-zinc-300">
                  Coordinamos una muestra breve del sistema con tu flujo real.
                </span>
              </span>
            </button>
          </motion.div>

          {/* Right side - Login */}
          <motion.div
            animate={shake ? { x: [-10, 10, -8, 8, -4, 4, 0] } : { x: 0 }}
            transition={{ duration: 0.45 }}
            className="flex justify-center lg:justify-end lg:-mt-20"
          >
            <Card className="w-full max-w-sm bg-zinc-950/85 backdrop-blur-xl p-8 space-y-6 shadow-2xl border border-white/10 rounded-3xl">
              <div className="text-center space-y-2.5">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="mx-auto mb-3 w-16 h-16 rounded-2xl bg-gradient-to-br from-lime-400 to-orange-500 flex items-center justify-center shadow-lg"
                >
                  <Dumbbell className="w-8 h-8 text-black" />
                </motion.div>

                <h2 className="text-2xl font-bold text-white">
                  Iniciar Sesión
                </h2>

                <p className="text-zinc-400 text-sm">
                  Accedé al panel de administración de tu gimnasio
                </p>
              </div>

              <form className="space-y-4" onSubmit={handleLogin}>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                    Usuario
                  </label>
                  <Input
                    type="text"
                    placeholder="usuario@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11 text-sm bg-zinc-900 border-zinc-800 text-white rounded-xl transition-all focus:ring-2 focus:ring-lime-500/30 focus:border-lime-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                    Contraseña
                  </label>
                  <Input
                    type="password"
                    placeholder="••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11 text-sm bg-zinc-900 border-zinc-800 text-white rounded-xl transition-all focus:ring-2 focus:ring-lime-500/30 focus:border-lime-500"
                  />
                </div>

                {loginError && (
                  <div className="text-sm text-red-300 bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                    {loginError}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isLogging}
                  className="w-full h-11 text-sm bg-gradient-to-r from-lime-400 to-orange-500 hover:from-lime-300 hover:to-orange-400 text-black font-bold transition-all rounded-xl mt-4"
                >
                  {isLogging ? "Ingresando..." : "Acceder"}
                </Button>

                <div className="text-center pt-2">
                  <a
                    href="#"
                    className="text-xs text-zinc-400 hover:text-lime-400 transition-colors font-medium"
                  >
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>
              </form>
            </Card>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer"
          onClick={scrollToFeatures}
        >
          <ChevronDown className="w-8 h-8 text-white" />
        </motion.div>
      </section>

      {/* Features */}
      <section ref={featuresRef} className="py-24 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Todo lo que tu gimnasio necesita
            </h2>
            <p className="text-xl text-zinc-400">
              Una plataforma diseñada para optimizar la operación diaria y mejorar la experiencia del socio
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.08 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
              >
                <Card className="p-6 h-full bg-zinc-900 border border-zinc-800 hover:border-lime-400/30 hover:shadow-2xl hover:shadow-lime-500/10 transition-all rounded-2xl">
                  <div className="w-14 h-14 bg-gradient-to-br from-lime-400 to-orange-500 rounded-2xl flex items-center justify-center mb-4">
                    <feature.icon className="w-7 h-7 text-black" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-zinc-400">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-black">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              ¿Cómo funciona?
            </h2>
            <p className="text-xl text-zinc-400">
              Implementación simple, operación rápida y control total
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="relative"
              >
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-lime-400 to-orange-500 rounded-full mb-6 text-black text-2xl font-extrabold shadow-lg">
                    {step.number}
                  </div>
                  <h3 className="text-2xl font-semibold text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="text-zinc-400 text-lg">
                    {step.description}
                  </p>
                </div>

                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-lime-400 to-orange-500 -z-10" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats / trust section */}
      <section className="py-20 bg-zinc-950 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <Card className="bg-zinc-900 border-zinc-800 p-8 rounded-2xl">
              <div className="text-4xl font-extrabold text-lime-400 mb-2">+1000</div>
              <p className="text-zinc-400">socios administrados</p>
            </Card>
            <Card className="bg-zinc-900 border-zinc-800 p-8 rounded-2xl">
              <div className="text-4xl font-extrabold text-orange-400 mb-2">24/7</div>
              <p className="text-zinc-400">control y acceso disponible</p>
            </Card>
            <Card className="bg-zinc-900 border-zinc-800 p-8 rounded-2xl">
              <div className="text-4xl font-extrabold text-white mb-2">100%</div>
              <p className="text-zinc-400">enfoque en rendimiento operativo</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section ref={contactRef} className="py-24 bg-black">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Hablemos de tu gimnasio
            </h2>
            <p className="text-xl text-zinc-400">
              Te mostramos cómo digitalizar tu operación y ordenar tu gestión
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 mb-12">
            {/* Contact info */}
            <div className="grid md:grid-cols-1 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <Card className="p-6 bg-zinc-900 border-zinc-800 hover:border-lime-400/30 transition-all rounded-2xl">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-lime-500/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail className="w-7 h-7 text-lime-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">Email</h3>
                      <p className="text-zinc-400">contacto@fitmanager.com</p>
                    </div>
                  </div>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <Card className="p-6 bg-zinc-900 border-zinc-800 hover:border-orange-400/30 transition-all rounded-2xl">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-orange-500/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone className="w-7 h-7 text-orange-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">Teléfono</h3>
                      <p className="text-zinc-400">+54 9 11 1234-5678</p>
                    </div>
                  </div>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card className="p-6 bg-zinc-900 border-zinc-800 hover:border-white/20 transition-all rounded-2xl">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-white/5 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">Ubicación</h3>
                      <p className="text-zinc-400">Argentina</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="p-8 bg-zinc-900 border-zinc-800 hover:shadow-xl transition-all rounded-3xl">
                <h3 className="text-2xl font-bold text-white mb-2">Solicitá una demo</h3>
                <p className="text-zinc-400 mb-6">
                  Coordinemos una presentación para mostrarte el sistema en acción.
                </p>

                <form className="space-y-5">
                  <div>
                    <label className="text-sm font-medium text-zinc-300 mb-2 block">
                      Nombre completo
                    </label>
                    <Input
                      type="text"
                      placeholder="Juan Pérez"
                      className="h-11 bg-zinc-950 border-zinc-800 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-zinc-300 mb-2 block">
                      Email
                    </label>
                    <Input
                      type="email"
                      placeholder="juan@gym.com"
                      className="h-11 bg-zinc-950 border-zinc-800 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-zinc-300 mb-2 block">
                      Teléfono
                    </label>
                    <Input
                      type="tel"
                      placeholder="+54 9 11 1234-5678"
                      className="h-11 bg-zinc-950 border-zinc-800 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-zinc-300 mb-2 block">
                      Mensaje
                    </label>
                    <textarea
                      rows="4"
                      placeholder="Contanos cuántos socios manejás, si tenés varias sedes o qué necesitás resolver..."
                      className="w-full px-3 py-2 border border-zinc-800 bg-zinc-950 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-lime-500 resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-11 bg-gradient-to-r from-lime-400 to-orange-500 hover:from-lime-300 hover:to-orange-400 text-black font-bold"
                  >
                    Enviar solicitud
                  </Button>
                </form>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-zinc-950 text-white py-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-lime-400 to-orange-500 flex items-center justify-center">
                  <Dumbbell className="w-6 h-6 text-black" />
                </div>
                <span className="text-2xl font-bold">FitManager</span>
              </div>
              <p className="text-zinc-400">
                Plataforma integral para la administración moderna de gimnasios y centros deportivos.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-lg mb-4">Plataforma</h4>
              <ul className="space-y-2 text-zinc-400">
                <li><a href="#" className="hover:text-lime-400 transition-colors">Funciones</a></li>
                <li><a href="#" className="hover:text-lime-400 transition-colors">Planes</a></li>
                <li><a href="#" className="hover:text-lime-400 transition-colors">Accesos</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-lg mb-4">Soluciones</h4>
              <ul className="space-y-2 text-zinc-400">
                <li><a href="#" className="hover:text-lime-400 transition-colors">Socios</a></li>
                <li><a href="#" className="hover:text-lime-400 transition-colors">Clases</a></li>
                <li><a href="#" className="hover:text-lime-400 transition-colors">Rutinas</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-lg mb-4">Confianza</h4>
              <ul className="space-y-2 text-zinc-400">
                <li><a href="#" className="hover:text-lime-400 transition-colors">Privacidad</a></li>
                <li><a href="#" className="hover:text-lime-400 transition-colors">Términos</a></li>
                <li><a href="#" className="hover:text-lime-400 transition-colors">Soporte</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-zinc-800 pt-8 text-center text-zinc-500">
            <p>&copy; 2026 FitManager. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
