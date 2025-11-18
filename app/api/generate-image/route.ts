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

    // Endpoint Freepik AI generation (misalnya model "mystic")
    const url = 'https://api.freepik.com/v1/ai/mystic';

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-freepik-api-key': apiKey,
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        prompt: prompt,
        // Opsi lain bisa disertakan sesuai dokumentasi Freepik API, misal aspect_ratio
        // contoh: "aspect_ratio": "widescreen_16_9"
        ...(body.aspect_ratio && { aspect_ratio: body.aspect_ratio }),
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

    // Freepik API generasi gambar: misal respons berisi `image` base64 atau URL gambar
    // Sesuaikan dengan dokumentasi Freepik response
    const images: string[] = [];
    // Asumsi respons: { "data": { "image": "<base64>" } } atau bisa berbeda
    if (data.data?.image) {
      images.push(data.data.image);
    } else if (Array.isArray(data.data?.images)) {
      for (const img of data.data.images) {
        images.push(img);
      }
    }

    return NextResponse.json({ images });
  } catch (err: any) {
    console.error('Error di Freepik-generate route:', err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
