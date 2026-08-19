// ============================================================
// WhatsApp AI Bots — Twilio + Claude API
// ============================================================
// Sis serveris sanem WhatsApp zinas caur Twilio webhook,
// nosuta lietotaja jautajumu uz Claude API un atsuta AI
// generetu atbildi atpakal WhatsApp lietotajam.
// ============================================================

require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const twilio = require("twilio");
const Anthropic = require("@anthropic-ai/sdk");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

// Anthropic (Claude) klients
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// ------------------------------------------------------------
// SYSTEM PROMPT — seit vari pilnigi pielagot bota "personibu"
// un uzdevumu (klientu apkalposana, FAQ, pierakstisanas, utt.)
// ------------------------------------------------------------
const SYSTEM_PROMPT = `Tu esi draudzigs un noderigs WhatsApp asistents.
Atbildi latviski, izmantojot skaidru un sarunvalodai piemerotu valodu.
Atbildes turi kratas — WhatsApp lietotaji negrib lasit garus tekstus,
tapec izmanto max 2-4 teikumus, ja iespejams.
Ja neko konkretu nezini, atzisti to godigi un piedavaji palidzet citadi.`;

// Sarunas atmina katram lietotajam (vienkarsa versija, atmina
// izdzest pec servera restarta — pietiek demonstracijai)
const conversationHistory = {};

// ------------------------------------------------------------
// Twilio webhook endpoint — seit atnak ienakosas WhatsApp zinas
// ------------------------------------------------------------
app.post("/whatsapp", async (req, res) => {
  const incomingMessage = req.body.Body;
  const fromNumber = req.body.From; // piem. "whatsapp:+37120000000"

  console.log(`Sanemta zina no ${fromNumber}: ${incomingMessage}`);

  const twiml = new twilio.twiml.MessagingResponse();

  try {
    // Izveido/atjauno sarunas historiju sim lietotajam
    if (!conversationHistory[fromNumber]) {
      conversationHistory[fromNumber] = [];
    }
    conversationHistory[fromNumber].push({
      role: "user",
      content: incomingMessage,
    });

    // Notur tikai pedejas 10 zinas, lai nebutu par garu konteksts
    const history = conversationHistory[fromNumber].slice(-10);

    // Nosuta jautajumu uz Claude API
    const aiResponse = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 500,
      system: SYSTEM_PROMPT,
      messages: history,
    });

    const replyText = aiResponse.content
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("\n")
      .trim();

    // Saglaba AI atbildi historija
    conversationHistory[fromNumber].push({
      role: "assistant",
      content: replyText,
    });

    twiml.message(replyText);
  } catch (error) {
    console.error("Kluda, apstradajot ziņu:", error);
    twiml.message(
      "Atvaino, gadijas tehniska kluda. Ludzu, pamegini velreiz peec brida."
    );
  }

  res.type("text/xml").send(twiml.toString());
});

// Vienkarss "veselibas" endpoints, lai pareudzetos, ka serveris strada
app.get("/", (req, res) => {
  res.send("WhatsApp AI bots strada! ✅");
});

app.listen(PORT, () => {
  console.log(`Serveris palaists uz porta ${PORT}`);
  console.log(`Webhook adrese lokali: http://localhost:${PORT}/whatsapp`);
});

// Vienkāršs veselības endpoints
app.get("/", (req, res) => {
res.send("WhatsApp AI bots strada! ✅");
});

app.listen(PORT, () => {
console.log(`Serveris palaists uz porta ${PORT}`);
console.log(`Webhook adrese lokali: http://localhost:${PORT}/whatsapp`);
});

// Meta Webhook pārbaude (Verify Token)
app.get('/webhook', (req, res) => {
const mode = req.query['hub.mode'];
const token = req.query['hub.verify_token'];
const challenge = req.query['hub.challenge'];

if (mode === 'subscribe' && token === 'ChatBot') {
res.status(200).send(challenge);
} else {
res.sendStatus(403);
}
});
