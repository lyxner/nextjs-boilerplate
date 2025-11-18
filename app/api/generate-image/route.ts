// pages/api/freepik-generate.ts
import type { NextApiRequest, NextApiResponse } from 'next';

const FREEPIK_API_BASE = 'https://api.freepik.com/v1/ai/text-to-image/flux-dev';

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  const { prompt, aspect_ratio } = req.body ?? {};

  if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
    return res.status(400).json({ error: 'Prompt tidak boleh kosong.' });
  }

  const apiKey = process.env.FREEPIK_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error:
        'Server misconfigured: missing FREEPIK_API_KEY. Set it in your environment (Vercel Environment Variables).',
    });
  }

  try {
    // 1) Create task
    const createResp = await fetch(FREEPIK_API_BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-freepik-api-key': apiKey,
      },
      body: JSON.stringify({
        prompt,
        ...(aspect_ratio ? { aspect_ratio } : {}),
      }),
    });

    // parse safely
    const createJson = await (async () => {
      const txt = await createResp.text();
      try {
        return txt ? JSON.parse(txt) : {};
      } catch {
        return { rawText: txt };
      }
    })();

    if (!createResp.ok) {
      return res.status(createResp.status).json({
        error: createJson?.error ?? `Freepik API error: ${createResp.status}`,
        details: createJson,
      });
    }

    // get task id & initial status
    const taskId = createJson?.data?.task_id ?? createJson?.task_id ?? null;
    let status = createJson?.data?.status ?? createJson?.status ?? 'CREATED';

    // 2) Poll briefly for completed images (best-effort — serverless functions have time limits)
    const maxAttempts = 12; // ~12 attempts
    const delayMs = 1500; // 1.5s between attempts (total ~18s)
    let images: string[] = [];

    if (taskId) {
      for (let i = 0; i < maxAttempts; i++) {
        await sleep(delayMs);

        try {
          const getResp = await fetch(`${FREEPIK_API_BASE}/${taskId}`, {
            method: 'GET',
            headers: {
              'x-freepik-api-key': apiKey,
            },
          });

          const getJson = await (async () => {
            const txt = await getResp.text();
            try {
              return txt ? JSON.parse(txt) : {};
            } catch {
              return { rawText: txt };
            }
          })();

          const data = getJson?.data ?? getJson;
          status = data?.status ?? status;

          // docs show generated[] or generated field; sometimes "generated" or "generated" inside data
          images =
            Array.isArray(data?.generated) && data.generated.length > 0
              ? data.generated
              : Array.isArray(data?.images) && data.images.length > 0
              ? data.images
              : Array.isArray(getJson?.generated) && getJson.generated.length > 0
              ? getJson.generated
              : [];

          // if images found or status is final, break
          if (images.length > 0 || status === 'COMPLETED' || status === 'FAILED') {
            break;
          }
        } catch (e) {
          // continue polling; don't crash on transient errors
          console.warn('Polling error', e);
        }
      }
    }

    return res.status(200).json({
      task_id: taskId,
      status,
      images,
    });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: err?.message ?? 'Unknown server error' });
  }
}
