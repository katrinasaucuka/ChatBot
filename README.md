# WhatsApp AI Bots (Twilio + Claude API + Render.com)

Vienkāršs WhatsApp chat bots, kas izmanto Claude AI, lai automātiski
atbildētu uz ziņām. Šī versija ir paredzēta izvietošanai **Render.com**,
lai bots strādātu pastāvīgi bez nepieciešamības atstāt datoru ieslēgtu.

## Kas tev būs nepieciešams

1. **GitHub konts** (bezmaksas) — [github.com](https://github.com)
2. **Render.com konts** (bezmaksas) — [render.com](https://render.com)
3. **Bezmaksas Twilio konts** — [twilio.com/try-twilio](https://www.twilio.com/try-twilio)
4. **Anthropic API atslēga** — [console.anthropic.com](https://console.anthropic.com/settings/keys)

Node.js lokāli **nav obligāti nepieciešams** — Render to nodrošina pats.
Bet ja gribi testēt lokāli pirms izvietošanas, Node.js (18+) no [nodejs.org](https://nodejs.org) noderēs.

## Soļi

### 1. Augšupielādē kodu uz GitHub

1. Izveido jaunu (privātu vai publisku) repozitoriju GitHub — piem. `whatsapp-ai-bot`
2. Augšupielādē visus failus no šīs mapes (VS Code: Source Control panelis → Publish to GitHub,
   vai velc/nomet failus GitHub web saskarnē)
3. **Pārliecinies, ka `.env` fails NETIEK augšupielādēts** (tas jau ir `.gitignore` sarakstā)

### 2. Izveido servisu Render.com

1. Ej uz [render.com](https://render.com) → **New → Web Service**
2. Pieslēdz savu GitHub repozitoriju
3. Render automātiski atpazīs `render.yaml` failu un iestatīs:
   - Build Command: `npm install`
   - Start Command: `npm start`
4. Sadaļā **Environment Variables** pievieno:
   ```
   ANTHROPIC_API_KEY = tava-anthropic-atslega
   ```
5. Nospied **Create Web Service**

Render sāks izvietošanu — tas aizņem 2-5 minūtes. Kad pabeigts, tev būs
pastāvīga adrese, piemēram:
```
https://whatsapp-ai-bot-xxxx.onrender.com
```

### 3. Konfigurē Twilio WhatsApp Sandbox

1. Ej uz Twilio konsoli → **Messaging → Try it out → Send a WhatsApp message**
2. Piesaisti savu telefonu sandbox (nosūti norādīto kodu uz Twilio WhatsApp numuru)
3. Sadaļā **"When a message comes in"** ievieto savu Render adresi + `/whatsapp`:
   ```
   https://whatsapp-ai-bot-xxxx.onrender.com/whatsapp
   ```
4. Saglabā izmaiņas

### 4. Testē!

Nosūti ziņu uz Twilio sandbox WhatsApp numuru no sava telefona.
Bots atbildēs, izmantojot Claude AI — un tas strādās vienmēr, pat ja
tavs dators ir izslēgts.

> **Piezīme:** Render bezmaksas plānā serviss "aizmieg" pēc ~15 minūtēm
> neaktivitātes un pirmā ziņa pēc tam var aizņemt ~30-60 sekundes, lai
> "pamostos". Nākamās ziņas būs ātras. Tas ir normāli bezmaksas plānam.

## Kā pielāgot bota uzvedību

Atver `server.js` failu un mainī `SYSTEM_PROMPT` konstanti augšpusē —
tur vari uzrakstīt jaunas instrukcijas botam (piem. klientu apkalpošana,
pierakstīšanās uz pasākumu, FAQ atbildes, u.tml.).

## Svarīgi zināt

- Šis piemērs izmanto Twilio **sandbox** režīmu — tas ir bezmaksas testēšanai,
  bet lai bots strādātu ar jebkuru WhatsApp numuru (ne tikai tavu), nepieciešams
  reģistrēt īstu WhatsApp Business numuru Twilio vai Meta platformā.
- Sarunu atmiņa šajā piemērā tiek glabāta serverī un pazūd pēc restarta —
  reālam produktam to vajadzētu glabāt datubāzē.
- Neaugšuploatē `.env` failu ar savu API atslēgu nekur publiski (piem. GitHub)!

## Darba pieteikumam / demonstrācijai

Lai parādītu šo darba devējam:
1. Uzņem ekrānuzņēmumu vai video, kā bots atbild WhatsApp sarunā
2. Sagatavo īsu aprakstu — kāda problēma tiek atrisināta un kā AI to atvieglo
3. Ja vēlies, augšuploatē kodu uz GitHub (bet **NE** ar savu `.env` failu!)
