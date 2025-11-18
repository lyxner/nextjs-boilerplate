import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const form = await request.formData();
    const prompt = form.get('prompt')?.toString();
    const mode = form.get('mode')?.toString();
    const imageFile = form.get('image');

    if (!prompt || !prompt.trim()) {
      return NextResponse.json({ error: 'Prompt tidak boleh kosong.' }, { status: 400 });
    }

    const apiKey = process.env.GENERATIVE_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'API key belum dikonfigurasi.' }, { status: 500 });
    }

    // Model generasi gambar menurut dokumentasi Gemini
    const model = 'gemini-2.5-flash-image';

    // Mempersiapkan payload
    const payload: any = {
      model,
      contents: [
        {
          parts: [
            { text: prompt },
          ],
        },
      ],
      config: {
        responseModalities: ['TEXT', 'IMAGE'], // dari dokumentasi
      },
    };

    // Jika mode img2img (edit gambar), tambahkan image sebagai base64
    if (mode === 'img2img' && imageFile instanceof File) {
      const buffer = await imageFile.arrayBuffer();
      const base64 = Buffer.from(buffer).toString('base64');
      payload.image = base64;
    }

    // Panggil API Gemini via REST
    const apiRes = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': apiKey, // sesuai dokumentasi REST Gemini :contentReference[oaicite:2]{index=2}
        },
        body: JSON.stringify(payload),
      }
    );

    const status = apiRes.status;
    const text = await apiRes.text();
    let apiData: any;
    try {
      apiData = JSON.parse(text);
    } catch (e: any) {
      console.error('Parse JSON gagal dari Gemini:', e, text);
      return NextResponse.json({ error: 'Respons tidak valid dari Google API' }, { status: 502 });
    }

    if (!apiRes.ok) {
      const msg = apiData.error?.message ?? `API Error ${status}`;
      return NextResponse.json({ error: msg }, { status });
    }

    // Ambil bagian image dari response
    const parts = apiData.parts ?? apiData.candidates?.[0]?.parts;
    const images: string[] = [];

    if (parts && Array.isArray(parts)) {
      for (const part of parts) {
        if (part.inlineData) {
          // inlineData biasanya base64
          const raw = part.inlineData.data;
          images.push(`data:image/png;base64,${raw}`);
        }
      }
    }

    return NextResponse.json({ images });
  } catch (err: any) {
    console.error('Error route generate-image:', err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
