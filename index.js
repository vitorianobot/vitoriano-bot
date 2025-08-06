const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 10000;

app.use(bodyParser.json());

app.post('/webhook', async (req, res) => {
  const data = req.body;

  if (!data || !data.message || !data.message.text || !data.message.phone) {
    return res.sendStatus(400);
  }

  const phone = data.message.phone;
  const text = data.message.text.trim();

  console.log(`📥 Mensagem recebida de ${phone}: ${text}`);

  let resposta = '';

  if (/^1$/.test(text)) {
    resposta = `Que bom que cê tá interessado em comprar os nossos doces! Procê fazer suas compras pelo site, basta acessar o nosso endereço virtual: [www.vitorianodoces.com.br](http://www.vitorianodoces.com.br). Lá cê vai encontrar uma variedade de doces artesanais de dar água na boca. Se precisar de ajuda durante a compra, tô aqui procê! 🍬`;
  } else if (/^2$/.test(text)) {
    resposta = `Nossas lojas funcionam todo dia, viu? De segunda a sábado das 9h às 18h, e domingo das 9h às 14h. Pode chegar pra prosear e provar nossos docim tudo feito no fogão à lenha!`;
  } else if (/^3$/.test(text)) {
    resposta = `Pra revenda, a gente tem condição especial! Manda pra gente seu CNPJ ou o nome da sua loja que a gente já continua o atendimento com carinho. 💼`;
  } else if (/^4$/.test(text)) {
    resposta = `Ô trem bão resolver as coisa! Conta pra gente o que aconteceu e já vamo te ajudar no que for preciso. Pode explicar com calma. 🙌`;
  } else if (/^5$/.test(text)) {
    resposta = `Beleza! Manda pra gente sua dúvida ou pedido e vamos te responder com carinho aqui mesmo. 😊`;
  } else {
    resposta = `Oi, tudo bem? Como posso ajudar procê hoje? Aqui estão algumas opções:\n\n1. Comprar pelo site\n2. Saber horário e dias de funcionamento das lojas\n3. Informações pra revenda (atacado)\n4. Relatar e resolver um problema\n5. Outro assunto\n\nÉ só me dizer o número da opção que cê precisa! 😊`;
  }

  await sendMessage(phone, resposta);
  res.sendStatus(200);
});

async function sendMessage(phone, message) {
  try {
    const response = await fetch('https://api.z-api.io/instances/3E538FF1A790A041FE70166DEAE7FD59/token/7D5F1B851A1BC68B5085837F/send-text', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone,
        message
      })
    });

    const data = await response.json();
    console.log('🤖 Resposta do bot:', data);
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error);
  }
}

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
