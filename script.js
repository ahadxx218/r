document.getElementById("submit-btn").addEventListener("click", sendToChatGPT);

async function sendToChatGPT() {
  const value = document.getElementById("word-input").value;
  const replyDiv = document.getElementById("reply-content");

  if (!value.trim()) {
    replyDiv.innerText = "❗ اكتب شيء أول!";
    return;
  }

  replyDiv.innerText = "⏳ جاري التفكير...";

  try {
    const response = await fetch("/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: value }),
    });

    const data = await response.json();
    replyDiv.innerText = data.reply || "❌ ما قدرت أفهمك!";
  } catch (err) {
    console.error("❌ SERVER ERROR:", err);
    replyDiv.innerText = "❌ فيه مشكلة بالسيرفر.";
  }
}


