// pages/api/upload.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import axios from 'axios';
import FormData from 'form-data';

// Nonaktifkan bodyParser Next.js agar formidable parse multipart
export const config = {
  api: {
    bodyParser: false,
  },
};

// Utility parse form-data dengan Promise
function parseForm(req: NextApiRequest): Promise<{
  fields: Record<string, any>;
  files: Record<string, any>;
}> {
  const form = new formidable.IncomingForm({
    maxFileSize: 10 * 1024 * 1024, // limit 10MB
  });
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        console.error('Error parseForm:', err);
        reject(err);
      } else {
        resolve({ fields: fields as Record<string, any>, files: files as Record<string, any> });
      }
    });
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('>>> API upload dipanggil, method:', req.method);
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ status: 'error', message: 'Method tidak diizinkan' });
  }

  let tempFilePath: string | null = null;
  try {
    const { files } = await parseForm(req);
    const fileField = files.image;
    if (!fileField) {
      return res.status(400).json({ status: 'error', message: 'Field "image" tidak ditemukan' });
    }
    const fileEntry = Array.isArray(fileField) ? fileField[0] : fileField;
    tempFilePath = fileEntry.filepath;
    console.log('Temp file path:', tempFilePath);
    if (!tempFilePath) {
      return res.status(500).json({ status: 'error', message: 'Path file temporer tidak tersedia' });
    }

    const user = process.env.SIGHTENGINE_USER;
    const secret = process.env.SIGHTENGINE_SECRET;
    if (!user || !secret) {
      console.error('Env var SIGHTENGINE_USER/SECRET belum di-set');
      fs.unlink(tempFilePath, () => {});
      return res.status(500).json({ status: 'error', message: 'Server belum dikonfigurasi API key' });
    }

    const formData = new FormData();
    formData.append('media', fs.createReadStream(tempFilePath));
    formData.append('models', 'genai');
    formData.append('api_user', user);
    formData.append('api_secret', secret);

    let sightResponse;
    try {
      sightResponse = await axios.post(
        'https://api.sightengine.com/1.0/check.json',
        formData,
        {
          headers: { ...formData.getHeaders() },
          timeout: 20000,
        }
      );
      console.log('Response dari Sightengine diterima');
    } catch (axiosErr) {
      console.error('Error panggil Sightengine:', axiosErr);
      fs.unlink(tempFilePath, () => {});
      return res.status(500).json({ status: 'error', message: 'Gagal menghubungi layanan deteksi AI' });
    }

    // Hapus temp file setelah selesai
    fs.unlink(tempFilePath, (err) => {
      if (err) console.warn('Gagal hapus temp file:', err);
    });

    return res.status(200).json({ status: 'success', data: sightResponse.data });
  } catch (err: any) {
    console.error('Exception di API handler:', err);
    if (tempFilePath) {
      fs.unlink(tempFilePath, () => {});
    }
    return res.status(500).json({ status: 'error', message: 'Server error saat upload/analisis' });
  }
}
