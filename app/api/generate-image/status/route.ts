// app/api/generate-image/status/route.ts
import { NextResponse } from 'next/server';

const FREEPIK_API_BASE = 'https://api.freepik.com/v1/ai/text-to-image/flux-dev';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const taskId = url.searchParams.get('taskId') || url.searchParams.get('task_id');

  if (!taskId) {
    return NextResponse.json({ error: 'Query param taskId diperlukan' }, { status: 400 });
  }

  const apiKey = process.env.FREEPIK_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'FREEPIK_API_KEY tidak ditemukan di env' }, { status: 500 });
  }

  try {
    const getResp = await fetch(`${FREEPIK_API_BASE}/${taskId}`, {
      method: 'GET',
      headers: {
        'x-freepik-api-key': apiKey,
      },
    });

    const text = await getResp.text();
    console.log('Freepik status fetch', getResp.status, text);

    try {
      const json = text ? JSON.parse(text) : {};
      return NextResponse.json(json, { status: getResp.ok ? 200 : getResp.status });
    } catch {
      return NextResponse.json({ error: 'Non-JSON response from Freepik', raw: text }, { status: 500 });
    }
  } catch (err: any) {
    console.error('Status handler error', err);
    return NextResponse.json({ error: err?.message ?? 'Unknown error' }, { status: 500 });
  }
}
