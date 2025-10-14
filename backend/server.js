import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";
import { createClient } from "@supabase/supabase-js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Initialize Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE
);

// Generate AI Report endpoint
app.post("/generate-report", async (req, res) => {
  try {
    const { user_id, location_name, soil_data, vegetation, climate } = req.body;

    // ✅ Validate input
    if (!user_id || !location_name || !soil_data || !vegetation || !climate) {
      return res.status(400).json({ success: false, message: "Missing required fields." });
    }

    // 🧠 Create prompt
    const prompt = `
      Generate a detailed and concise land degradation analysis for:
      - Location: ${location_name}
      - Soil Data: ${soil_data}
      - Vegetation: ${vegetation}
      - Climate: ${climate}
      Focus on: soil health, degradation risks, and recommendations.
    `;

    // 🧠 Request to OpenRouter (instead of OpenAI)
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini", // can change to other models later
        messages: [
          { role: "system", content: "You are an expert environmental analyst." },
          { role: "user", content: prompt },
        ],
      }),
    });

    const data = await response.json();
    const ai_report = data.choices?.[0]?.message?.content || "No report generated.";

    // 🧩 Store in Supabase
    const { error } = await supabase.from("land_analyses").insert([
      {
        user_id,
        location_name,
        soil_data,
        vegetation,
        climate,
        ai_report,
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) throw error;

    res.json({ success: true, ai_report });
  } catch (err) {
    console.error("❌ Error generating report:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

app.listen(5000, () =>
  console.log("✅ AI backend running on http://localhost:5000")
);
