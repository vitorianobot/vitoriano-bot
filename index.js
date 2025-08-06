const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const app = express();
const port = 10000;

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Bot Vitoriano tá rodando, uai! 🚀');
});

app.post('/webhook', (req, res) => {
  const { message } = req.body;

  if (!message || !message.text || !message.from) {
    return res.sendStatus(400);
  }

  const mensagem = message.text.body;
  const telefone = message.from;

  console.log('📥 Mensagem recebida de', telefone, ':', mensagem);

  let resposta = '';

  switch (mensagem.trim()) {
    case '1':
      resposta = 'Que bom que cê tá interessado em comprar os nossos doces! Procê fazer suas compras pelo site, basta acessar o nosso endereço virtual: [www.vitorianodoces.com.br](http://www.vitorianodoces.com.br). Lá cê vai encontrar uma variedade de doces artesanais de dar água na boca. Se precisar de ajuda durante a compra, tô aqui procê! 🍬';
      break;
    case '2':
      resposta = 'Nossas lojas funcionam todo dia, das 9h às 18h. Pode chegar pra prosear e adoçar o dia! ⏰';
      break;
    case '3':
      resposta = 'Pra revenda, é só chamar aqui mesmo que a gente te explica tim-tim por tim-tim, combinado? 🤝';
      break;
    case '4':
      resposta = 'Ô trem bão é resolver rapidim! Conta aí qual foi o problema que a gente já vê isso agora. 🛠️';
      break;
    case '5':
      resposta = 'Tô por aqui, viu? Só falar o que precisa que eu ajudo! 😄';
      break;
    default:
      resposta = 'Oi, tudo bem? Como posso ajudar procê hoje? Aqui estão algumas opções:\n\n1. Comprar pelo site\n2. Saber horário e dias de funcionamento das lojas\n3. Informações pra revenda (atacado)\n4. Relatar e resolver um problema\n5. Outro assunto\n\nÉ só me dizer o número da opção que cê precisa! 😊';
  }

  fetch('https://v5.chatpro.com.br/chatpro-xyz/send-message', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': 'SEU_TOKEN_AQUI'
    },
    body: JSON.stringify({
      phone: telefone,
      message: resposta
    })
  })
    .then(response => response.json())
    .then(data => {
      console.log('📤 Resposta enviada com sucesso:', resposta);
    })
    .catch(error => {
      console.error('❌ Erro ao enviar mensagem:', error);
    });

  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`🚀 Servidor rodando na porta ${port}`);
});
