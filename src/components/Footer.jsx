import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const SocialIcon = ({ href, path, label }) => (
  <motion.a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    whileHover={{ scale: 1.2, rotate: 5, color: '#0ea5e9' }}
    whileTap={{ scale: 0.9 }}
    className="text-gray-500 hover:text-primary-500 dark:text-gray-400 dark:hover:text-primary-400 transition-colors"
    aria-label={label}
  >
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path fillRule="evenodd" d={path} clipRule="evenodd" />
    </svg>
  </motion.a>
);

const FooterLink = ({ to, children }) => (
  <motion.li
    whileHover={{ x: 5 }}
    transition={{ type: 'spring', stiffness: 300 }}
  >
    <Link
      to={to}
      className="text-base text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors"
    >
      {children}
    </Link>
  </motion.li>
);

const Particle = ({ delay }) => (
  <motion.div
    className="absolute rounded-full bg-primary-500/10 dark:bg-primary-400/5 blur-3xl pointer-events-none"
    initial={{ opacity: 0, scale: 0.5 }}
    animate={{
      y: [0, -50, 0],
      x: [0, 30, 0],
      opacity: [0.1, 0.3, 0.1],
      scale: [1, 1.2, 1],
    }}
    transition={{
      duration: 15 + Math.random() * 10,
      repeat: Infinity,
      delay: delay,
      ease: "easeInOut",
    }}
    style={{
      width: Math.random() * 200 + 100,
      height: Math.random() * 200 + 100,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
    }}
  />
);

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-white dark:bg-dark-900 border-t border-gray-200 dark:border-dark-800 overflow-hidden transition-colors duration-300">
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <Particle key={i} delay={i * 2} />
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2 group">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="text-3xl"
              >
                ⚛️
              </motion.div>
              <span className="text-2xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-purple-600 dark:from-primary-400 dark:to-purple-400">
                Virtual Quantum Lab
              </span>
            </Link>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
              Bridging the gap between theoretical physics and visual understanding through real-time simulations, 3D environments, and AI-assisted learning.
            </p>
            <div className="flex space-x-4 pt-2">
              {/* GitHub */}
              <SocialIcon 
                href="https://github.com" 
                label="GitHub"
                path="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
              />
              {/* Twitter */}
              <SocialIcon 
                href="https://twitter.com" 
                label="Twitter"
                path="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"
              />
              {/* LinkedIn */}
              <SocialIcon 
                href="https://linkedin.com" 
                label="LinkedIn"
                path="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
              />
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white tracking-wider uppercase mb-4">
              Platform
            </h3>
            <ul className="space-y-3">
              <FooterLink to="/">Home</FooterLink>
              <FooterLink to="/simulations">Simulations</FooterLink>
              <FooterLink to="/learn">Learning Center</FooterLink>
              <FooterLink to="/about">About Us</FooterLink>
            </ul>
          </div>

          {/* Tools */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white tracking-wider uppercase mb-4">
              Tools & AI
            </h3>
            <ul className="space-y-3">
              <FooterLink to="/qrng">Quantum RNG</FooterLink>
              <FooterLink to="/qubit-ai">Qubit AI Assistant</FooterLink>
              <FooterLink to="/simulations/quantum-mechanics">Quantum Lab</FooterLink>
              <FooterLink to="/simulations/relativity">Relativity Engine</FooterLink>
            </ul>
          </div>

          {/* Legal / Contact */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white tracking-wider uppercase mb-4">
              Legal
            </h3>
            <ul className="space-y-3">
              <FooterLink to="/privacy">Privacy Policy</FooterLink>
              <FooterLink to="/terms">Terms of Service</FooterLink>
              <FooterLink to="/license">MIT License</FooterLink>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-dark-800 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              &copy; {currentYear} Virtual Quantum Lab. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <motion.div 
                className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>Systems Operational</span>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
