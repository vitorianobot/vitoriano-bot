const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

const token = "SEU_TOKEN_AQUI"; // 🔁 Troque pelo seu token da instância Z-API
const instanceId = "SEU_ID_DA_INSTANCIA"; // 🔁 Troque pelo ID da sua instância Z-API

// Função pra enviar mensagem de texto
async function sendMessage(phone, message) {
  try {
    const response = await axios.post(
      `https://api.z-api.io/instances/${instanceId}/token/${token}/send-text`,
      {
        phone: phone,
        message: message,
      }
    );
    console.log("Mensagem enviada:", response.data);
  } catch (error) {
    console.error("Erro ao enviar mensagem:", error.message);
  }
}

// Rota do webhook
app.post("/webhook", async (req, res) => {
  const data = req.body;

  const phone = data.phone;
  const message = data.message?.text?.body;

  if (!phone || !message) {
    return res.sendStatus(400);
  }

  console.log(`📨 Mensagem recebida: ${message}`);

  // Resposta do bot
  let resposta = "";

  switch (message.trim()) {
    case "1":
      resposta = "🛒 Pra comprar pelo site é só acessar: https://www.vitorianodoces.com.br";
      break;
    case "2":
      resposta = "🏪 Nossas lojas funcionam de sexta a domingo, de 10h às 17h. Vem prosear com a gente!";
      break;
    case "3":
      resposta = "📦 Se você quer revender, chama a gente no WhatsApp ou acessa: https://www.vitorianodoces.com.br/pages/atacado";
      break;
    case "4":
      resposta = "🛠️ Se teve algum problema, manda os detalhes pra gente aqui mesmo que a gente resolve rapidim.";
      break;
    case "5":
      resposta = "📩 Pode mandar sua mensagem aqui que a gente já te responde, tá bão?";
      break;
    default:
      resposta = `Oi! Seja muito bem-vindo(a) à Vitoriano Doces 😄\n\nAqui vai um resumin bão do que cê pode fazer por aqui:\n\n1. Comprar pelo site\n2. Saber horário e dias de funcionamento das lojas\n3. Informações pra revenda (atacado)\n4. Relatar e resolver um problema\n5. Outro assunto\n\nÉ só escolher uma opção, tá bom?`;
  }

  await sendMessage(phone, resposta);
  res.sendStatus(200);
});

// Inicializa o servidor
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
