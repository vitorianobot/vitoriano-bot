const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
const port = process.env.PORT || 10000;

// 🔒 Substitua aqui com os seus dados da Z-API
const token = "SEU_TOKEN_AQUI";
const instanceId = "SEU_ID_DA_INSTANCIA";

// Middleware
app.use(bodyParser.json());

// Rota principal
app.get("/", (req, res) => {
  res.send("Vitoriano bot tá online, sô!");
});

// Rota de Webhook
app.post("/webhook", async (req, res) => {
  const messageData = req.body;
  console.log("📨 Mensagem recebida:", JSON.stringify(messageData, null, 2));

  try {
    const sender = messageData.from;
    const message = messageData.message?.text;

    if (!sender || !message) {
      return res.sendStatus(200);
    }

    let resposta = "";

    switch (message.trim()) {
      case "1":
        resposta = "Cê pode comprar nossos produtos direto no site: https://vitorianodoces.com.br";
        break;
      case "2":
        resposta = "Nossas lojas funcionam de sexta a domingo, de 10h às 17h. Aparece pra prosear!";
        break;
      case "3":
        resposta = "Pra revenda dos nossos doces, chama a gente aqui mesmo que explico tudim!";
        break;
      case "4":
        resposta = "Conta pra mim qual foi o problema que vamo resolver com jeitinho.";
        break;
      case "5":
        resposta = "Beleza! Pode mandar sua dúvida aí.";
        break;
      default:
        resposta = `Oi! Seja muito bem-vindo(a) à Vitoriano Doces 😄\n\nAqui vai um resumin bão do que cê pode fazer por aqui:\n\n1. Comprar pelo site\n2. Saber horário e dias de funcionamento das lojas\n3. Informações pra revenda (atacado)\n4. Relatar e resolver um problema\n5. Outro assunto\n\nÉ só me dizer o número da opção que cê precisa! 😊`;
    }

    await axios.post(
      `https://api.z-api.io/instances/${instanceId}/token/${token}/send-text`,
      {
        phone: sender,
        message: resposta,
      }
    );

    console.log("🤖 Resposta enviada:", resposta);
    res.sendStatus(200);
  } catch (error) {
    console.error("❌ Erro ao enviar resposta:", error.message);
    res.sendStatus(500);
  }
});

app.listen(port, () => {
  console.log(`🚀 Servidor rodando na porta ${port}`);
});
