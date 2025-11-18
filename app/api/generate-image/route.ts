import { NextRequest, NextResponse } from 'next/server';

const FREEPIK_URL = 'https://api.freepik.com/v1/ai/mystic';

async function getTaskStatus(taskId: string, apiKey: string) {
  const url = `${FREEPIK_URL}/${taskId}`;
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'x-freepik-api-key': apiKey,
      'Accept': 'application/json'
    }
  });
  const text = await res.text();
  const data = JSON.parse(text);
  return data;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const prompt = body.prompt as string;
    const aspectRatio = body.aspect_ratio;

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt tidak boleh kosong.' }, { status: 400 });
    }

    const apiKey = process.env.FREEPIK_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'API key Freepik tidak dikonfigurasi.' }, { status: 500 });
    }

    // Kirim request initiator
    const res = await fetch(FREEPIK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-freepik-api-key': apiKey,
      },
      body: JSON.stringify({
        prompt,
        aspect_ratio: aspectRatio,
      }),
    });

    const text = await res.text();
    const initData = JSON.parse(text);

    if (!res.ok) {
      const msg = initData.error?.message ?? `Freepik API error: ${res.status}`;
      return NextResponse.json({ error: msg }, { status: res.status });
    }

    const taskId = initData.data?.task_id;
    let status = initData.data?.status;
    let images: string[] = [];

    // Polling sampai status selesai (max retry)
    const MAX_POLL = 10;
    const INTERVAL = 3000; // 3 detik

    for (let i = 0; i < MAX_POLL; i++) {
      await new Promise(r => setTimeout(r, INTERVAL));
      const task = await getTaskStatus(taskId, apiKey);
      status = task.data?.status;
      if (status === 'COMPLETED') {
        if (Array.isArray(task.data.generated)) {
          images = task.data.generated;
        }
        break;
      } else if (status === 'FAILED') {
        break;
      }
    }

    return NextResponse.json({ images, taskId, status });
  } catch (err: any) {
    console.error('Error Freepik-generate:', err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
