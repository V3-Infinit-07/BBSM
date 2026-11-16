# BBSM — Asistente conversacional espacial (ES / EN / DE)

Versión para **Visual Studio Code en Windows**, con frontend React + Vite, backend Node.js + Express, e inteligencia artificial ejecutada localmente mediante Ollama. La versión incluye **solo el asistente virtual**: todavía no hay brazalete conectado, mediciones automáticas, dashboard ni base de datos.

## Cambios de esta versión

- Selector de idiomas en la esquina superior derecha: **Español, English y Deutsch**.
- Traducción de la interfaz y del mensaje inicial, y envío del idioma seleccionado al backend para que el asistente responda en ese idioma.
- Dictado y lectura de voz configurados para el idioma elegido (según compatibilidad del navegador y voces instaladas).
- Se eliminó la etiqueta «Chat conversacional» y el texto «Sin sensores conectados · Sin mediciones reales» de la esquina inferior izquierda.
- Se conserva el estilo visual y la conversación natural, enfocada en bienestar físico y psicológico durante misiones espaciales.
- Se conserva el historial de conversación al cambiar de idioma; los mensajes anteriores no se traducen automáticamente. **Nueva conversación** reinicia el historial.
- Se incluye la importación de React que evita el error `React is not defined`.

## Requisitos

- **Node.js** 22 (o una versión compatible con Vite 7).
- **Ollama para Windows** instalado y abierto, con el modelo descargado una vez:

```cmd
ollama pull qwen2.5:3b
```

## Ejecutar BBSM

1. Descomprime el ZIP y abre la carpeta **BBSM** en Visual Studio Code.
2. Abre una terminal en la carpeta `BBSM` y ejecuta:

```cmd
cd backend
npm install
npm run dev
```

El backend estará disponible en `http://127.0.0.1:3001`.

3. Abre una **segunda** terminal, también en la carpeta principal `BBSM`, y ejecuta:

```cmd
cd frontend
npm install
npm run dev
```

4. Abre `http://127.0.0.1:5173/` en Edge o Chrome. Mantén abiertas ambas terminales y Ollama.

## Probar los idiomas

Selecciona el idioma en el menú superior derecho y prueba:

- **Español:** «Hola BBSM, ¿cómo puede afectar el aislamiento al sueño de un astronauta?»
- **English:** “Hi BBSM, how can isolation affect an astronaut's sleep?”
- **Deutsch:** „Hallo BBSM, wie kann Isolation den Schlaf von Astronauten beeinflussen?“

El selector cambia interfaz, idioma de las respuestas y la preferencia del micrófono y la voz; **no traduce el historial existente**. La selección se conserva durante la sesión de la pestaña.

## Conocimiento y limitaciones

- `backend/conocimiento-inicial.md` contiene el contexto inicial del reto y se lee en cada nueva solicitud.
- Este mecanismo **no es fine-tuning ni RAG**; todavía no se han incorporado artículos completos de la NASA ni de psicología a una base documental recuperable.
- El modelo puede cometer errores. **No utilizar BBSM para diagnósticos ni decisiones médicas reales**.
- El chat no consulta sensores ni accede a mediciones reales. Los mensajes se guardan temporalmente en `sessionStorage`, no en una base de datos.
- Aunque el modelo de IA se ejecuta localmente, **el dictado del navegador puede necesitar Internet** y la lectura en voz alta requiere que exista una voz apropiada en el sistema.

## Archivos principales

```text
BBSM/
├── backend/
│   ├── index.js
│   ├── conocimiento-inicial.md
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css
│   ├── package.json
│   └── vite.config.js
└── README.md
```

