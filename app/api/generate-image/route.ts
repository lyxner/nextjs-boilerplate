// app/api/generate-image/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI, Modality } from '@google/genai';

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Prompt is required.' }, { status: 400 });
    }

    const apiKey = process.env.GENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured.' }, { status: 500 });
    }

    // Inisialisasi Google Gen AI client
    const ai = new GoogleGenAI({ apiKey });

    // Panggil Gemini image generation: generateContent dengan responseModalities TEXT+IMAGE
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-preview-image-generation',
      contents: [
        { text: prompt }
      ],
      config: {
        responseModalities: [Modality.TEXT, Modality.IMAGE],
      },
    });

    // response.candidates[0].content.parts adalah array part:
    // - part.text mungkin berisi deskripsi
    // - part.inlineData.data adalah base64 string image
    const candidate = response.candidates?.[0];
    if (!candidate || !candidate.content || !Array.isArray(candidate.content.parts)) {
      return NextResponse.json({ error: 'Invalid response from Gemini API.' }, { status: 502 });
    }

    // Kumpulkan semua image data
    const imageDataUrls: string[] = [];
    for (const part of candidate.content.parts) {
      if (part.inlineData && part.inlineData.data) {
        // data adalah base64 string
        // Anda bisa memeriksa part.inlineData.mimeType jika tersedia. Biasanya "image/png".
        const mimeType = part.inlineData.mimeType || 'image/png';
        const b64 = part.inlineData.data;
        // Buat data URL agar client dapat menampilkan:
        const dataUrl = `data:${mimeType};base64,${b64}`;
        imageDataUrls.push(dataUrl);
      }
    }

    if (imageDataUrls.length === 0) {
      return NextResponse.json({ error: 'No image data returned.' }, { status: 502 });
    }

    // Kembalikan hasil ke client
    return NextResponse.json({ images: imageDataUrls });
  } catch (err: any) {
    console.error('Error in /api/generate-image:', err);
    return NextResponse.json({ error: err.message || 'Unknown error' }, { status: 500 });
  }
}
