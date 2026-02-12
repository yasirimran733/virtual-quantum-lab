import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PhysicsButton } from '../components/physics/PhysicsButton';
import { ParameterControl } from '../components/ParameterControl';
import { fetchQuantumRandomNumbers } from '../utils/qrngService';

const typeOptions = [
  {
    value: 'uint16',
    label: 'Unsigned Int (16-bit)',
    description: 'Natural numbers 0–65535 (default for most use cases)',
  },
  {
    value: 'uint8',
    label: 'Unsigned Int (8-bit)',
    description: 'Byte-sized integers 0–255 (good for buffers)',
  },
  {
    value: 'hex16',
    label: 'Hex (16-bit)',
    description: 'Hex words for keys, IDs and low-level crypto',
  },
];

const formatValues = (values, type) => {
  if (!Array.isArray(values)) return '';

  // For most developers (e.g. blockchain, cryptography), a sequence of natural
  // numbers is the most convenient representation. When the API returns hex
  // words we convert them to base‑10 here.
  if (type.startsWith('hex')) {
    return values.map((v) => parseInt(v, 16)).join(', ');
  }

  return values.join(', ');
};

const QRNG = () => {
  // Default to uint16 so the primary view is "natural numbers" for developers.
  const [type, setType] = useState('uint16');
  const [length, setLength] = useState(32);
  const [size, setSize] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setIsLoading(true);
    setError('');
    setCopied(false);

    try {
      const data = await fetchQuantumRandomNumbers({ type, length, size });
      setResult(data);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to fetch quantum random numbers.');
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!result) return;
    const text = formatValues(result.values, type);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Clipboard copy failed', err);
    }
  };

  const activeType = typeOptions.find((t) => t.value === type);

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
            <span className="gradient-text">Quantum Random Numbers</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Developer‑focused access to true quantum randomness from the{' '}
            <span className="font-semibold">ANU Quantum Numbers</span> API —
            ideal for blockchain, cryptography, simulation seeding, and security‑sensitive workloads.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Controls */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-1"
          >
            <div className="glass rounded-2xl p-6 space-y-6 card-hover">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Request Parameters
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Tune the QRNG request to match your use case. All values are fetched live from the ANU
                hardware source via authenticated API calls.
              </p>

              {/* Type selector */}
              <div className="space-y-3">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Output type
                </span>
                <div className="grid grid-cols-1 gap-3">
                  {typeOptions.map((option) => {
                    const isActive = option.value === type;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setType(option.value)}
                        className={`w-full text-left px-4 py-3 rounded-xl border transition-colors text-sm ${
                          isActive
                            ? 'border-primary-500 bg-primary-500/10 text-primary-600 dark:text-primary-300'
                            : 'border-gray-200 dark:border-dark-700 text-gray-700 dark:text-gray-300 hover:border-primary-400'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">{option.label}</span>
                          {isActive && <span className="text-xs px-2 py-0.5 rounded-full bg-primary-500/20">Selected</span>}
                        </div>
                        <p className="text-xs mt-1 text-gray-500 dark:text-gray-400">
                          {option.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Length */}
              <ParameterControl
                label="Length (number of values)"
                value={length}
                onChange={(v) => setLength(Math.min(Math.max(v, 1), 1024))}
                min={1}
                max={1024}
                step={1}
                type="input"
                className="mt-4"
              />

              {/* Size */}
              <ParameterControl
                label="Block size"
                value={size}
                onChange={(v) => setSize(Math.min(Math.max(v, 1), 1024))}
                min={1}
                max={1024}
                step={1}
                type="input"
              />

              <div className="pt-4 flex flex-col space-y-3">
                <PhysicsButton
                  onClick={handleGenerate}
                  disabled={isLoading}
                  className="w-full justify-center"
                  size="md"
                  physicsType="elastic"
                >
                  {isLoading ? 'Fetching quantum randomness…' : 'Generate Quantum Random Numbers'}
                </PhysicsButton>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Requires a valid <code className="font-mono text-[11px]">VITE_ANU_QRNG_API_KEY</code> in your
                  environment. Keys are never logged to the console.
                </p>
              </div>

              {activeType && (
                <div className="mt-2 rounded-xl bg-gray-50 dark:bg-dark-800 p-3 border border-dashed border-gray-200 dark:border-dark-600">
                  <p className="text-xs font-mono text-gray-600 dark:text-gray-300 break-all">
                    <span className="font-semibold">Example usage:</span>{' '}
                    <span className="text-primary-600 dark:text-primary-400">
                      type={activeType.value}, length={length}, size={size}
                    </span>
                  </p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Output */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="lg:col-span-2"
          >
            <div className="glass rounded-2xl p-6 flex flex-col h-full">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Output & Developer View
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Inspect the raw JSON, copy flattened values for use in code, or snapshot results for audits.
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <PhysicsButton
                    variant="secondary"
                    size="sm"
                    physicsType="gentle"
                    onClick={handleCopy}
                    disabled={!result}
                    className="flex items-center space-x-2"
                  >
                    <span>{copied ? 'Copied' : 'Copy values'}</span>
                  </PhysicsButton>
                </div>
              </div>

              {/* Error state */}
              {error && (
                <div className="mb-4 rounded-xl border border-red-300/60 bg-red-50/80 dark:bg-red-900/20 dark:border-red-500/50 px-4 py-3 text-sm text-red-700 dark:text-red-300">
                  <span className="font-semibold">Error:</span> {error}
                </div>
              )}

              {/* Result */}
              <div className="flex-1 grid grid-rows-2 gap-4">
                <div className="rounded-xl bg-black/90 border border-gray-800 p-4 overflow-auto font-mono text-xs text-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] uppercase tracking-wide text-gray-400">
                      Flattened values ({type} as decimal)
                    </span>
                    {result && (
                      <span className="text-[11px] text-gray-500">
                        length={result.meta?.length} • size={result.meta?.size}
                      </span>
                    )}
                  </div>
                  <pre className="whitespace-pre-wrap break-all">
                    {result ? formatValues(result.values, type) : '// Generate to see quantum random output'}
                  </pre>
                </div>

                <div className="rounded-xl bg-black/80 border border-gray-800 p-4 overflow-auto font-mono text-xs text-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] uppercase tracking-wide text-gray-400">
                      Raw JSON response
                    </span>
                  </div>
                  <pre className="whitespace-pre overflow-x-auto">
                    {result ? JSON.stringify(result.raw, null, 2) : '{\n  // Awaiting ANU QRNG response…\n}'}
                  </pre>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Developer Notes */}
        <div className="mt-10 max-w-3xl mx-auto">
          <div className="glass rounded-2xl p-5 text-sm text-gray-600 dark:text-gray-400">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">
              Implementation notes for developers
            </h3>
            <ul className="list-disc list-inside space-y-1">
              <li>
                Quantum randomness is sourced from the{' '}
                <span className="font-mono text-[11px]">https://api.quantumnumbers.anu.edu.au/</span>{' '}
                endpoint using your API key in the{' '}
                <span className="font-mono text-[11px]">x-api-key</span> header.
              </li>
              <li>
                The client wrapper lives in{' '}
                <span className="font-mono text-[11px]">src/utils/qrngService.js</span> and normalises the
                response to <code>values</code> and <code>meta</code> fields for easier consumption.
              </li>
              <li>
                For security, your API key is only read from environment variables and is never embedded in
                the bundle or logged.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRNG;

