import { motion } from "framer-motion";

export default function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Glow 1 */}
      <motion.div
        className="absolute -top-24 -left-16 h-72 w-72 rounded-full bg-lime-400/12 blur-3xl"
        animate={{
          x: [0, 40, 0],
          y: [0, 30, 0],
          scale: [1, 1.08, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Glow 2 */}
      <motion.div
        className="absolute top-1/3 -right-20 h-80 w-80 rounded-full bg-orange-400/10 blur-3xl"
        animate={{
          x: [0, -35, 0],
          y: [0, 25, 0],
          scale: [1, 1.12, 1],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Glow 3 */}
      <motion.div
        className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-cyan-400/8 blur-3xl"
        animate={{
          x: [0, 20, 0],
          y: [0, -20, 0],
          scale: [1, 1.06, 1],
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/20" />
    </div>
  );
}