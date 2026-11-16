import express from 'express';
import { readFile } from 'node:fs/promises';

const app = express();
const PORT = 3001;
const OLLAMA_URL = 'http://127.0.0.1:11434/api/chat';
const MODEL = 'qwen2.5:3b';

app.use(express.json({ limit: '40kb' }));

function getConversationHistory(history) {
  if (!Array.isArray(history)) return [];

  return history
    .filter((item) =>
      item &&
      (item.role === 'user' || item.role === 'assistant') &&
      typeof item.content === 'string' &&
      item.content.trim().length > 0 &&
      item.content.length <= 3000
    )
    .slice(-18)
    .map(({ role, content }) => ({ role, content }));
}

const languageSettings = {
  es: {
    name: 'español',
    instruction: 'Responde en español de forma natural y profesional, aunque la documentación esté en otro idioma.',
    invalid: 'Escribe un mensaje de entre 1 y 1200 caracteres.',
    unavailable: 'No pude completar la respuesta. Revisa que Ollama esté abierto y el modelo descargado.'
  },
  en: {
    name: 'English',
    instruction: 'Respond naturally and professionally in English, even if the provided scientific documentation is in Spanish.',
    invalid: 'Please enter a message between 1 and 1200 characters.',
    unavailable: 'I could not complete the response. Check that Ollama is running and the model is downloaded.'
  },
  de: {
    name: 'Deutsch',
    instruction: 'Antworte natürlich und professionell auf Deutsch, auch wenn die wissenschaftlichen Unterlagen auf Spanisch vorliegen.',
    invalid: 'Bitte schreibe eine Nachricht mit 1 bis 1200 Zeichen.',
    unavailable: 'Ich konnte die Antwort nicht abschließen. Prüfe, ob Ollama läuft und das Modell heruntergeladen wurde.'
  }
};

function buildInstructions(knowledge, language) {
  return `
IDENTIDAD Y ENFOQUE:
Eres BBSM, un asistente virtual conversacional especializado EXCLUSIVAMENTE en
la salud física, fisiológica y psicológica de los astronautas en misiones espaciales.
Es un prototipo educativo, no un dispositivo clínico ni un sustituto del personal médico.

CONVERSACIÓN NATURAL:
- Conversa de forma fluida, comprensible, cercana y profesional; evita responder como un cuestionario.
- Puedes saludar y acompañar conversaciones cotidianas, pero conserva tu contexto espacial.
- Atiende referencias a mensajes anteriores como «eso», «¿por qué?» y «cuéntame más».
- Si se menciona aislamiento, estrés, tristeza o cansancio, responde con sensibilidad y sin suponer sentimientos.
- Haz una pregunta de seguimiento solo cuando ayude; no todas las respuestas necesitan una pregunta.
- Responde normalmente en 2 a 5 oraciones y amplía únicamente si hace falta.
- No inventes emociones propias, amistad personal ni capacidades que no tienes.
- Para temas completamente ajenos a los astronautas y la salud espacial, explica brevemente tu especialidad.

MEDICINA Y SEGURIDAD:
- Considera microgravedad, radiación, aislamiento, confinamiento, distancia a la Tierra
  y ambientes cerrados hostiles únicamente cuando sean relevantes y exista sustento científico.
- No presentes una lectura fisiológica aislada como diagnóstico ni felicites automáticamente por ella.
- Si alguien menciona 130/90 mmHg de presión arterial, NO lo describas como excelente ni normal:
  una diastólica de 90 mmHg merece revisión según referencias clínicas terrestres;
  solicita contexto o repetición adecuada y orienta a consultar al médico de vuelo.
- Los criterios clínicos terrestres no sustituyen protocolos específicos de una misión.
- No diagnostiques, inventes mediciones ni prescribas medicamentos, dosis o tratamientos individuales.
- Si reportan dolor intenso de pecho, pérdida de conciencia, dificultad grave para respirar
  u otro signo urgente, indica que pidan asistencia médica inmediata según el protocolo de la misión.
- Si hay riesgo psicológico inminente, orienta a apoyo humano o médico inmediato.
- No inventes fuentes, investigaciones, protocolos o capacidades.
- Actualmente NO hay brazalete conectado, mediciones de sensores en vivo ni expedientes clínicos.
- Si la información inicial no justifica una afirmación especializada, reconoce la limitación.

IDIOMA ACTIVO: ${languageSettings[language].name}
${languageSettings[language].instruction}
Mantén este idioma a lo largo de la respuesta aunque el historial esté en otro idioma,
salvo que el usuario solicite explícitamente una traducción o respuesta en otro idioma.

CONOCIMIENTO INICIAL DEL PROYECTO:
${knowledge}
`;
}

app.post('/api/chat', async (req, res) => {
  const { message, history, language = 'es' } = req.body ?? {};
  const selectedLanguage = Object.hasOwn(languageSettings, language) ? language : 'es';

  if (typeof message !== 'string' || !message.trim() || message.length > 1200) {
    return res.status(400).json({ error: languageSettings[selectedLanguage].invalid });
  }

  let streaming = false;
  try {
    const knowledge = await readFile(new URL('./conocimiento-inicial.md', import.meta.url), 'utf8');

    const ollamaResponse = await fetch(OLLAMA_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: MODEL,
        stream: true,
        messages: [
          { role: 'system', content: buildInstructions(knowledge, selectedLanguage) },
          ...getConversationHistory(history),
          { role: 'user', content: message.trim() }
        ],
        options: { temperature: 0.35, num_ctx: 4096 }
      }),
      signal: AbortSignal.timeout(120000)
    });

    if (!ollamaResponse.ok || !ollamaResponse.body) {
      console.error('Ollama no está disponible:', ollamaResponse.status);
      return res.status(503).json({
        error: languageSettings[selectedLanguage].unavailable
      });
    }

    res.setHeader('Content-Type', 'application/x-ndjson; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    streaming = true;

    const reader = ollamaResponse.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let receivedText = false;

    function handleLine(line) {
      if (!line.trim()) return;
      const packet = JSON.parse(line);
      if (packet.error) throw new Error(packet.error);
      const fragment = packet?.message?.content;
      if (typeof fragment === 'string' && fragment) {
        receivedText = true;
        res.write(`${JSON.stringify({ type: 'delta', text: fragment })}\n`);
      }
    }

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';
      for (const line of lines) handleLine(line);
    }
    buffer += decoder.decode();
    if (buffer.trim()) handleLine(buffer);

    if (!receivedText) throw new Error('El modelo devolvió una respuesta vacía.');
    res.end(`${JSON.stringify({ type: 'done' })}\n`);
  } catch (error) {
    console.error('Error en BBSM:', error.message);
    const errorMessage = languageSettings[selectedLanguage].unavailable;
    if (streaming) {
      if (!res.writableEnded && !res.destroyed) {
        res.end(`${JSON.stringify({ type: 'error', error: errorMessage })}\n`);
      }
    } else {
      res.status(503).json({ error: errorMessage });
    }
  }
});

app.listen(PORT, '127.0.0.1', () => {
  console.log(`BBSM está listo en http://127.0.0.1:${PORT}`);
});
