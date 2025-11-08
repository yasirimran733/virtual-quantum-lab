import { motion } from 'framer-motion'
import { useState } from 'react'

export const Sidebar = ({ isOpen, onClose, children }) => {
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: isOpen ? 0 : -300 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed left-0 top-16 bottom-0 w-64 glass border-r border-gray-200/50 dark:border-dark-700/50 z-40 overflow-y-auto md:translate-x-0"
      >
        <div className="p-4">
          {children}
        </div>
      </motion.aside>
    </>
  )
}

