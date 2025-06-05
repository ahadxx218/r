const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

// ✅ استيراد fetch بطريقة تدعم ESM داخل CommonJS
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));

dotenv.config();
const app = express();

// ✅ إعدادات السيرفر
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// ✅ نقطة إرسال الرسائل
app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;
  console.log("📨 المستخدم أرسل:", userMessage);

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: userMessage }],
        max_tokens: 100,
      }),
    });

    const data = await response.json();
    console.log("✅ رد ChatGPT:", data);

    if (data.choices && data.choices.length > 0) {
      res.json({ reply: data.choices[0].message.content });
    } else {
      res.status(500).json({ error: "رد غير متوقع من OpenAI" });
    }
  } catch (err) {
    console.error("❌ خطأ من السيرفر:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});

