import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Check, Sparkles } from 'lucide-react';

const plans = [
  {
    name: 'Starter',
    description: 'Ideal para empezar a probar',
    price: 0,
    period: 'gratis',
    queries: '100 consultas/mes',
    features: [
      'API REST',
      'Dashboard básico',
      'Soporte por email',
      '1 usuario'
    ],
    cta: 'Comenzar gratis',
    popular: false
  },
  {
    name: 'Professional',
    description: 'Para equipos en crecimiento',
    price: 49,
    period: '/mes',
    queries: '5,000 consultas/mes',
    features: [
      'Todo de Starter',
      'Analíticas avanzadas',
      'Exportación de datos',
      'Webhooks',
      '5 usuarios',
      'Soporte prioritario'
    ],
    cta: 'Comenzar prueba',
    popular: true
  },
  {
    name: 'Enterprise',
    description: 'Soluciones a medida',
    price: 199,
    period: '/mes',
    queries: '50,000+ consultas/mes',
    features: [
      'Todo de Professional',
      'API dedicada',
      'SLA garantizado',
      'Usuarios ilimitados',
      'Account manager',
      'Integración personalizada'
    ],
    cta: 'Contactar ventas',
    popular: false
  }
];

export default function Pricing() {
  return (
    <section id="planes" className="py-20 md:py-32 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-blue-500 font-semibold text-sm uppercase tracking-wider">
            Planes
          </span>
          <h2 className="mt-4 text-3xl md:text-4xl font-bold text-slate-900">
            Precios simples y transparentes
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Elige el plan que mejor se adapte a tus necesidades. Sin costos ocultos.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative bg-white rounded-2xl p-6 border ${
                plan.popular 
                  ? 'border-blue-200 shadow-xl shadow-blue-100/50' 
                  : 'border-slate-100 hover:shadow-lg hover:shadow-slate-100'
              } transition-all duration-300`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-500 text-white text-xs font-medium rounded-full">
                    <Sparkles className="w-3 h-3" />
                    Más popular
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-slate-900">{plan.name}</h3>
                <p className="text-sm text-slate-500 mt-1">{plan.description}</p>
              </div>

              <div className="text-center mb-6">
                <div className="flex items-end justify-center gap-1">
                  <span className="text-4xl font-bold text-slate-900">
                    ${plan.price}
                  </span>
                  <span className="text-slate-500 mb-1">{plan.period}</span>
                </div>
                <p className="text-sm text-blue-500 font-medium mt-2">{plan.queries}</p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm text-slate-600">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link to={createPageUrl('Dashboard')}>
                <Button 
                  className={`w-full ${
                    plan.popular 
                      ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/25' 
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {plan.cta}
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}