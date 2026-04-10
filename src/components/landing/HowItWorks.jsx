import React from 'react';
import { motion } from 'framer-motion';
import { Upload, Cpu, CheckCircle, Download } from 'lucide-react';

const steps = [
  {
    icon: Upload,
    step: '01',
    title: 'Envía la dirección',
    description: 'Realiza una llamada a nuestra API con la dirección que deseas validar.'
  },
  {
    icon: Cpu,
    step: '02',
    title: 'Procesamiento inteligente',
    description: 'Nuestros algoritmos analizan, normalizan y validan la información.'
  },
  {
    icon: CheckCircle,
    step: '03',
    title: 'Validación completa',
    description: 'Verificamos contra múltiples fuentes para garantizar precisión.'
  },
  {
    icon: Download,
    step: '04',
    title: 'Recibe los resultados',
    description: 'Obtén datos enriquecidos con coordenadas, códigos postales y más.'
  }
];

export default function HowItWorks() {
  return (
    <section id="como-funciona" className="py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-blue-500 font-semibold text-sm uppercase tracking-wider">
            Cómo funciona
          </span>
          <h2 className="mt-4 text-3xl md:text-4xl font-bold text-slate-900">
            Integración simple en 4 pasos
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Empieza a validar direcciones en minutos con nuestra API REST.
          </p>
        </motion.div>

        <div className="relative">
          {/* Connection line */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-100 via-blue-200 to-blue-100" />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="relative text-center"
              >
                <div className="relative inline-flex mb-6">
                  <div className="w-16 h-16 bg-white rounded-2xl shadow-lg shadow-slate-100 border border-slate-100 flex items-center justify-center relative z-10">
                    <step.icon className="w-7 h-7 text-blue-500" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-7 h-7 bg-blue-500 text-white text-xs font-bold rounded-full flex items-center justify-center z-20">
                    {step.step}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Code example */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16 max-w-3xl mx-auto"
        >
          <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-2xl">
            <div className="px-4 py-3 bg-slate-800 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
              <span className="ml-4 text-slate-400 text-sm">request.js</span>
            </div>
            <div className="p-6 overflow-x-auto">
              <pre className="text-sm leading-relaxed">
                <code>
                  <span className="text-purple-400">const</span>
                  <span className="text-slate-300"> response </span>
                  <span className="text-blue-400">= await</span>
                  <span className="text-slate-300"> fetch(</span>
                  <span className="text-green-400">'https://api.oxigeno.com/validate'</span>
                  <span className="text-slate-300">, {'{'}</span>
                  {'\n'}
                  <span className="text-slate-300">{'  '}method: </span>
                  <span className="text-green-400">'POST'</span>
                  <span className="text-slate-300">,</span>
                  {'\n'}
                  <span className="text-slate-300">{'  '}body: JSON.stringify({'{'}</span>
                  {'\n'}
                  <span className="text-slate-300">{'    '}address: </span>
                  <span className="text-green-400">'Av. Corrientes 1234, CABA'</span>
                  {'\n'}
                  <span className="text-slate-300">{'  '}{'}'});</span>
                  {'\n'}
                  <span className="text-slate-300">{'}'});</span>
                </code>
              </pre>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}