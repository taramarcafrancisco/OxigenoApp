import React from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Zap, 
  Shield, 
  BarChart3, 
  Globe2, 
  RefreshCcw 
} from 'lucide-react';

const features = [
  {
    icon: MapPin,
    title: 'Validación precisa',
    description: 'Verifica direcciones postales contra bases de datos oficiales actualizadas.',
    color: 'blue'
  },
  {
    icon: Zap,
    title: 'Respuesta instantánea',
    description: 'API de alta velocidad con tiempos de respuesta menores a 100ms.',
    color: 'yellow'
  },
  {
    icon: Shield,
    title: 'Datos seguros',
    description: 'Encriptación de extremo a extremo y cumplimiento con normativas de privacidad.',
    color: 'green'
  },
  {
    icon: BarChart3,
    title: 'Analíticas detalladas',
    description: 'Dashboard con métricas de uso, tasas de éxito y tendencias.',
    color: 'purple'
  },
  {
    icon: Globe2,
    title: 'Cobertura nacional',
    description: 'Base de datos completa con todas las direcciones del territorio.',
    color: 'sky'
  },
  {
    icon: RefreshCcw,
    title: 'Actualización constante',
    description: 'Datos sincronizados diariamente con fuentes oficiales.',
    color: 'orange'
  }
];

const colorClasses = {
  blue: 'bg-blue-50 text-blue-500',
  yellow: 'bg-yellow-50 text-yellow-500',
  green: 'bg-green-50 text-green-500',
  purple: 'bg-purple-50 text-purple-500',
  sky: 'bg-sky-50 text-sky-500',
  orange: 'bg-orange-50 text-orange-500'
};

export default function Features() {
  return (
    <section id="producto" className="py-20 md:py-32 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-blue-500 font-semibold text-sm uppercase tracking-wider">
            Producto
          </span>
          <h2 className="mt-4 text-3xl md:text-4xl font-bold text-slate-900">
            Todo lo que necesitas para gestionar ubicaciones
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Una plataforma completa para validar, normalizar y enriquecer tus datos de direcciones.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 border border-slate-100 hover:shadow-lg hover:shadow-slate-100 transition-all duration-300 group"
            >
              <div className={`w-12 h-12 rounded-xl ${colorClasses[feature.color]} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}