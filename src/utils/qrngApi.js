/**
 * ANU QRNG API Utility
 * Handles requests to Australian National University Quantum Random Number Generator
 *
 * Note: API key is securely handled via Vite proxy (vite.config.js) which forwards
 * requests to ANU QRNG API with the API key from .env file
 *
 * API Documentation: https://qrng.anu.edu.au/
 */

const QRNG_API_BASE = import.meta.env.DEV
  ? "/api/qrng"
  : "https://qrng.anu.edu.au/API/jsonI.php";

/**
 * Fetch quantum random numbers from ANU QRNG API
 * @param {Object} options - Request options
 * @param {number} options.length - Number of random numbers to fetch (1-1024)
 * @param {string} options.type - Type of random number: 'uint8', 'uint16', 'hex16', 'uint16bin'
 * @returns {Promise<Object>} Response with random numbers
 */
export const fetchQuantumRandom = async ({
  length = 1,
  type = "uint16",
} = {}) => {
  // Offline Fallback
  if (!navigator.onLine) {
    console.warn("Offline mode: Using pseudo-random fallback for QRNG");
    const fallbackData = Array.from({ length }, () => {
      if (type === "uint8") return Math.floor(Math.random() * 256);
      if (type === "uint16") return Math.floor(Math.random() * 65536);
      if (type === "hex16")
        return Math.floor(Math.random() * 65536)
          .toString(16)
          .padStart(4, "0");
      return Math.floor(Math.random() * 65536);
    });
    return { data: fallbackData, success: true, type };
  }

  try {
    // Validate parameters
    if (length < 1 || length > 1024) {
      throw new Error("Length must be between 1 and 1024");
    }

    const validTypes = ["uint8", "uint16", "hex16", "uint16bin"];
    if (!validTypes.includes(type)) {
      throw new Error(`Type must be one of: ${validTypes.join(", ")}`);
    }

    const url = `${QRNG_API_BASE}?length=${length}&type=${type}`;

    const headers = {};
    if (!import.meta.env.DEV) {
      const apiKey = import.meta.env.VITE_ANU_QRNG_API_KEY;
      if (apiKey) {
        headers["x-api-key"] = apiKey;
      }
    }

    const response = await fetch(url, { headers });

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ error: "Unknown error" }));
      throw new Error(
        errorData.error || `HTTP error! status: ${response.status}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching quantum random numbers:", error);
    // Fallback on error too
    console.warn("API Error: Using pseudo-random fallback for QRNG");
    const fallbackData = Array.from({ length }, () => {
      if (type === "uint8") return Math.floor(Math.random() * 256);
      if (type === "uint16") return Math.floor(Math.random() * 65536);
      if (type === "hex16")
        return Math.floor(Math.random() * 65536)
          .toString(16)
          .padStart(4, "0");
      return Math.floor(Math.random() * 65536);
    });
    return { data: fallbackData, success: true, type };
  }
};

/**
 * Get a single random number
 * @param {string} type - Type of random number
 * @returns {Promise<number|string>} Random number
 */
export const getSingleRandom = async (type = "uint16") => {
  const result = await fetchQuantumRandom({ length: 1, type });
  return result.data?.[0] || null;
};

/**
 * Get multiple random numbers
 * @param {number} length - Number of random numbers
 * @param {string} type - Type of random number
 * @returns {Promise<Array>} Array of random numbers
 */
export const getMultipleRandom = async (length = 10, type = "uint16") => {
  const result = await fetchQuantumRandom({ length, type });
  return result.data || [];
};

/**
 * Get random bytes in hexadecimal format
 * @param {number} length - Number of random hex values
 * @returns {Promise<Array<string>>} Array of hex strings
 */
export const getRandomHex = async (length = 1) => {
  return getMultipleRandom(length, "hex16");
};
