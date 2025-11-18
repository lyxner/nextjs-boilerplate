import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const prompt = body.prompt as string;

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt tidak boleh kosong.' }, { status: 400 });
    }

    const apiKey = process.env.FREEPIK_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'API key Freepik tidak dikonfigurasi.' }, { status: 500 });
    }

    const url = 'https://api.freepik.com/v1/ai/mystic';  // endpoint sesuai dokumentasi Freepik Mystic :contentReference[oaicite:0]{index=0}

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-freepik-api-key': apiKey,
      },
      body: JSON.stringify({
        prompt: prompt,
        // Parameter opsional, sesuai dokumentasi Freepik Mystic :contentReference[oaicite:1]{index=1}
        aspect_ratio: body.aspect_ratio,
        resolution: body.resolution,
        model: body.model,
        creative_detailing: body.creative_detailing,
        engine: body.engine,
        fixed_generation: body.fixed_generation,
        filter_nsfw: body.filter_nsfw,
        styling: body.styling,
        // Jika kamu mau juga webhook: body.webhook_url
      }),
    });

    const text = await res.text();
    let data: any;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error('Gagal parse JSON dari Freepik API:', text);
      return NextResponse.json({ error: 'Respons tidak valid dari Freepik API' }, { status: 502 });
    }

    if (!res.ok) {
      const msg = data.error?.message || `Freepik API error: ${res.status}`;
      return NextResponse.json({ error: msg }, { status: res.status });
    }

    // Struktur respons Freepik ketika membuat task: data.data.generated, data.data.task_id, data.data.status :contentReference[oaicite:2]{index=2}
    const images: string[] = [];
    if (data.data?.generated && Array.isArray(data.data.generated)) {
      for (const imgUrl of data.data.generated) {
        images.push(imgUrl);
      }
    }

    // Return juga task_id & status agar bisa polling status jika diperlukan
    return NextResponse.json({
      images,
      taskId: data.data?.task_id,
      status: data.data?.status,
    });
  } catch (err: any) {
    console.error('Error di Freepik-generate route:', err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
