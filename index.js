// vitoriano-whatsapp-bot/index.js

const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// 🚀 CONFIGURAÇÕES Z-API
const ZAPI_INSTANCE_ID = '3E538FF1A790A041FE70166DEAE7FD59';
const ZAPI_TOKEN = '7D5F1B851A1BC68B5085837F';
const ZAPI_URL = `https://api.z-api.io/instances/${ZAPI_INSTANCE_ID}/token/${ZAPI_TOKEN}/send-text`;

const fluxoBase = `
Você é o assistente virtual da Vitoriano Doces, uma doçaira artesanal mineira.
Atenda os clientes com simpatia, acolhimento e profissionalismo. Use expressões típicas mineiras como "procê", "ocê", "uai", "trem", "cadim", "bom dimais" com muita moderação.

A mensagem inicial do atendimento deve oferecer as opções abaixo:
1. Comprar pelo site
2. Saber horário e dias de funcionamento das lojas
3. Informações pra revenda (atacado)
4. Relatar e resolver um problema
5. Outro assunto

Siga sempre o roteiro aprovado da Parte 1, 2 e 3 do fluxo da Vitoriano, mantendo respostas claras, educadas, no tom mineiro informado. Quando a entrada do usuário não corresponder exatamente a um número, interprete a intenção e responda com base no roteiro.
`;

const openaiEndpoint = 'https://api.openai.com/v1/chat/completions';

app.post('/webhook', async (req, res) => {
  try {
    const incoming = req.body;

    const incomingMsg = incoming?.text?.message;
    const phoneNumber = incoming?.phone; // telefone do cliente
    const senderName = incoming?.senderName;

    if (!incomingMsg || !phoneNumber) {
      console.log("⚠️ Dados incompletos recebidos. Ignorando...");
      return res.status(400).send('Dados inválidos');
    }

    console.log(`📩 Mensagem recebida de ${senderName} (${phoneNumber}): ${incomingMsg}`);

    // Geração de resposta pelo GPT
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
    console.log(`🤖 Resposta do bot: ${gptResponse}`);

    // Enviar resposta via Z-API
    await axios.post(ZAPI_URL, {
      phone: phoneNumber,
      message: gptResponse
    });

    return res.status(200).send({ reply: gptResponse });
  } catch (error) {
    console.error('❌ Erro no webhook:', error.response?.data || error.message);
    return res.status(500).send('Erro interno');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
