import React from 'react';
import { motion } from 'framer-motion';

// Animation variants for smooth reveals
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export const About = () => {
  return (
    <div className="min-h-screen pt-24 pb-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* --- Hero Section --- */}
        <motion.div 
          className="text-center mb-20"
          initial="initial"
          animate="animate"
          variants={fadeInUp}
        >
          {/* Company Logo Placeholder */}
          <motion.div 
            className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-primary-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/20"
            whileHover={{ rotate: 10, scale: 1.05 }}
          >
            <span className="text-4xl">🚀</span>
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-display font-bold mb-6">
            About <span className="gradient-text">Code Fusion</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            We are a forward-thinking software house dedicated to bridging the gap between complex scientific theory and accessible, interactive digital experiences.
          </p>
        </motion.div>

        {/* --- Team Section --- */}
        <motion.section 
          className="mb-24"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.div className="text-center mb-12" variants={fadeInUp}>
            <h2 className="text-3xl font-display font-bold mb-4 text-gray-900 dark:text-white">Meet the Minds</h2>
            <p className="text-gray-500 dark:text-gray-400">The engineers and physicists behind Virtual Quantum Lab.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((item) => (
              <motion.div
                key={item}
                variants={fadeInUp}
                className="glass rounded-xl overflow-hidden group"
                whileHover={{ y: -10 }}
              >
                {/* Placeholder Image */}
                <div className="h-48 bg-gray-200 dark:bg-dark-700 relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-500">
                    <span className="text-4xl">👤</span>
                  </div>
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-primary-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Team Member {item}</h3>
                  <p className="text-primary-600 dark:text-primary-400 text-sm mb-4 font-medium">Software Engineer</p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                    Passionate about quantum computing and interactive visualizations.
                  </p>
                  
                  {/* Social Placeholders */}
                  <div className="flex space-x-3">
                    {['tw', 'li', 'gh'].map((social) => (
                      <div key={social} className="w-8 h-8 rounded-full bg-gray-100 dark:bg-dark-700 flex items-center justify-center text-gray-500 hover:bg-primary-100 hover:text-primary-600 dark:hover:bg-primary-900/30 dark:hover:text-primary-400 transition-colors cursor-pointer">
                        <span className="text-xs">•</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* --- Contact Section --- */}
        <motion.section 
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="glass rounded-2xl p-8 md:p-12 relative overflow-hidden">
            {/* Decorative background element */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />

            <div className="text-center mb-10">
              <h2 className="text-3xl font-display font-bold mb-4 text-gray-900 dark:text-white">Get in Touch</h2>
              <p className="text-gray-600 dark:text-gray-300">
                Have questions about our simulations or want to collaborate? We'd love to hear from you.
              </p>
            </div>

            <form className="space-y-6 relative z-10" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Name</label>
                  <input 
                    type="text" 
                    placeholder="John Doe"
                    className="w-full px-4 py-3 rounded-lg bg-white/50 dark:bg-dark-800/50 border border-gray-200 dark:border-dark-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                  <input 
                    type="email" 
                    placeholder="john@example.com"
                    className="w-full px-4 py-3 rounded-lg bg-white/50 dark:bg-dark-800/50 border border-gray-200 dark:border-dark-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Message</label>
                <textarea 
                  rows="4" 
                  placeholder="Tell us about your project..."
                  className="w-full px-4 py-3 rounded-lg bg-white/50 dark:bg-dark-800/50 border border-gray-200 dark:border-dark-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all resize-none"
                ></textarea>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-lg font-bold text-lg shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 transition-all"
              >
                Send Message
              </motion.button>
            </form>
          </div>
        </motion.section>

      </div>
    </div>
  );
};

