import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();
const PORT = 3000;
const ML_BACKEND_URL = process.env.ML_BACKEND_URL || "http://localhost:8000";

app.use(express.json());

// Initialize Gemini SDK with telemetry header
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    // Return mock client or throw error gracefully
    console.warn("GEMINI_API_KEY is not configured or uses placeholder. Using simulated AI replies.");
    return null;
  }
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
};

const SYSTEM_INSTRUCTION = `You are LifeFlow AI, an ultra-premium, futuristic blood donor ecosystem assistant.
Your goal is to answer queries regarding blood donation, donor eligibility, compatibility, safety, myths, facts, and body recovery.
Use the following structured knowledge to answer accurately. Be supportive, friendly, professional, and clear.

Core Donation Knowledge:
- **Adult Blood Volume**: Healthy adults have approximately 10 pints of blood. Standard donation is 1 pint.
- **Recovery Timeline**:
  - Fluids/Plasma: Restored in 24 to 48 hours (Trigger: hydration).
  - Platelets: Restored in ~7 days (Trigger: Thrombopoietin).
  - Red Blood Cells: Restored in 4 to 8 weeks (Trigger: Erythropoietin).
- **Eligibility**: Usually 18-65 years old, weight >= 110 lbs (50 kg), and in good general health.
- **Myth vs Fact**: Blood donation does NOT make you permanently weak. The body replenishes lost components quickly and naturally. It is a vital, heroic act that saves up to three lives per donation.
- **Pain**: The standard blood draw takes only about 8-10 minutes. The needle prick is a minor sensation lasting just a few seconds.

Formulate your answers using clean Markdown formatting. Use bullet points and bolding for readability. Keeps responses friendly, futuristic in tone, and highly reassuring. Mention blood compatibility rules if asked.`;

// ML API Proxy routes
app.post("/api/ml/predict/availability", async (req, res) => {
  try {
    const response = await fetch(`${ML_BACKEND_URL}/predict/availability`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("ML prediction error:", error);
    res.status(500).json({ error: "ML service unavailable" });
  }
});

app.post("/api/ml/predict/compatibility", async (req, res) => {
  try {
    const response = await fetch(`${ML_BACKEND_URL}/predict/compatibility`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Compatibility check error:", error);
    res.status(500).json({ error: "ML service unavailable" });
  }
});

app.post("/api/ml/predict/ranking", async (req, res) => {
  try {
    const response = await fetch(`${ML_BACKEND_URL}/predict/ranking`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Donor ranking error:", error);
    res.status(500).json({ error: "ML service unavailable" });
  }
});

app.get("/api/ml/compatible-donors/:recipient_type", async (req, res) => {
  try {
    const response = await fetch(`${ML_BACKEND_URL}/compatible-donors/${req.params.recipient_type}`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Compatible donors error:", error);
    res.status(500).json({ error: "ML service unavailable" });
  }
});

app.get("/api/ml/model-info", async (req, res) => {
  try {
    const response = await fetch(`${ML_BACKEND_URL}/model-info`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Model info error:", error);
    res.status(500).json({ error: "ML service unavailable" });
  }
});
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const ai = getGeminiClient();
    if (!ai) {
      // Graceful fallback for local development or missing key scenarios
      const lowercaseMsg = message.toLowerCase();
      let responseText = "Thank you for reaching out to **LifeFlow AI**. ";
      
      if (lowercaseMsg.includes("18") || lowercaseMsg.includes("age") || lowercaseMsg.includes("eligible")) {
        responseText += "Yes! Most healthy adults aged **18 to 65** who weigh at least **110 lbs (50 kg)** are fully eligible to donate whole blood. Remember to eat a hearty meal and drink plenty of fluids before arriving!";
      } else if (lowercaseMsg.includes("how often") || lowercaseMsg.includes("frequency")) {
        responseText += "You can donate whole blood every **56 days** (approx. 8 weeks). Platelets can be donated more frequently—up to every **7 days**, up to 24 times a year, because your body replenishes them within a week!";
      } else if (lowercaseMsg.includes("hurt") || lowercaseMsg.includes("pain")) {
        responseText += "Blood donation is highly safe and causes minimal discomfort! Most donors describe it as a quick, mild pinch lasting only 2-3 seconds at the start. The actual draw takes just 8-10 minutes, and our specialized medical teams ensure a premium, comfortable experience.";
      } else if (lowercaseMsg.includes("recovery") || lowercaseMsg.includes("time") || lowercaseMsg.includes("restore")) {
        responseText += "Your body has a remarkable recovery timeline:\n\n- **Plasma (Liquids)**: Restored in 24–48 hours.\n- **Platelets (Clotting Cells)**: Restored in ~7 days.\n- **Red Blood Cells**: Replaced in 4–8 weeks, catalyzed by the hormone *Erythropoietin* released from your kidneys.\n\nDrinking extra water and taking iron supplements if recommended speeds up this incredible self-renewal process.";
      } else {
        responseText += "Absolutely! Blood donation is an extremely safe, lifesaver process. A single donation of 1 pint can save up to **3 lives**. Most healthy adults have 10 pints of blood, and your body naturally replaces the volume within days. Is there a specific recovery phase, emergency request, or eligibility question I can assist you with today?";
      }
      return res.json({ text: responseText, simulated: true });
    }

    // Format chat history for @google/genai SDK
    // SDK expects: contents array of { role: 'user'|'model', parts: [{ text: '...' }] }
    const contentsPayload: any[] = [];
    if (history && Array.isArray(history)) {
      history.forEach((turn: any) => {
        contentsPayload.push({
          role: turn.role === "user" ? "user" : "model",
          parts: [{ text: turn.text }]
        });
      });
    }

    // Append current user message
    contentsPayload.push({
      role: "user",
      parts: [{ text: message }]
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contentsPayload,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    res.json({ text: response.text });
  } catch (err: any) {
    console.error("Gemini API Error:", err);
    res.status(500).json({ error: "Internal AI processing error", details: err.message });
  }
});

// Start integration with Vite in Dev environment
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite development server connected in middleware mode.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Production static files mounted.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[LifeFlow AI Server] running at http://0.0.0.0:${PORT}`);
  });
}

setupServer();
