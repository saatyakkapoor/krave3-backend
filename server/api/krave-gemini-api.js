// server/api/krave-gemini-api.js

import { createServer } from 'http';
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

// Set mode: 'production' (Vercel) or 'testing' (local)
const mode = 'testing'; // Change to 'production' when deploying

// Main handler function (used in both modes)
async function handler(req, res) {
  if (req.method !== 'POST') {
    res.writeHead(405, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ error: 'Method Not Allowed. Use POST.' }));
  }

  try {
    let body = '';

    // Handle body parsing
    await new Promise((resolve, reject) => {
      req.on('data', chunk => (body += chunk));
      req.on('end', resolve);
      req.on('error', reject);
    });

    const data = JSON.parse(body);
    const { prompt } = data;

    if (!prompt || typeof prompt !== 'string' || prompt.trim() === '') {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'Invalid or missing "prompt".' }));
    }

    const model = google('gemini-2.5-pro-preview-03-25');

    const result = await generateText({
      model,
      messages: [{ role: 'user', content: prompt }],
      maxTokens: 8192,
      temperature: 0.7,
      topP: 0.4,
    });

    const response = {
      success: true,
      response: result.text.trim(),
    };

    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify(response));
  } catch (err) {
    console.error('[Krave Gemini Error]', err);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    return res.end(
      JSON.stringify({
        success: false,
        error: 'Internal Server Error',
        details: err.message,
      })
    );
  }
}

// ==== EXPORT OR LOCAL SERVER BASED ON MODE =====
if (mode === 'production') {
  export default handler; // Used by Vercel
} else {
  // Local testing mode
  const server = createServer((req, res) => {
    if (req.url === '/api/krave-gemini-api') {
      handler(req, res);
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Not Found' }));
    }
  });

  const PORT = 3000;
  server.listen(PORT, () => {
    console.log(`🧪 Local test server running at http://localhost:${PORT}/api/krave-gemini-api`);
  });
}
