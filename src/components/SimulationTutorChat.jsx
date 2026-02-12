import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PhysicsButton } from './physics/PhysicsButton';
import { springConfigs } from '../utils/physicsAnimations';
import { askSimulationTutor } from '../utils/simulationTutorService';

const SimulationTutorChat = ({ simulationId, title, subtitle }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [messages, loading]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: text,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setError('');

    try {
      const history = messages.slice(-8).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const response = await askSimulationTutor({
        simulationId,
        prompt: text,
        history,
      });

      const tutorMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: response.message,
      };

      setMessages((prev) => [...prev, tutorMessage]);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to get response from the simulation tutor.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={springConfigs.gentle}
      className="glass rounded-2xl p-4 flex flex-col h-full"
    >
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-base font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
            <span>🧠</span>
            <span>{title}</span>
          </h2>
          {subtitle && (
            <p className="text-xs text-gray-600 dark:text-gray-400">{subtitle}</p>
          )}
        </div>
      </div>

      <div className="flex-1 min-h-[160px] max-h-[260px] overflow-y-auto space-y-2 text-xs md:text-sm mb-3">
        {messages.length === 0 && !loading && !error && (
          <p className="text-gray-600 dark:text-gray-400 text-xs">
            Ask a question about this simulation, for example:
            {' '}
            <span className="font-mono">
              Why does changing the angle change the range?
            </span>
          </p>
        )}

        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={springConfigs.gentle}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-xl px-3 py-2 ${
                  msg.role === 'user'
                    ? 'bg-primary-500 text-white'
                    : 'bg-white dark:bg-dark-800 text-gray-800 dark:text-gray-100 border border-gray-200/60 dark:border-dark-700/80'
                }`}
              >
                {msg.role === 'assistant' && (
                  <div className="flex items-center space-x-1 mb-1">
                    <span className="text-xs font-semibold text-primary-600 dark:text-primary-400">
                      Simulation Tutor
                    </span>
                  </div>
                )}
                <div className="whitespace-pre-wrap break-words">{msg.content}</div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
            <span>Simulation tutor is thinking</span>
            <motion.span
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ repeat: Infinity, duration: 1.2 }}
            >
              …
            </motion.span>
          </div>
        )}

        {error && (
          <div className="text-xs text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="flex items-center space-x-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          placeholder="Ask about what you see in this simulation…"
          className="flex-1 px-3 py-2 rounded-xl bg-gray-100 dark:bg-dark-800 border border-gray-200 dark:border-dark-700 focus:outline-none focus:ring-1 focus:ring-primary-500 text-xs md:text-sm resize-none"
          style={{ minHeight: '36px', maxHeight: '80px' }}
        />
        <PhysicsButton
          size="sm"
          variant="primary"
          physicsType="bouncy"
          onClick={handleSend}
          disabled={loading || !input.trim()}
          className="px-3 py-2"
        >
          {loading ? '...' : 'Ask'}
        </PhysicsButton>
      </div>
    </motion.div>
  );
};

export default SimulationTutorChat;

