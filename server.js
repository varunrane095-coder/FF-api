import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const HF_TOKEN = process.env.HF_TOKEN;

app.get("/", (req, res) => {
  res.send("AI API is running 🚀");
});

app.get("/generate", async (req, res) => {
  const prompt = req.query.prompt;

  if (!prompt || prompt.length < 5) {
    return res.status(400).json({ error: "Prompt too short" });
  }

  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: prompt }),
      }
    );

    if (!response.ok) {
      const text = await response.text();
      return res.status(500).json({ error: text });
    }

    const imageBuffer = await response.arrayBuffer();

    res.set("Content-Type", "image/png");
    res.send(Buffer.from(imageBuffer));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
