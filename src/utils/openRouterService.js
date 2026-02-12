import { OpenRouter } from "@openrouter/sdk";

const client = new OpenRouter({
  apiKey:
    import.meta.env.VITE_OPENROUTER_API_KEY ||
    import.meta.env.OPENROUTER_API_KEY ||
    "",
  baseURL: "https://openrouter.ai/api/v1",
});

const systemPrompt = `You are Qubit, an expert quantum physics assistant for the Virtual Quantum Lab platform.
Your ONLY domain is physics (classical, quantum, relativity, electromagnetism, experimental analysis, simulations).
If a user question is unrelated to physics, respond exactly with: "I'm specialized in physics and can't assist with that topic."

For physics questions, follow this structured Markdown format:
# Title (one short line summarizing the topic)
## Summary
- 2 concise bullet points highlighting the key ideas
## Detailed Explanation
Paragraphs that elaborate on the physics reasoning, include formulas when useful, and keep a helpful, encouraging tone.

Always stay accurate, cite relevant principles, and keep responses tightly focused on the physics concept being asked about.`;

const normalizeContent = (content) => {
  if (!content) return "";
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content
      .map((part) => {
        if (typeof part === "string") return part;
        if (typeof part === "object") {
          return part.text || part.content || "";
        }
        return "";
      })
      .join("\n")
      .trim();
  }
  if (typeof content === "object" && content.text) {
    return content.text;
  }
  return "";
};

export async function askAI(prompt, conversationHistory = []) {
  if (!navigator.onLine) {
    return {
      message:
        "# Offline Mode\n\nI am currently offline. Please check your internet connection to ask questions about physics.",
      usage: null,
      model: "offline-fallback",
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

  const historyMessages = conversationHistory.map((msg) => ({
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

  const messageContent = normalizeContent(
    response?.choices?.[0]?.message?.content
  );

  if (!messageContent) {
    throw new Error("OpenRouter returned an empty response.");
  }

  return {
    message: messageContent,
    usage: response?.usage || null,
    model: response?.model || "arcee-ai/trinity-large-preview:free",
  };
}
