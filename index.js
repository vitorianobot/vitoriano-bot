// vitoriano-whatsapp-bot/index.js

const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

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

    // 🔎 Aqui pegamos os dados corretamente conforme a estrutura do Z-API
    const incomingMsg = incoming?.text?.message;
    const sender = incoming?.senderName;

    if (!incomingMsg || !sender) {
      console.log("⚠️ Dados incompletos recebidos. Ignorando...");
      return res.status(400).send('Dados inválidos');
    }

    const prompt = `${fluxoBase}\nUsuário: ${incomingMsg}\nAssistente:`;

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

    console.log(`📩 Mensagem de ${sender}: ${incomingMsg}`);
    console.log(`🤖 Resposta do bot: ${gptResponse}`);

    // Aqui é onde você vai configurar o retorno da mensagem via Z-API futuramente.
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
