// vitoriano-whatsapp-bot/index.js

const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const ZAPI_INSTANCE_ID = process.env.ZAPI_INSTANCE_ID;
const ZAPI_TOKEN = process.env.ZAPI_TOKEN;

const ZAPI_URL = `https://api.z-api.io/instances/${ZAPI_INSTANCE_ID}/token/${ZAPI_TOKEN}/send-text`;

const fluxoBase = `
Você é o assistente virtual da Vitoriano Doces, uma doçaria artesanal mineira. Atenda os clientes com simpatia, acolhimento e profissionalismo. Use um mineirês sutil e gentil: diga "cê" em vez de "você", "trem", "uai", "cadim", mas sem exagerar. Fale sempre de forma acolhedora e informativa.

Mensagem inicial:
Oi! Seja muito bem-vindo(a) à Vitoriano Doces 😄  
Aqui vai um resumin bão do que cê pode fazer por aqui:

1. Comprar pelo site  
2. Saber horário e dias de funcionamento das lojas  
3. Informações pra revenda (atacado)  
4. Relatar e resolver um problema  
5. Outro assunto  

Responda com o número da opção desejada ou descreva o que cê precisa, que eu te ajudo!`;

const openaiEndpoint = 'https://api.openai.com/v1/chat/completions';

app.post('/webhook', async (req, res) => {
  try {
    const incoming = req.body;

    const incomingMsg = incoming?.text?.message;
    const phoneNumber = incoming?.phone;
    const senderName = incoming?.senderName;

    if (!incomingMsg || !phoneNumber) {
      console.log("⚠️ Dados incompletos recebidos. Ignorando...");
      return res.status(400).send('Dados inválidos');
    }

    console.log(`📩 Mensagem recebida de ${senderName} (${phoneNumber}): ${incomingMsg}`);

    // Gerar resposta com GPT
    const completion = await axios.post(
      openaiEndpoint,
      {
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: fluxoBase },
          { role: 'user', content: incomingMsg }
        ],
        temperature: 0.6,
        max_tokens: 700
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const gptResponse = completion.data.choices[0].message.content.trim();
    console.log(`🤖 Resposta do bot: ${gptResponse}`);

    // Envia via Z-API
    await axios.post(ZAPI_URL, {
      phone: phoneNumber,
      message: gptResponse
    });

    return res.status(200).send({ reply: gptResponse });

  } catch (error) {
    console.error('❌ Erro no webhook:', error?.response?.data || error.message);
    return res.status(500).send('Erro interno do servidor');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
