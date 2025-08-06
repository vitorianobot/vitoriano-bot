const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 10000;

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Bot Vitoriano rodando sô! 🚀');
});

app.post('/webhook', (req, res) => {
  const { body } = req;
  
  if (body.message) {
    const mensagem = body.message.text?.body || '';
    const telefone = body.phone || body.message.from;

    console.log('📥 Mensagem recebida de', telefone, ':', mensagem);

    let resposta = '';

    switch (mensagem.trim()) {
      case '1':
        resposta = 'Que bom que cê tá interessado em comprar os nossos doces! Procê fazer suas compras pelo site, é só ir no nosso cantinho virtual: [www.vitorianodoces.com.br](http://www.vitorianodoces.com.br). Lá tem uma variedade de doces de dar água na boca, uai! 🍬';
        break;
      case '2':
        resposta = 'Nossas lojas funcionam todo dia, das 9h às 18h. É só chegar, prosear e aproveitar os sabores de Minas! 🕰️';
        break;
      case '3':
        resposta = 'Pra revenda, cê pode mandar um oi no nosso WhatsApp comercial ou preencher o formulário lá no site. A gente entra em contato rapidin. 🤝';
        break;
      case '4':
        resposta = 'Se teve algum probleminha, conta pra gente aqui mesmo que a gente resolve com carinho, tá bão? 🙏';
        break;
      case '5':
        resposta = 'Pode falar, tô aqui pra ajudar ocê no que precisar! 😊';
        break;
      default:
        resposta = 'Oi, tudo bão? Como posso ajudar procê hoje? Aqui estão as opções:\n\n1. Comprar pelo site\n2. Saber horário e dias de funcionamento das lojas\n3. Informações pra revenda (atacado)\n4. Relatar e resolver um problema\n5. Outro assunto\n\nÉ só me dizer o número da opção que cê precisa! 😁';
    }

    // Envia a resposta pro cliente usando o fetch
    const fetch = require('node-fetch');
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
    .then(resp => resp.json())
    .then(data => {
      console.log('📤 Resposta do bot enviada:', resposta);
    })
    .catch(error => {
      console.error('❌ Erro ao enviar resposta:', error);
    });
  }

  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`🚀 Servidor rodando na porta ${port}`);
});
