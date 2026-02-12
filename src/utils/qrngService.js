const API_BASE_URL = "https://api.quantumnumbers.anu.edu.au/";

const getApiKey = () => {
  return (
    import.meta.env.VITE_ANU_QRNG_API_KEY ||
    import.meta.env.ANU_QRNG_API_KEY ||
    ""
  );
};

/**
 * Fetch quantum random numbers from ANU Quantum Numbers API.
 * Intended for developers who need high‑quality randomness
 * (e.g., blockchain, cryptography, simulations).
 *
 * @param {Object} options
 * @param {"uint8"|"uint16"|"hex16"} options.type - Output type.
 * @param {number} options.length - Number of values to return.
 * @param {number} options.size - Block size (API-specific, defaults to 1).
 */
export async function fetchQuantumRandomNumbers({
  type = "hex16",
  length = 32,
  size = 1,
} = {}) {
  const apiKey = getApiKey();

  if (!apiKey) {
    throw new Error(
      "Missing ANU Quantum Numbers API key. Set VITE_ANU_QRNG_API_KEY in your .env file."
    );
  }

  const url = new URL(API_BASE_URL);
  url.searchParams.set("type", type);
  url.searchParams.set("length", String(length));
  url.searchParams.set("size", String(size));

  const response = await fetch(url.toString(), {
    headers: {
      "x-api-key": apiKey,
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(
      `ANU QRNG request failed (${response.status}): ${
        text || response.statusText
      }`
    );
  }

  const data = await response.json();

  // Normalise common shapes from examples:
  // { data: [...] } or { success: true, data: [...] }
  const values =
    Array.isArray(data?.data) && data.data.length > 0
      ? data.data
      : Array.isArray(data)
      ? data
      : [];

  if (!values.length) {
    throw new Error("ANU QRNG returned an empty data set.");
  }

  return {
    raw: data,
    values,
    meta: {
      type,
      length,
      size,
      timestamp: new Date().toISOString(),
    },
  };
}

export default {
  fetchQuantumRandomNumbers,
};

