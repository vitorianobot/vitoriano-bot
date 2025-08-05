const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 10000;

// Substitua pelos seus dados da Z-API:
const INSTANCE_ID = "SUA_INSTANCIA";
const TOKEN = "SEU_TOKEN";

app.post("/webhook", async (req, res) => {
  const body = req.body;

  console.log("📩 Webhook recebido:", JSON.stringify(body, null, 2));

  try {
    const message = body?.text?.message;
    const sender = body?.senderName;
    const rawChatId = body?.chatId;

    if (!message || !sender || !rawChatId) {
      console.log("⚠️ Dados incompletos recebidos. Ignorando...");
      return res.sendStatus(200);
    }

    const phone = rawChatId.replace("@c.us", "");

    const resposta = `Olá, ${sender?.split(" ")[0]}! 👋\nRecebemos sua mensagem: *${message}*`;

    const url = `https://v2.z-api.io/instances/${INSTANCE_ID}/token/${TOKEN}/send-text`;

    await axios.post(url, {
      phone,
      message: resposta,
    });

    console.log("✅ Mensagem enviada para", phone);
    res.sendStatus(200);
  } catch (err) {
    console.error("❌ Erro ao processar mensagem:", err.message);
    res.sendStatus(500);
  }
});

app.get("/", (req, res) => {
  res.send("✅ Vitoriano Bot está rodando!");
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
