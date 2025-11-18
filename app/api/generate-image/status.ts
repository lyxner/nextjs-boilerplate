// pages/api/freepik-status.ts
import type { NextApiRequest, NextApiResponse } from 'next';

const FREEPIK_API_BASE = 'https://api.freepik.com/v1/ai/text-to-image/flux-dev';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed. Use GET.' });
  }

  const taskId = (req.query.taskId as string) || (req.query.task_id as string);

  if (!taskId) {
    return res.status(400).json({ error: 'query param taskId is required' });
  }

  const apiKey = process.env.FREEPIK_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Missing FREEPIK_API_KEY in server env' });
  }

  try {
    const getResp = await fetch(`${FREEPIK_API_BASE}/${taskId}`, {
      method: 'GET',
      headers: {
        'x-freepik-api-key': apiKey,
      },
    });

    const text = await getResp.text();
    try {
      const json = text ? JSON.parse(text) : {};
      return res.status(getResp.ok ? 200 : getResp.status).json(json);
    } catch {
      return res.status(500).json({ error: 'Non-JSON response from Freepik', raw: text });
    }
  } catch (err: any) {
    return res.status(500).json({ error: err?.message ?? 'Unknown error' });
  }
}
