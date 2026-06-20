import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `You are RaktCare AI, an ultra-premium, futuristic blood donor ecosystem assistant.
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

const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    console.warn("GEMINI_API_KEY is not configured or uses placeholder.");
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

export default async function handler(req: any, res: any) {
  // Support custom CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");

  if (req.method === "OPTIONS") {
    res.statusCode = 200;
    return res.end();
  }

  if (req.method !== "POST") {
    res.statusCode = 405;
    return res.json({ error: "Method not allowed. Use POST." });
  }

  try {
    const { message, history } = req.body || {};
    if (!message) {
      res.statusCode = 400;
      return res.json({ error: "Message is required" });
    }

    const ai = getGeminiClient();
    if (!ai) {
      // Offline / Local static fallback description
      const lowercaseMsg = message.toLowerCase();
      let responseText = "Thank you for reaching out to **RaktCare AI**. ";
      
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

      res.statusCode = 200;
      return res.json({ text: responseText, simulated: true });
    }

    const contentsPayload: any[] = [];
    if (history && Array.isArray(history)) {
      history.forEach((turn: any) => {
        contentsPayload.push({
          role: turn.role === "user" ? "user" : "model",
          parts: [{ text: turn.text }]
        });
      });
    }

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

    res.statusCode = 200;
    return res.json({ text: response.text });
  } catch (err: any) {
    console.error("Vercel Serverless Gemini API Error:", err);
    res.statusCode = 500;
    return res.json({ error: "Internal AI processing error", details: err.message });
  }
}
