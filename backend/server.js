import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Initialize Supabase
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE);

// Initialize OpenAI
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Generate AI Report endpoint
app.post("/generate-report", async (req, res) => {
  try {
    const { user_id, location_name, soil_data, vegetation, climate } = req.body;

    const prompt = `
    You are an environmental AI analyst. Generate a concise, structured report on land health.
    Use the following data:
    - Location: ${location_name}
    - Soil Data: ${soil_data}
    - Vegetation: ${vegetation}
    - Climate Info: ${climate}
    Focus on: soil health, degradation risks, and recommendations.
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    const ai_report = completion.choices[0].message.content;

    // Store result in Supabase
    const { data, error } = await supabase
      .from("land_analyses")
      .insert([{ user_id, location_name, ai_report }])
      .select();

    if (error) throw error;

    res.json({ success: true, data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

app.listen(5000, () => console.log("AI backend running on http://localhost:5000"));
