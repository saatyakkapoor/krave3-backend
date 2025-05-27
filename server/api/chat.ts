import 'dotenv/config';
import { createServer, IncomingMessage, ServerResponse } from 'http';
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

const mode = 'testing'; // switch to 'production' when deploying on Vercel

async function handler(req: IncomingMessage, res: ServerResponse): Promise<void> {
  if (req.method !== 'POST') {
    res.writeHead(405, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Method Not Allowed. Use POST.' }));
    return;
  }

  try {
    let body = '';

    await new Promise<void>((resolve, reject) => {
      req.on('data', (chunk: Buffer) => (body += chunk.toString()));
      req.on('end', resolve);
      req.on('error', reject);
    });

    if (!body) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Empty request body' }));
      return;
    }

    let data: { prompt?: string };
    try {
      data = JSON.parse(body);
    } catch (parseError) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Invalid JSON format' }));
      return;
    }

    const { prompt } = data;

    if (!prompt || typeof prompt !== 'string' || prompt.trim() === '') {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Missing or invalid "prompt" in request body.' }));
      return;
    }

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Google Generative AI API key is missing in environment variables.' }));
      return;
    }

    const model = google('gemini-2.0-flash-lite', {
      apiKey,
    });

    const result = await generateText({
      model,
      messages: [{ role: 'user', content: prompt }],
      maxTokens: 8192,
      temperature: 0.7,
      topP: 0.4,
    });

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, response: result.text.trim() }));
  } catch (err: any) {
    console.error('[Gemini API Error]', err);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: false, error: err?.message || 'Unknown error' }));
  }
}

if (mode === 'production') {
  module.exports = handler;
} else {
  const PORT = 3001;

  const server = createServer((req: IncomingMessage, res: ServerResponse) => {
    if (req.url === '/api/krave-gemini-api') {
      handler(req, res);
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Not Found' }));
    }
  });

  server.listen(PORT, () => {
    console.log(`🧪 Local test server running at http://localhost:${PORT}/api/krave-gemini-api`);
  });

  server.on('error', (err: NodeJS.ErrnoException) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`❌ Port ${PORT} is already in use. Close other processes or try a different port.`);
    } else {
      console.error('❌ Server error:', err);
    }
    process.exit(1);
  });
}
