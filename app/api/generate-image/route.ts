// app/api/generate-image/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI, Modality } from '@google/genai';

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || '';

    // Inisialisasi API key
    const apiKey = process.env.GENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured.' }, { status: 500 });
    }
    const ai = new GoogleGenAI({ apiKey });

    let prompt: string = '';
    let mode: 'text2img' | 'img2img' = 'text2img';
    let inputImageBase64: string | null = null;
    let inputImageMime: string | null = null;

    if (contentType.includes('multipart/form-data')) {
      // Mode image + text: formData with fields prompt, mode, image file
      const formData = await request.formData();
      const p = formData.get('prompt');
      prompt = typeof p === 'string' ? p : '';
      const m = formData.get('mode');
      mode = m === 'img2img' ? 'img2img' : 'text2img';

      if (mode === 'img2img') {
        const file = formData.get('image');
        if (!file || !(file instanceof File)) {
          return NextResponse.json({ error: 'Image file is required for image-to-image mode.' }, { status: 400 });
        }
        // Baca file menjadi base64
        const arrayBuffer = await file.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        // Convert to base64
        const b64 = Buffer.from(uint8Array).toString('base64');
        inputImageBase64 = b64;
        // Tentukan MIME type, misalnya file.type
        inputImageMime = file.type || 'image/png';
      }
    } else {
      // Asumsikan application/json body untuk text2img
      const data = await request.json();
      prompt = typeof data.prompt === 'string' ? data.prompt : '';
      mode = data.mode === 'img2img' ? 'img2img' : 'text2img';
      if (mode === 'img2img') {
        // Jika ingin JSON-based image input (misalnya base64 di JSON), 
        // tetapi di frontend kita gunakan multipart/form-data. 
        return NextResponse.json({ error: 'Image-to-image mode requires multipart/form-data.' }, { status: 400 });
      }
    }

    if (!prompt.trim()) {
      return NextResponse.json({ error: 'Prompt tidak boleh kosong.' }, { status: 400 });
    }

    // Siapkan konten untuk generateContent
    // Untuk text2img: hanya prompt text
    // Untuk img2img: pertama inlineData gambar, lalu prompt text
    let contents: any[] = [];
    if (mode === 'img2img' && inputImageBase64 && inputImageMime) {
      // Struktur content part untuk image input; Gen AI SDK mungkin mendukung inlineData
      contents.push({
        inlineData: {
          data: inputImageBase64,
          mimeType: inputImageMime,
        },
      });
      // Setelah gambar input, tambahkan prompt text
      contents.push({ text: prompt });
    } else {
      // text2img
      contents.push({ text: prompt });
    }

    // Panggil Gemini API
    const response = await ai.models.generateContent({
      // Model image generation yang mendukung multimodal
      model: 'gemini-2.0-flash-preview-image-generation',
      contents: contents,
      config: {
        // Minta image output (dan teks jika ada)
        responseModalities: [Modality.TEXT, Modality.IMAGE],
      },
    });

    // Ambil candidate pertama
    const candidate = response.candidates?.[0];
    if (!candidate || !candidate.content || !Array.isArray(candidate.content.parts)) {
      return NextResponse.json({ error: 'Invalid response from Gemini API.' }, { status: 502 });
    }

    // Kumpulkan semua image data
    const imageDataUrls: string[] = [];
    for (const part of candidate.content.parts) {
      if (part.inlineData && part.inlineData.data) {
        const mimeType = part.inlineData.mimeType || 'image/png';
        const b64 = part.inlineData.data;
        const dataUrl = `data:${mimeType};base64,${b64}`;
        imageDataUrls.push(dataUrl);
      }
    }
    if (imageDataUrls.length === 0) {
      return NextResponse.json({ error: 'No image data returned.' }, { status: 502 });
    }

    // Jika ada teks output (misalnya deskripsi), bisa diambil jika perlu:
    // const texts: string[] = [];
    // for (const part of candidate.content.parts) {
    //   if (part.text) texts.push(part.text);
    // }

    return NextResponse.json({ images: imageDataUrls });
  } catch (err: any) {
    console.error('Error in /api/generate-image:', err);
    return NextResponse.json({ error: err.message || 'Unknown error' }, { status: 500 });
  }
}
