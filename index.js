const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 10000;

app.use(bodyParser.json());

app.post("/", (req, res) => {
  const incomingMessage = req.body.message?.text?.body || "";
  const phone = req.body.message?.from || "";
  const numberOnly = phone.replace(/\D/g, ""); // Remove caracteres não numéricos

  const lowerMessage = incomingMessage.toLowerCase();

  let reply = "";

  // Menu principal
  if (lowerMessage === "oi" || lowerMessage === "olá" || lowerMessage === "pedido" || lowerMessage === "pedidos") {
    reply =
      "Oi, tudo bem? Aqui é o atendimento automático da *Vitoriano Doces*! 😊\n\n" +
      "Em que posso te ajudar hoje? Escolha uma opção abaixo, respondendo só com o número:\n\n" +
      "1. Comprar pelo site 🛒\n" +
      "2. Saber horário e dias de funcionamento das lojas ⏰\n" +
      "3. Informações pra revenda (atacado) 📦\n" +
      "4. Relatar ou resolver um problema 🚨\n" +
      "5. Outro assunto 🤔\n\n" +
      "Pode digitar o número da opção que você quer, tá bão?";
  }

  // Respostas do menu
  else if (lowerMessage === "1") {
    reply =
      "Que bão que cê tá interessado em comprar os nossos doces! 🧁\n\n" +
      "Pra fazer suas compras online, é só acessar nosso site:\n" +
      "👉 [www.vitorianodoces.com.br](http://www.vitorianodoces.com.br)\n\n" +
      "Lá cê vai encontrar uma variedade de doces artesanais de dar água na boca.\nSe precisar de ajuda durante a compra, só me chamar por aqui! 🍬";
  }

  else if (lowerMessage === "2") {
    reply =
      "Ô trem bão que cê quer vir prosear com a gente! 😊\n\n" +
      "🛍️ *Horários das nossas lojas físicas:*\n" +
      "📍 *Loja Bichinho (Matriz)*: Todos os dias, das 9h às 17h.\n" +
      "📍 *Loja Tiradentes*: Quinta a Domingo, das 10h às 18h.\n\n" +
      "Se quiser saber como chegar, é só pedir que mando o link do mapa, uai! 📍";
  }

  else if (lowerMessage === "3") {
    reply =
      "Cê tá interessado em revender os produtos da Vitoriano? Que maravilha! 🤝\n\n" +
      "Pra saber mais sobre revenda, condições de atacado e catálogo, é só mandar um alô com o nome da sua loja e a cidade.\n\n" +
      "Nosso time vai entrar em contato rapidim com você!";
  }

  else if (lowerMessage === "4") {
    reply =
      "Ô trem! Se aconteceu algum problema, a gente quer resolver isso já! 🚨\n\n" +
      "Por favor, me conta direitinho o que aconteceu e, se puder, manda foto ou número do pedido.\n\n" +
      "Vamos cuidar disso com todo carinho, tá bom?";
  }

  else if (lowerMessage === "5") {
    reply =
      "Beleza! Me conta com calma o que cê precisa que eu tô aqui pra ajudar, viu? 🤗";
  }

  // Resposta padrão caso mensagem não seja reconhecida
  else {
    reply =
      "Uai, não entendi muito bem... 😅\n\n" +
      "Responde só com o número da opção que cê precisa, por exemplo: *1*, *2*, *3*...\n" +
      "Se preferir, pode mandar sua dúvida que eu tento ajudar também!";
  }

  // Retorno para o Z-API
  res.send({
    reply: {
      phone: numberOnly,
      message: reply,
    },
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
