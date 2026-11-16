import React, { useEffect, useRef, useState } from 'react';

const STORAGE_KEY = 'bbsm-conversacion-v2';
const LANGUAGE_KEY = 'bbsm-language-v3';

const translations = {
  es: {
    brandSubtitle: 'Asistente conversacional espacial',
    subtitle: 'Podemos platicar, no solo preguntar y responder.',
    mission: 'MISIÓN · ETAPA 01',
    hero: 'Conversa. Explora. Comprende.',
    description: 'Un espacio para hablar con naturalidad sobre el bienestar y los desafíos de vivir fuera de la Tierra.',
    newChat: 'Nueva conversación',
    topicsTitle: 'TEMAS QUE CONOZCO',
    topicsSubtitle: 'Salud en misiones espaciales',
    topics: ['Radiación espacial', 'Aislamiento y confinamiento', 'Distancia a la Tierra', 'Cambios gravitacionales', 'Entornos cerrados hostiles'],
    language: 'Idioma',
    voiceOn: '🔊 Voz activada',
    voiceOff: '🔈 Activar voz',
    voiceTitle: 'Leer en voz alta las siguientes respuestas',
    prototype: 'Prototipo',
    introTitle: 'Una conversación en el espacio',
    introDescription: 'Puedes saludar, contar algo que te preocupa o hacer una pregunta. BBSM intentará seguir el hilo de la charla.',
    you: 'Tú', notice: 'Aviso', typing: 'BBSM está escribiendo',
    welcome: '¡Hola! Soy BBSM. Podemos conversar sobre la vida en una misión espacial y el bienestar de los astronautas. También puedes contarme cómo te sientes hoy. ¿Qué tienes en mente?',
    starters: ['Hola, hoy me siento un poco cansado durante la misión.', '¿Cómo sería un día normal en una misión espacial?', 'Me preocupa el aislamiento durante una misión.'],
    placeholder: 'Cuéntame algo, ¿cómo va tu día?',
    send: 'Enviar',
    inputLabel: 'Mensaje para BBSM',
    dictate: 'Dictar mensaje',
    stopDictation: 'Detener dictado',
    dictateTitle: 'Dictar mensaje con el micrófono',
    dictateUnavailable: 'El navegador no admite dictado por voz',
    listening: 'Te escucho… cuando termines de hablar, revisa el texto y presiona Enviar.',
    micUnavailable: 'El reconocimiento de voz no está disponible en este navegador. Puedes escribir tu mensaje.',
    micPermission: 'Activa el permiso de micrófono en tu navegador para dictar mensajes.',
    micError: 'No se pudo reconocer tu voz. Puedes intentar de nuevo o escribir el mensaje.',
    micStartError: 'No se pudo iniciar el micrófono.',
    audioUnavailable: 'Este navegador no tiene lectura en voz alta disponible.',
    assistantUnavailable: 'BBSM no está disponible en este momento.',
    streamingUnavailable: 'El navegador no permite recibir respuestas progresivas.',
    streamInterrupted: 'La respuesta se interrumpió. Inténtalo otra vez.',
    disclaimer: 'Chat educativo sin acceso a sensores. Los mensajes se conservan en esta pestaña durante la sesión. La voz del navegador puede requerir Internet.'
  },
  en: {
    brandSubtitle: 'Space conversational assistant',
    subtitle: 'We can have a conversation, not just exchange questions and answers.',
    mission: 'MISSION · STAGE 01',
    hero: 'Talk. Explore. Understand.',
    description: 'A space for natural conversations about wellbeing and the challenges of living beyond Earth.',
    newChat: 'New conversation',
    topicsTitle: 'TOPICS I KNOW',
    topicsSubtitle: 'Health in space missions',
    topics: ['Space radiation', 'Isolation and confinement', 'Distance from Earth', 'Gravitational changes', 'Hostile closed environments'],
    language: 'Language',
    voiceOn: '🔊 Voice on',
    voiceOff: '🔈 Enable voice',
    voiceTitle: 'Read future answers aloud',
    prototype: 'Prototype',
    introTitle: 'A conversation in space',
    introDescription: 'You can say hello, share a concern or ask a question. BBSM will try to follow the conversation.',
    you: 'You', notice: 'Notice', typing: 'BBSM is typing',
    welcome: 'Hello! I’m BBSM. We can talk about life on a space mission and astronaut wellbeing. You can also tell me how you’re feeling today. What’s on your mind?',
    starters: ["Hi, I'm feeling a little tired during the mission.", 'What would a typical day in space be like?', 'I’m worried about isolation during a mission.'],
    placeholder: 'Tell me something. How is your day going?',
    send: 'Send',
    inputLabel: 'Message to BBSM',
    dictate: 'Dictate message',
    stopDictation: 'Stop dictation',
    dictateTitle: 'Dictate using the microphone',
    dictateUnavailable: 'This browser does not support voice dictation',
    listening: 'I’m listening… when you finish, review the text and press Send.',
    micUnavailable: 'Speech recognition is unavailable in this browser. You can type your message.',
    micPermission: 'Allow microphone access in your browser to dictate messages.',
    micError: 'I couldn’t recognise your voice. Please try again or type your message.',
    micStartError: 'Could not start the microphone.',
    audioUnavailable: 'This browser does not support text-to-speech.',
    assistantUnavailable: 'BBSM is not available right now.',
    streamingUnavailable: 'This browser cannot receive streamed responses.',
    streamInterrupted: 'The response was interrupted. Please try again.',
    disclaimer: 'Educational chat without sensor access. Messages are kept in this tab during the session. Browser speech features may require Internet.'
  },
  de: {
    brandSubtitle: 'Gesprächsassistent für Raumfahrt',
    subtitle: 'Wir können uns unterhalten – nicht nur Fragen stellen und beantworten.',
    mission: 'MISSION · PHASE 01',
    hero: 'Reden. Entdecken. Verstehen.',
    description: 'Ein Ort für natürliche Gespräche über Wohlbefinden und die Herausforderungen des Lebens außerhalb der Erde.',
    newChat: 'Neues Gespräch',
    topicsTitle: 'MEINE THEMEN',
    topicsSubtitle: 'Gesundheit bei Weltraummissionen',
    topics: ['Weltraumstrahlung', 'Isolation und Eingeschlossensein', 'Entfernung von der Erde', 'Gravitationsveränderungen', 'Feindliche geschlossene Umgebungen'],
    language: 'Sprache',
    voiceOn: '🔊 Sprachausgabe an',
    voiceOff: '🔈 Sprachausgabe aktivieren',
    voiceTitle: 'Künftige Antworten vorlesen',
    prototype: 'Prototyp',
    introTitle: 'Ein Gespräch im Weltraum',
    introDescription: 'Du kannst mich begrüßen, von Sorgen erzählen oder eine Frage stellen. BBSM versucht, dem Gespräch zu folgen.',
    you: 'Du', notice: 'Hinweis', typing: 'BBSM schreibt',
    welcome: 'Hallo! Ich bin BBSM. Wir können über das Leben auf einer Weltraummission und die Gesundheit von Astronauten sprechen. Du kannst mir auch erzählen, wie es dir heute geht. Was beschäftigt dich?',
    starters: ['Hallo, ich fühle mich während der Mission etwas müde.', 'Wie sieht ein typischer Tag im Weltraum aus?', 'Die Isolation während einer Mission macht mir Sorgen.'],
    placeholder: 'Erzähl mir etwas. Wie läuft dein Tag?',
    send: 'Senden',
    inputLabel: 'Nachricht an BBSM',
    dictate: 'Nachricht diktieren',
    stopDictation: 'Diktat beenden',
    dictateTitle: 'Nachricht über das Mikrofon diktieren',
    dictateUnavailable: 'Dieser Browser unterstützt keine Spracheingabe',
    listening: 'Ich höre zu… überprüfe danach den Text und klicke auf Senden.',
    micUnavailable: 'Die Spracherkennung ist in diesem Browser nicht verfügbar. Du kannst deine Nachricht schreiben.',
    micPermission: 'Erlaube den Mikrofonzugriff im Browser, um Nachrichten zu diktieren.',
    micError: 'Deine Sprache konnte nicht erkannt werden. Bitte versuche es erneut oder schreibe deine Nachricht.',
    micStartError: 'Das Mikrofon konnte nicht gestartet werden.',
    audioUnavailable: 'Dieser Browser unterstützt keine Sprachausgabe.',
    assistantUnavailable: 'BBSM ist momentan nicht verfügbar.',
    streamingUnavailable: 'Dieser Browser kann keine gestreamten Antworten empfangen.',
    streamInterrupted: 'Die Antwort wurde unterbrochen. Bitte versuche es erneut.',
    disclaimer: 'Lernorientierter Chat ohne Sensorzugriff. Nachrichten bleiben während der Sitzung in diesem Tab. Browser-Sprachfunktionen können Internet benötigen.'
  }
};

const speechLanguage = { es: 'es-MX', en: 'en-US', de: 'de-DE' };

function getSavedLanguage() {
  try {
    const stored = window.sessionStorage.getItem(LANGUAGE_KEY);
    return stored && Object.hasOwn(translations, stored) ? stored : 'es';
  } catch {
    return 'es';
  }
}

function createWelcomeMessage(language) {
  return { id: 'welcome', role: 'assistant', content: translations[language].welcome };
}

function loadConversation(language) {
  try {
    const saved = JSON.parse(window.sessionStorage.getItem(STORAGE_KEY) || '[]');
    if (!Array.isArray(saved)) return [createWelcomeMessage(language)];
    const valid = saved.filter((item) =>
      item &&
      ['user', 'assistant'].includes(item.role) &&
      typeof item.content === 'string' &&
      item.content.trim() &&
      item.content.length <= 10000
    ).slice(-30);
    return [createWelcomeMessage(language), ...valid.map((item, index) => ({ ...item, id: `saved-${index}` }))];
  } catch {
    return [createWelcomeMessage(language)];
  }
}

export default function App() {
  const [language, setLanguage] = useState(getSavedLanguage);
  const [messages, setMessages] = useState(() => loadConversation(language));
  const t = translations[language];
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [readAloud, setReadAloud] = useState(false);
  const [voiceNotice, setVoiceNotice] = useState('');
  const endRef = useRef(null);
  const recognitionRef = useRef(null);
  const micAvailable = typeof window !== 'undefined' && Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
  const audioAvailable = typeof window !== 'undefined' && 'speechSynthesis' in window;

  useEffect(() => {
    document.documentElement.lang = language;
    try { window.sessionStorage.setItem(LANGUAGE_KEY, language); } catch { /* Sin persistencia si está bloqueada. */ }
  }, [language]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, loading]);

  useEffect(() => {
    if (loading) return;
    const stored = messages
      .filter((item) => item.id !== 'welcome' && ['user', 'assistant'].includes(item.role) && item.content.trim())
      .slice(-30)
      .map(({ role, content }) => ({ role, content }));
    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
    } catch {
      // El chat sigue funcionando si el navegador bloquea el almacenamiento.
    }
  }, [messages, loading]);

  useEffect(() => () => {
    recognitionRef.current?.stop();
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  }, []);

  function changeLanguage(nextLanguage) {
    if (loading || !Object.hasOwn(translations, nextLanguage)) return;
    recognitionRef.current?.stop();
    if (audioAvailable) window.speechSynthesis.cancel();
    setLanguage(nextLanguage);
    setVoiceNotice('');
    setMessages((previous) => previous.map((item) =>
      item.id === 'welcome' ? createWelcomeMessage(nextLanguage) : item
    ));
  }

  function sayOutLoud(text) {
    if (!readAloud || !audioAvailable || !text.trim()) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = speechLanguage[language];
    utterance.rate = 0.98;
    const matchingVoice = window.speechSynthesis.getVoices().find((voice) =>
      voice.lang.toLowerCase() === speechLanguage[language].toLowerCase()
    ) || window.speechSynthesis.getVoices().find((voice) =>
      voice.lang.toLowerCase().startsWith(language)
    );
    if (matchingVoice) utterance.voice = matchingVoice;
    window.speechSynthesis.speak(utterance);
  }

  async function sendMessage(customText) {
    const text = (customText ?? draft).trim();
    if (!text || loading || text.length > 1200) return;

    const history = messages
      .filter((item) => item.id !== 'welcome' && ['user', 'assistant'].includes(item.role) && item.content.trim())
      .slice(-18)
      .map(({ role, content }) => ({ role, content }));

    const userId = crypto.randomUUID();
    const replyId = crypto.randomUUID();
    setMessages((previous) => [...previous, { id: userId, role: 'user', content: text }, { id: replyId, role: 'assistant', content: '' }]);
    setDraft('');
    setVoiceNotice('');
    setLoading(true);
    let completeAnswer = '';
    let completed = false;

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history, language })
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || t.assistantUnavailable);
      }
      if (!response.body) throw new Error(t.streamingUnavailable);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      function processLine(line) {
        if (!line.trim()) return;
        const chunk = JSON.parse(line);
        if (chunk.type === 'error') throw new Error(chunk.error || 'Se interrumpió la respuesta.');
        if (chunk.type === 'done') completed = true;
        if (chunk.type === 'delta' && typeof chunk.text === 'string') {
          completeAnswer += chunk.text;
          setMessages((previous) => previous.map((item) =>
            item.id === replyId ? { ...item, content: completeAnswer } : item
          ));
        }
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';
        for (const line of lines) processLine(line);
      }
      buffer += decoder.decode();
      if (buffer.trim()) processLine(buffer);
      if (!completed || !completeAnswer.trim()) throw new Error(t.streamInterrupted);
      sayOutLoud(completeAnswer);
    } catch (error) {
      setMessages((previous) => [
        ...previous.filter((item) => item.id !== replyId),
        { id: crypto.randomUUID(), role: 'notice', content: error.message }
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    sendMessage();
  }

  function startVoiceInput() {
    setVoiceNotice('');
    if (!micAvailable) {
      setVoiceNotice(t.micUnavailable);
      return;
    }
    if (listening) {
      recognitionRef.current?.stop();
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = speechLanguage[language];
    recognition.interimResults = false;
    recognition.continuous = false;
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results).map((result) => result[0].transcript).join(' ').trim();
      if (transcript) setDraft((previous) => `${previous}${previous.trim() ? ' ' : ''}${transcript}`);
    };
    recognition.onerror = (event) => {
      setVoiceNotice(event.error === 'not-allowed'
        ? t.micPermission
        : t.micError);
    };
    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;
    try {
      recognition.start();
      setListening(true);
    } catch {
      setListening(false);
      setVoiceNotice(t.micStartError);
    }
  }

  function toggleAudio() {
    if (!audioAvailable) {
      setVoiceNotice(t.audioUnavailable);
      return;
    }
    if (readAloud) window.speechSynthesis.cancel();
    setReadAloud((previous) => !previous);
  }

  function startNewConversation() {
    if (loading) return;
    recognitionRef.current?.stop();
    if (audioAvailable) window.speechSynthesis.cancel();
    setMessages([createWelcomeMessage(language)]);
    setDraft('');
    setVoiceNotice('');
    window.sessionStorage.removeItem(STORAGE_KEY);
  }

  const isFreshChat = messages.length === 1;

  return (
    <main className="shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">B</div>
          <div><strong>BBSM</strong><span>{t.brandSubtitle}</span></div>
        </div>

        <div className="sidebar-section">
          <div className="eyebrow">{t.mission}</div>
          <h1>{t.hero}</h1>
          <p>{t.description}</p>
          <button className="new-chat" type="button" onClick={startNewConversation} disabled={loading}>
            <span aria-hidden="true">＋</span> {t.newChat}
          </button>
        </div>

        <div className="sidebar-section hazards">
          <div className="eyebrow">{t.topicsTitle}</div>
          <p>{t.topicsSubtitle}</p>
          <ol>
            {t.topics.map((topic) => <li key={topic}>{topic}</li>)}
          </ol>
        </div>

      </aside>

      <section className="chat-panel" aria-label="Conversación con BBSM">
        <header className="chat-header">
          <div className="avatar">B</div>
          <div><strong>BBSM</strong><span>{t.subtitle}</span></div>
          <div className="header-actions">
            <label className="language-picker" htmlFor="bbsm-language">
              <span>{t.language}</span>
              <select
                id="bbsm-language"
                value={language}
                onChange={(event) => changeLanguage(event.target.value)}
                disabled={loading}
              >
                <option value="es">Español</option>
                <option value="en">English</option>
                <option value="de">Deutsch</option>
              </select>
            </label>
            <button
              className={`voice-toggle ${readAloud ? 'active' : ''}`}
              type="button"
              onClick={toggleAudio}
              aria-pressed={readAloud}
              title={t.voiceTitle}
            >
              {readAloud ? t.voiceOn : t.voiceOff}
            </button>
            <span className="tag">{t.prototype}</span>
          </div>
        </header>

        <div className="messages" aria-live="polite">
          {isFreshChat && (
            <div className="intro">
              <div className="intro-icon">✦</div>
              <h2>{t.introTitle}</h2>
              <p>{t.introDescription}</p>
            </div>
          )}

          {messages.map((item) => (
            <div key={item.id} className={`message ${item.role}`}>
              <span className="message-label">
                {item.role === 'user' ? t.you : item.role === 'notice' ? t.notice : 'BBSM'}
              </span>
              <div className={`bubble ${loading && item.role === 'assistant' && !item.content ? 'typing-bubble' : ''}`}>
                {item.content || <span className="typing-dots" aria-label={t.typing}>● ● ●</span>}
              </div>
            </div>
          ))}

          {isFreshChat && (
            <div className="suggestions">
              {t.starters.map((phrase) => (
                <button type="button" key={phrase} onClick={() => sendMessage(phrase)}>{phrase}</button>
              ))}
            </div>
          )}
          <div ref={endRef} />
        </div>

        <div className="composer-wrap">
          {voiceNotice && <p className="voice-notice" role="status">{voiceNotice}</p>}
          {listening && <p className="listening" role="status">{t.listening}</p>}
          <form className="composer" onSubmit={handleSubmit}>
            <textarea
              aria-label={t.inputLabel}
              rows={1}
              value={draft}
              maxLength={1200}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
                  event.preventDefault();
                  sendMessage();
                }
              }}
              placeholder={t.placeholder}
              disabled={loading}
            />
            <button
              className={`mic-button ${listening ? 'recording' : ''}`}
              type="button"
              onClick={startVoiceInput}
              disabled={loading || !micAvailable}
              title={micAvailable ? t.dictateTitle : t.dictateUnavailable}
              aria-label={listening ? t.stopDictation : t.dictate}
            >{listening ? '■' : '🎙'}</button>
            <button className="send-button" type="submit" disabled={!draft.trim() || loading}>
              {t.send} <span aria-hidden="true">↗</span>
            </button>
          </form>
          <p className="disclaimer">{t.disclaimer}</p>
        </div>
      </section>
    </main>
  );
}
