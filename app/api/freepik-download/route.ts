// app/api/freepik-download/route.ts
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    // logging supaya jelas muncul di Vercel logs
    const headersObj = Object.fromEntries(req.headers.entries());
    console.log('FREEPIK-DOWNLOAD POST called, headers:', headersObj);

    const body = await req.json();
    const imageUrl = body?.imageUrl;
    const resourceId = body?.resourceId;
    const filename = body?.filename ?? 'image.png';

    if (!imageUrl && !resourceId) {
      console.log('FREEPIK-DOWNLOAD missing imageUrl/resourceId');
      return NextResponse.json({ error: 'imageUrl or resourceId required' }, { status: 400 });
    }

    // jika resourceId tersedia dan kamu punya akses ke endpoint resources/download
    if (resourceId) {
      const downloadUrl = `https://api.freepik.com/v1/resources/${encodeURIComponent(resourceId)}/download`;
      console.log('FREEPIK-DOWNLOAD using resourceId ->', resourceId);
      const upstream = await fetch(downloadUrl, {
        headers: {
          'x-freepik-api-key': process.env.FREEPIK_API_KEY ?? '',
        },
      });

      if (!upstream.ok) {
        const txt = await upstream.text();
        console.log('FREEPIK-DOWNLOAD upstream error (resourceId):', upstream.status, txt);
        return NextResponse.json({ error: 'upstream failed', detail: txt }, { status: upstream.status });
      }

      const arrayBuffer = await upstream.arrayBuffer();
      return new Response(arrayBuffer, {
        status: 200,
        headers: {
          'Content-Type': upstream.headers.get('content-type') ?? 'application/octet-stream',
          'Content-Disposition': `attachment; filename="${filename}"`,
        },
      });
    }

    // fallback: fetch langsung dari imageUrl (CDN)
    console.log('FREEPIK-DOWNLOAD fetching imageUrl:', imageUrl);
    const upstreamRes = await fetch(imageUrl as string);
    if (!upstreamRes.ok) {
      const txt = await upstreamRes.text();
      console.log('FREEPIK-DOWNLOAD upstream error (imageUrl):', upstreamRes.status, txt);
      return NextResponse.json({ error: 'unable to fetch image', details: txt }, { status: upstreamRes.status });
    }

    const arrayBuffer = await upstreamRes.arrayBuffer();
    return new Response(arrayBuffer, {
      status: 200,
      headers: {
        'Content-Type': upstreamRes.headers.get('content-type') ?? 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (err: any) {
    console.error('FREEPIK-DOWNLOAD exception', err);
    return NextResponse.json({ error: 'Server error', message: err.message }, { status: 500 });
  }
}

// optional GET fallback (masih disediakan kalau perlu)
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const imageUrl = url.searchParams.get('imageUrl');
    const filename = url.searchParams.get('filename') ?? 'image.png';
    if (!imageUrl) return NextResponse.json({ error: 'imageUrl required' }, { status: 400 });

    console.log('FREEPIK-DOWNLOAD GET fallback fetching:', imageUrl);
    const upstream = await fetch(imageUrl);
    if (!upstream.ok) {
      const txt = await upstream.text();
      console.log('FREEPIK-DOWNLOAD GET upstream error:', upstream.status, txt);
      return NextResponse.json({ error: 'upstream failed', detail: txt }, { status: upstream.status });
    }

    const arrayBuffer = await upstream.arrayBuffer();
    return new Response(arrayBuffer, {
      status: 200,
      headers: {
        'Content-Type': upstream.headers.get('content-type') ?? 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (err: any) {
    console.error('FREEPIK-DOWNLOAD GET exception', err);
    return NextResponse.json({ error: 'Server error', message: err.message }, { status: 500 });
  }
}
