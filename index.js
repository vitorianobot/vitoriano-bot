const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 10000;

app.post("/webhook", async (req, res) => {
  const body = req.body;

  console.log("📩 Webhook recebido:", JSON.stringify(body, null, 2));

  try {
    const message = body?.text?.message;
    const sender = body?.senderName;
    const chatId = body?.chatId;

    if (!message || !sender || !chatId) {
      console.log("⚠️ Dados incompletos recebidos. Ignorando...");
      return res.sendStatus(200);
    }

    // Resposta automática
    const resposta = `Olá, ${sender.split(" ")[0]}! 👋\nRecebemos sua mensagem: *${message}*`;

    // Envia a resposta pelo endpoint da Z-API
    await axios.post("https://v2.z-api.io/instances/seu_id_da_instancia/token/seu_token/send-text", {
      phone: chatId,
      message: resposta,
    });

    console.log("✅ Resposta enviada:", resposta);
    res.sendStatus(200);
  } catch (err) {
    console.error("❌ Erro ao processar mensagem:", err);
    res.sendStatus(500);
  }
});

app.get("/", (req, res) => {
  res.send("Vitoriano Bot está rodando! 🚀");
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
