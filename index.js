const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

const token = "SEU_TOKEN_AQUI"; // 🔁 Substitua pelo seu token da Z-API

const instanceId = "SEU_ID_DA_INSTANCIA"; // 🔁 Substitua pelo seu ID da instância da Z-API

const apiUrl = `https://api.z-api.io/instances/${instanceId}/token/${token}`;

app.post("/webhook", async (req, res) => {
  const body = req.body;

  if (!body.message || !body.phone) {
    return res.sendStatus(400);
  }

  const phone = body.phone;
  const message = body.message.trim().toLowerCase();

  console.log(`📩 Mensagem recebida de: ${phone} ➡️ ${message}`);

  let response = "";

  if (["1", "comprar", "comprar pelo site"].includes(message)) {
    response =
      "Bom que cê tá interessado em comprar os nossos doces! Cê pode fazer suas compras pelo site, é só entrar em: [www.vitorianodoces.com.br](http://www.vitorianodoces.com.br) 🍬\n\nSe tiver qualquer dúvida, tamo por aqui!";
  } else if (["2", "horário", "horario", "funcionamento"].includes(message)) {
    response =
      "As lojas da Vitoriano funcionam assim:\n🕘 Segunda a sexta: 9h às 17h\n🕘 Sábado, domingo e feriado: 9h às 18h\n\nPode chegar que vai ter doce bão te esperando!";
  } else if (["3", "revenda", "atacado"].includes(message)) {
    response =
      "Se cê tá pensando em revender nossos doces, é só mandar uma mensagem aqui mesmo falando o nome completo, cidade e se já trabalha com outros produtos. Um dos nossos vai te responder rapidim!";
  } else if (["4", "problema", "reclamação"].includes(message)) {
    response =
      "Vixi! Sentimos muito que algo não saiu como esperado. Manda pra gente aqui seu nome completo, número do pedido (se tiver) e o que aconteceu, que vamo resolver isso junto, uai!";
  } else if (["5", "outro", "outros"].includes(message)) {
    response =
      "Claro! Pode escrever aqui o que cê precisa que a gente responde rapidim, tá bom?";
  } else {
    response =
      "Oi! Seja muito bem-vindo(a) à Vitoriano Doces 😄\n\nAqui vai um resumin bão do que cê pode fazer por aqui:\n\n1. Comprar pelo site\n2. Saber horário e dias de funcionamento das lojas\n3. Informações pra revenda (atacado)\n4. Relatar e resolver um problema\n5. Outro assunto\n\nÉ só me dizer o número da opção que cê precisa! 😊";
  }

  try {
    await axios.post(`${apiUrl}/send-text`, {
      phone,
      message: response,
    });

    console.log(`🤖 Resposta do bot: ${response}`);
    res.sendStatus(200);
  } catch (error) {
    console.error("Erro ao enviar mensagem:", error?.response?.data || error);
    res.sendStatus(500);
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
