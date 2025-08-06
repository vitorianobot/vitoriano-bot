// vitoriano-whatsapp-bot/index.js

const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// CONFIGURAÇÕES DA Z-API
const ZAPI_INSTANCE_ID = process.env.ZAPI_INSTANCE_ID;
const ZAPI_TOKEN = process.env.ZAPI_TOKEN;
const ZAPI_URL = `https://api.z-api.io/instances/${ZAPI_INSTANCE_ID}/token/${ZAPI_TOKEN}/send-text`;

const fluxoBase = `
Você é o assistente virtual da Vitoriano Doces, uma doceria artesanal mineira. Atenda os clientes com acolhimento, clareza e um toque de mineirês leve — use palavras como "ocê", "procê", "uai" ou "trem" com moderação e naturalidade.

A mensagem inicial do atendimento deve oferecer estas opções:
1. Comprar pelo site
2. Saber horário e dias de funcionamento das lojas
3. Informações pra revenda (atacado)
4. Relatar e resolver um problema
5. Outro assunto

Siga sempre o roteiro aprovado da Parte 1, 2 e 3 da Vitoriano. Quando a mensagem do cliente não for um número, tente entender a intenção e responda de forma adequada.
`;

const openaiEndpoint = 'https://api.openai.com/v1/chat/completions';

app.post('/webhook', async (req, res) => {
  try {
    const incoming = req.body;
    const incomingMsg = incoming?.text?.message;
    const phoneNumber = incoming?.phone;
    const senderName = incoming?.senderName;

    if (!incomingMsg || !phoneNumber) {
      console.log("⚠️ Mensagem recebida incompleta.");
      return res.status(400).send('Dados inválidos');
    }

    console.log(`📩 De ${senderName} (${phoneNumber}): ${incomingMsg}`);

    const completion = await axios.post(
      openaiEndpoint,
      {
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: fluxoBase },
          { role: 'user', content: incomingMsg }
        ],
        temperature: 0.7,
        max_tokens: 700
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const gptResponse = completion.data.choices[0].message.content;
    console.log(`🤖 Bot: ${gptResponse}`);

    await axios.post(ZAPI_URL, {
      phone: phoneNumber,
      message: gptResponse
    });

    res.status(200).send({ reply: gptResponse });
  } catch (error) {
    console.error('❌ Erro no webhook:', error.response?.data || error.message);
    res.status(500).send('Erro interno');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
