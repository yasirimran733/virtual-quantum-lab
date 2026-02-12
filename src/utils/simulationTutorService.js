import { OpenRouter } from "@openrouter/sdk";

const client = new OpenRouter({
  apiKey:
    import.meta.env.VITE_OPENROUTER_API_KEY ||
    import.meta.env.OPENROUTER_API_KEY ||
    "",
  baseURL: "https://openrouter.ai/api/v1",
});

const SIMULATION_CONTEXTS = {
  "projectile-motion": `
You are a concise simulation tutor embedded inside the "Projectile Motion" simulation
of the Virtual Quantum Lab. The simulation shows:
- A projectile launched with configurable initial velocity, launch angle, and gravity
- A 3D trajectory view with a moving particle
- Charts for height vs time, speed vs time, and energy vs time

Your job:
- Only explain and discuss projectile motion and what the learner is currently exploring
- Use simple language but rigorous physics when needed
- When relevant, reference quantities they see in the UI: height, range, time of flight, speed, max height, etc.
- Emphasize how changing velocity, angle, or gravity changes the trajectory and the charts.
- If asked anything unrelated to projectile motion, briefly say you are focused only on this simulation.
`.trim(),

  "faradays-law": `
You are a concise simulation tutor embedded inside the "Faraday's Law & Applications"
simulation of the Virtual Quantum Lab. The simulation has three modes:
- Electric generator (rotating coil in a magnetic field)
- Transformer (two coils with shared magnetic flux)
- Induction cooktop (coil beneath a pan)

Your job:
- Only explain and discuss electromagnetic induction as visualized in this simulation.
- Use the language of magnetic flux, changing flux, induced EMF, and induced current.
- Connect your explanations to what the learner sees: flux, EMF, current, secondary voltage, pan temperature, etc.
- If the user mentions generator/transformer/induction cooktop, tailor your answer to that mode.
- If asked anything unrelated to electromagnetic induction or this simulation, briefly say you are focused only on this simulation.
`.trim(),
};

const buildSystemPrompt = (simulationId) => {
  const base = SIMULATION_CONTEXTS[simulationId] || "";
  return `
You are a friendly physics tutor inside the Virtual Quantum Lab.
Always respond in **clear, Markdown-formatted English**, with:
- A short heading
- 1–3 bullet points summarising the key ideas
- A short explanation connecting the concept to what the learner sees in the simulation UI.

${base}
`.trim();
};

/**
 * Ask the OpenRouter-based simulation tutor a question, scoped to a single simulation.
 *
 * @param {Object} params
 * @param {"projectile-motion"|"faradays-law"} params.simulationId
 * @param {string} params.prompt
 * @param {Array<{role: "user"|"assistant", content: string}>} [params.history]
 */
export async function askSimulationTutor({
  simulationId,
  prompt,
  history = [],
}) {
  if (!navigator.onLine) {
    return {
      message:
        "I appear to be offline right now. Please reconnect to the internet to chat with the simulation tutor.",
      model: "openrouter-offline",
    };
  }

  if (!prompt || !prompt.trim()) {
    throw new Error("Prompt cannot be empty.");
  }

  if (!client?._options?.apiKey) {
    throw new Error(
      "Missing OpenRouter API key. Please set OPENROUTER_API_KEY in your .env file."
    );
  }

  const systemPrompt = buildSystemPrompt(simulationId);

  const historyMessages = history.map((msg) => ({
    role: msg.role === "assistant" ? "assistant" : "user",
    content: msg.content,
  }));

  const response = await client.chat.send({
    model: "arcee-ai/trinity-large-preview:free",
    temperature: 0.3,
    messages: [
      { role: "system", content: systemPrompt },
      ...historyMessages,
      { role: "user", content: prompt },
    ],
  });

  const content =
    response?.choices?.[0]?.message?.content ||
    response?.choices?.[0]?.message?.content?.text ||
    "";

  if (!content || (Array.isArray(content) && !content.length)) {
    throw new Error("OpenRouter returned an empty response.");
  }

  // Normalise content to string
  let message = "";
  if (typeof content === "string") {
    message = content;
  } else if (Array.isArray(content)) {
    message = content
      .map((part) =>
        typeof part === "string"
          ? part
          : typeof part?.text === "string"
          ? part.text
          : ""
      )
      .join("\n")
      .trim();
  } else if (typeof content === "object" && content.text) {
    message = content.text;
  }

  if (!message) {
    throw new Error("OpenRouter returned an empty response.");
  }

  return {
    message,
    usage: response?.usage || null,
    model: response?.model || "arcee-ai/trinity-large-preview:free",
  };
}

export default {
  askSimulationTutor,
};

