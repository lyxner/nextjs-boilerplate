// app/api/generate-image/route.ts
import { NextResponse } from 'next/server';

const FREEPIK_API_BASE = 'https://api.freepik.com/v1/ai/text-to-image/flux-dev';

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const { prompt, aspect_ratio } = body ?? {};

  if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
    return NextResponse.json({ error: 'Prompt tidak boleh kosong.' }, { status: 400 });
  }

  const apiKey = process.env.FREEPIK_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'Server misconfigured: FREEPIK_API_KEY tidak ditemukan di env.' },
      { status: 500 }
    );
  }

  try {
    // create task
    const createResp = await fetch(FREEPIK_API_BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-freepik-api-key': apiKey,
      },
      body: JSON.stringify({ prompt, ...(aspect_ratio ? { aspect_ratio } : {}) }),
    });

    const text = await createResp.text();
    console.log('Freepik create status:', createResp.status, 'body:', text);

    let createJson: any;
    try { createJson = text ? JSON.parse(text) : {}; } catch { createJson = { raw: text }; }

    if (!createResp.ok) {
      return NextResponse.json(
        {
          error: createJson.error ?? `Freepik API error: ${createResp.status}`,
          freepikStatus: createResp.status,
          freepikBody: createJson,
        },
        { status: createResp.status }
      );
    }

    const taskId = createJson?.data?.task_id ?? createJson?.task_id ?? null;
    let status = createJson?.data?.status ?? createJson?.status ?? 'CREATED';
    let images: string[] = [];

    // polling singkat (serverless-friendly best-effort)
    if (taskId) {
      const maxAttempts = 12;
      const delayMs = 1500;
      for (let i = 0; i < maxAttempts; i++) {
        await sleep(delayMs);
        try {
          const getResp = await fetch(`${FREEPIK_API_BASE}/${taskId}`, {
            method: 'GET',
            headers: { 'x-freepik-api-key': apiKey },
          });
          const gText = await getResp.text();
          console.log('Freepik poll', getResp.status, gText);
          let getJson;
          try { getJson = gText ? JSON.parse(gText) : {}; } catch { getJson = { raw: gText }; }

          const data = getJson?.data ?? getJson;
          status = data?.status ?? status;
          images =
            Array.isArray(data?.generated) ? data.generated :
            Array.isArray(data?.images) ? data.images :
            Array.isArray(getJson?.generated) ? getJson.generated : [];

          if (images.length > 0 || status === 'COMPLETED' || status === 'FAILED') break;
        } catch (e) {
          console.warn('Polling error', e);
        }
      }
    }

    return NextResponse.json({ task_id: taskId, status, images }, { status: 200 });
  } catch (err: any) {
    console.error('Handler error', err);
    return NextResponse.json({ error: err?.message ?? 'Unknown server error' }, { status: 500 });
  }
}
