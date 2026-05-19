import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Boxes,
  ChevronDown,
  Hammer,
  Mail,
  MapPin,
  Phone,
  ShoppingCart,
  Truck,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import AnimatedBackground from "../components/landing/AnimatedBackground";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { useAuth } from "../lib/AuthContext";
import { createPageUrl } from "../utils";

export default function Landing() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogging, setIsLogging] = useState(false);
  const [loginError, setLoginError] = useState(null);
  const [shake, setShake] = useState(false);
  const featuresRef = useRef(null);
  const contactRef = useRef(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 450);
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoginError(null);

    if (!email || !password) {
      setLoginError("Completa usuario y contrasena");
      triggerShake();
      return;
    }

    setIsLogging(true);

    try {
      const res = await login(email, password);
      const loggedUser = res?.user ?? res?.data?.user ?? res;

      if (!loggedUser) {
        setLoginError("No se recibio el usuario desde el login");
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
      setLoginError(err?.message || "Usuario o contrasena incorrectos");
      triggerShake();
    } finally {
      setIsLogging(false);
    }
  };

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToContact = () => {
    contactRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const features = [
    {
      icon: Users,
      title: "Gestion de clientes",
      description:
        "Administra compradores, cuentas corrientes, condiciones comerciales y datos de contacto.",
    },
    {
      icon: Boxes,
      title: "Catalogo y stock",
      description:
        "Ordena herramientas, buloneria, pinturas, electricidad y materiales por rubro.",
    },
    {
      icon: ShoppingCart,
      title: "Ventas y pedidos",
      description:
        "Centraliza pedidos, reservas de mercaderia y seguimiento comercial desde un solo panel.",
    },
    {
      icon: Truck,
      title: "Entregas y abastecimiento",
      description:
        "Controla vencimientos, disponibilidad y movimientos clave para la operacion diaria.",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Carga tus clientes",
      description:
        "Registra compradores frecuentes, obras, telefonos, emails y condiciones de venta.",
    },
    {
      number: "02",
      title: "Ordena el catalogo",
      description:
        "Asigna planes comerciales, productos, vencimientos y stock disponible por cuenta.",
    },
    {
      number: "03",
      title: "Vende con mas control",
      description:
        "Consulta informacion rapidamente y mejora la atencion en mostrador, deposito y reparto.",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <section
        className="relative flex min-h-screen items-center justify-center overflow-hidden bg-cover bg-center bg-no-repeat px-4 py-6 lg:py-4"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.72),rgba(0,0,0,0.72)),url('https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=2000&auto=format&fit=crop')",
        }}
      >
        <AnimatedBackground />

        <div className="relative z-10 grid w-full max-w-7xl items-start gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,420px)] lg:gap-6">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-500/10 px-4 py-2 text-xs font-medium text-amber-200 md:text-sm">
              <Hammer className="h-4 w-4" />
              Software de gestion para ferreterias
            </div>

            <h1 className="max-w-3xl text-3xl font-extrabold leading-[0.98] tracking-tight md:text-[2.85rem] lg:text-[3.35rem]">
              FerreManager
              <span className="block bg-gradient-to-r from-amber-300 via-orange-400 to-lime-300 bg-clip-text text-transparent">
                control total para tu ferreteria
              </span>
            </h1>

            <p className="max-w-xl text-base leading-relaxed text-zinc-300 md:text-lg">
              Gestiona clientes, catalogo, stock, condiciones comerciales y
              pedidos desde una plataforma moderna pensada para mostrador,
              deposito y reparto.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button
                onClick={scrollToFeatures}
                className="rounded-2xl bg-amber-400 px-7 py-5 text-base font-semibold text-black shadow-lg hover:bg-amber-300 md:text-lg"
              >
                Ver funcionalidades
              </Button>

              <Button
                onClick={scrollToContact}
                variant="outline"
                className="rounded-2xl border-white/20 bg-white/5 px-7 py-5 text-base text-white hover:bg-white/10 md:text-lg"
              >
                Pedir asesoramiento
              </Button>
            </div>

            <button
              type="button"
              onClick={scrollToContact}
              className="group inline-flex max-w-md items-center gap-3 rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-left backdrop-blur-sm transition-all hover:border-amber-400/30 hover:bg-white/5"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-300 to-orange-500 text-sm font-extrabold text-black">
                15'
              </span>
              <span>
                <span className="block text-sm font-semibold text-white">
                  Solicitar demo personalizada
                </span>
                <span className="block text-sm text-zinc-400 group-hover:text-zinc-300">
                  Revisamos el flujo real de tu ferreteria y tus necesidades.
                </span>
              </span>
            </button>
          </motion.div>

          <motion.div
            animate={shake ? { x: [-10, 10, -8, 8, -4, 4, 0] } : { x: 0 }}
            transition={{ duration: 0.45 }}
            className="flex justify-center lg:justify-end lg:pt-8"
          >
            <Card className="w-full max-w-sm space-y-6 rounded-3xl border border-white/10 bg-zinc-950/85 p-8 shadow-2xl backdrop-blur-xl">
              <div className="space-y-2.5 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-300 to-orange-500 shadow-lg"
                >
                  <Hammer className="h-8 w-8 text-black" />
                </motion.div>

                <h2 className="text-2xl font-bold text-white">Iniciar sesion</h2>
                <p className="text-sm text-zinc-400">
                  Accede al panel de administracion de tu ferreteria
                </p>
              </div>

              <form className="space-y-4" onSubmit={handleLogin}>
                <div className="space-y-2">
                  <label className="text-xs font-medium uppercase tracking-wider text-zinc-400">
                    Usuario
                  </label>
                  <Input
                    type="text"
                    placeholder="usuario@email.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="h-11 rounded-xl border-zinc-800 bg-zinc-900 text-sm text-white focus:border-amber-400 focus:ring-2 focus:ring-amber-500/30"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium uppercase tracking-wider text-zinc-400">
                    Contrasena
                  </label>
                  <Input
                    type="password"
                    placeholder="********"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="h-11 rounded-xl border-zinc-800 bg-zinc-900 text-sm text-white focus:border-amber-400 focus:ring-2 focus:ring-amber-500/30"
                  />
                </div>

                {loginError && (
                  <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">
                    {loginError}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isLogging}
                  className="mt-4 h-11 w-full rounded-xl bg-gradient-to-r from-amber-300 to-orange-500 text-sm font-bold text-black hover:from-amber-200 hover:to-orange-400"
                >
                  {isLogging ? "Ingresando..." : "Acceder"}
                </Button>
              </form>
            </Card>
          </motion.div>
        </div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 cursor-pointer"
          onClick={scrollToFeatures}
        >
          <ChevronDown className="h-8 w-8 text-white" />
        </motion.div>
      </section>

      <section ref={featuresRef} className="bg-zinc-950 py-24">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-white">
              Todo lo que tu ferreteria necesita
            </h2>
            <p className="text-xl text-zinc-400">
              Una plataforma para ordenar la operacion diaria y atender mejor a cada cliente.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.08 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
              >
                <Card className="h-full rounded-2xl border border-zinc-800 bg-zinc-900 p-6 transition-all hover:border-amber-400/30 hover:shadow-2xl hover:shadow-amber-500/10">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-300 to-orange-500">
                    <feature.icon className="h-7 w-7 text-black" />
                  </div>
                  <h3 className="mb-3 text-xl font-semibold text-white">
                    {feature.title}
                  </h3>
                  <p className="text-zinc-400">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-black py-24">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-white">
              Como funciona
            </h2>
            <p className="text-xl text-zinc-400">
              Implementacion simple, operacion rapida y control total.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((step) => (
              <div key={step.number} className="text-center">
                <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-amber-300 to-orange-500 text-2xl font-extrabold text-black shadow-lg">
                  {step.number}
                </div>
                <h3 className="mb-3 text-2xl font-semibold text-white">
                  {step.title}
                </h3>
                <p className="text-lg text-zinc-400">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-white/5 bg-zinc-950 py-20">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 text-center md:grid-cols-3">
          <Card className="rounded-2xl border-zinc-800 bg-zinc-900 p-8">
            <div className="mb-2 text-4xl font-extrabold text-amber-300">+1000</div>
            <p className="text-zinc-400">productos administrados</p>
          </Card>
          <Card className="rounded-2xl border-zinc-800 bg-zinc-900 p-8">
            <div className="mb-2 text-4xl font-extrabold text-orange-400">24/7</div>
            <p className="text-zinc-400">control disponible</p>
          </Card>
          <Card className="rounded-2xl border-zinc-800 bg-zinc-900 p-8">
            <div className="mb-2 text-4xl font-extrabold text-white">100%</div>
            <p className="text-zinc-400">enfoque ferretero</p>
          </Card>
        </div>
      </section>

      <section ref={contactRef} className="bg-black py-24">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-white">
              Hablemos de tu ferreteria
            </h2>
            <p className="text-xl text-zinc-400">
              Te mostramos como digitalizar ventas, stock, clientes y pedidos.
            </p>
          </div>

          <div className="mb-12 grid gap-12 lg:grid-cols-2">
            <div className="grid gap-6">
              <Card className="rounded-2xl border-zinc-800 bg-zinc-900 p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-amber-500/10">
                    <Mail className="h-7 w-7 text-amber-300" />
                  </div>
                  <div>
                    <h3 className="mb-1 text-lg font-semibold text-white">Email</h3>
                    <p className="text-zinc-400">contacto@ferremanager.com</p>
                  </div>
                </div>
              </Card>

              <Card className="rounded-2xl border-zinc-800 bg-zinc-900 p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-orange-500/10">
                    <Phone className="h-7 w-7 text-orange-400" />
                  </div>
                  <div>
                    <h3 className="mb-1 text-lg font-semibold text-white">Telefono</h3>
                    <p className="text-zinc-400">+54 9 11 1234-5678</p>
                  </div>
                </div>
              </Card>

              <Card className="rounded-2xl border-zinc-800 bg-zinc-900 p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/5">
                    <MapPin className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h3 className="mb-1 text-lg font-semibold text-white">Ubicacion</h3>
                    <p className="text-zinc-400">Argentina</p>
                  </div>
                </div>
              </Card>
            </div>

            <Card className="rounded-3xl border-zinc-800 bg-zinc-900 p-8">
              <h3 className="mb-2 text-2xl font-bold text-white">Solicita una demo</h3>
              <p className="mb-6 text-zinc-400">
                Coordinemos una presentacion para mostrarte el sistema en accion.
              </p>

              <form className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-300">
                    Nombre completo
                  </label>
                  <Input
                    type="text"
                    placeholder="Juan Perez"
                    className="h-11 border-zinc-800 bg-zinc-950 text-white"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-300">
                    Email
                  </label>
                  <Input
                    type="email"
                    placeholder="juan@ferreteria.com"
                    className="h-11 border-zinc-800 bg-zinc-950 text-white"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-300">
                    Telefono
                  </label>
                  <Input
                    type="tel"
                    placeholder="+54 9 11 1234-5678"
                    className="h-11 border-zinc-800 bg-zinc-950 text-white"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-300">
                    Mensaje
                  </label>
                  <textarea
                    rows="4"
                    placeholder="Contanos que rubros vendes, cuantos clientes manejas o que queres ordenar primero..."
                    className="w-full resize-none rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-white focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <Button
                  type="submit"
                  className="h-11 w-full bg-gradient-to-r from-amber-300 to-orange-500 font-bold text-black hover:from-amber-200 hover:to-orange-400"
                >
                  Enviar solicitud
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/5 bg-zinc-950 py-12 text-white">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-8 grid gap-8 md:grid-cols-4">
            <div>
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-300 to-orange-500">
                  <Hammer className="h-6 w-6 text-black" />
                </div>
                <span className="text-2xl font-bold">FerreManager</span>
              </div>
              <p className="text-zinc-400">
                Plataforma integral para la administracion moderna de ferreterias y corralones.
              </p>
            </div>

            <div>
              <h4 className="mb-4 text-lg font-semibold">Plataforma</h4>
              <ul className="space-y-2 text-zinc-400">
                <li>Clientes</li>
                <li>Catalogo</li>
                <li>Stock</li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 text-lg font-semibold">Soluciones</h4>
              <ul className="space-y-2 text-zinc-400">
                <li>Ventas</li>
                <li>Pedidos</li>
                <li>Condiciones comerciales</li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 text-lg font-semibold">Confianza</h4>
              <ul className="space-y-2 text-zinc-400">
                <li>Privacidad</li>
                <li>Terminos</li>
                <li>Soporte</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-zinc-800 pt-8 text-center text-zinc-500">
            <p>&copy; 2026 FerreManager. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
