import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;
const HF_TOKEN = process.env.HF_TOKEN;

// Root route
app.get("/", (req, res) => {
  res.send("AI API is running 🚀");
});

// Image generator
app.get("/generate", async (req, res) => {
  const prompt = req.query.prompt;

  if (!prompt) {
    return res.json({ error: "Prompt required" });
  }

  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HF_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ inputs: prompt })
      }
    );

    if (!response.ok) {
      const text = await response.text();
      return res.status(500).json({ error: text });
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    res.set("Content-Type", "image/png");
    res.send(buffer);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
