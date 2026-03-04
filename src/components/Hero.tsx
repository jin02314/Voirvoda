import { ArrowDown } from 'lucide-react';
import { motion } from 'motion/react';

export function Hero() {
  const scrollToAbout = () => {
    const element = document.getElementById('about');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1716845940242-22a735e08efd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGdlb21ldHJpYyUyMGRhcmt8ZW58MXx8fHwxNzY5ODY3NjY5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt=""
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/70 to-black" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="mb-6">
            <span className="block text-sm uppercase tracking-widest text-gray-400 mb-2">
              Creative Developer
            </span>
            <span className="block text-5xl md:text-7xl lg:text-8xl">
              Crafting Digital
            </span>
            <span className="block text-5xl md:text-7xl lg:text-8xl mt-2">
              Experiences
            </span>
          </h1>
          <motion.p
            className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Designing and developing innovative solutions that blend aesthetics with functionality
          </motion.p>
        </motion.div>

        <motion.button
          onClick={scrollToAbout}
          className="inline-flex items-center gap-2 text-sm uppercase tracking-widest hover:text-gray-300 transition-colors group"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          aria-label="Scroll to about section"
        >
          Explore
          <ArrowDown size={20} className="group-hover:translate-y-1 transition-transform" />
        </motion.button>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </section>
  );
}
