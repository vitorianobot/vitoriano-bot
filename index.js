const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 10000;

app.use(bodyParser.json());

app.post("/webhook", (req, res) => {
  const message = req.body.message?.body;
  const sender = req.body.message?.from;

  console.log("📨 Mensagem recebida de:", sender, "➡️", message);

  let resposta = "";

  switch (message) {
    case "1":
      resposta = "Que bom que cê tá interessado em comprar os nossos doces! Procê fazer suas compras pelo site, basta acessar o nosso endereço virtual: [www.vitorianodoces.com.br](http://www.vitorianodoces.com.br). Lá cê vai encontrar uma variedade de doces artesanais de dar água na boca. Se precisar de ajuda durante a compra, tô aqui procê! 🍬";
      break;
    case "2":
      resposta = "Nossas lojas funcionam todo dia, das 9h às 17h, inclusive fins de semana e feriado! Quando quiser prosear ou experimentar um docim, só aparecer!";
      break;
    case "3":
      resposta = "Ocê quer revender os doces da Vitoriano? Que notícia boa demais! Me passa seu nome e cidade que um dos nossos atendentes vai entrar em contato rapidim.";
      break;
    case "4":
      resposta = "Se aconteceu alguma coisa fora do normal, me conta aí direitinho o que foi. Vamo resolver isso juntos, uai!";
      break;
    case "5":
      resposta = "Beleza! Me conta qual é o assunto que cê quer tratar, que eu vejo aqui como posso te ajudar.";
      break;
    default:
      resposta = "Oi, tudo bem? Como posso ajudar procê hoje? Aqui estão algumas opções:\n\n1. Comprar pelo site\n2. Saber horário e dias de funcionamento das lojas\n3. Informações pra revenda (atacado)\n4. Relatar e resolver um problema\n5. Outro assunto\n\nÉ só me dizer o número da opção que cê precisa! 😊";
  }

  console.log("🤖 Resposta do bot:", resposta);

  res.send({
    reply: resposta,
  });
});

app.listen(port, () => {
  console.log(`🚀 Servidor rodando na porta ${port}`);
});
