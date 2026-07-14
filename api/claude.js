// Vercel Serverless Function — proxies requests to the Anthropic API.
// Keeps your ANTHROPIC_API_KEY secret on the server; the browser never sees it.
//
// Setup:
//  1. In your Vercel project settings → Environment Variables, add:
//     ANTHROPIC_API_KEY = sk-ant-xxxxxxxxxxxxxxxx
//  2. Redeploy. The frontend calls /api/claude instead of api.anthropic.com directly.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    res.status(500).json({
      error: 'ANTHROPIC_API_KEY is not configured on the server. Add it in Vercel → Project Settings → Environment Variables.',
    });
    return;
  }

  try {
    const { model, max_tokens, messages } = req.body;

    const upstream = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: model || 'claude-sonnet-4-6',
        max_tokens: max_tokens || 1000,
        messages,
      }),
    });

    const data = await upstream.json();
    res.status(upstream.status).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Proxy request failed', detail: String(err) });
  }
}
