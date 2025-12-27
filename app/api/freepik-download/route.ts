// app/api/freepik-download/route.ts
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const resourceId = url.searchParams.get('resourceId');
    const imageUrl = url.searchParams.get('imageUrl');
    const filename = url.searchParams.get('filename') || 'download.png';

    // Enforce that user accepted license (client must send this header)
    const licenseHeader = req.headers.get('x-accept-license');
    if (licenseHeader !== '1') {
      return NextResponse.json({ error: 'License not accepted' }, { status: 403 });
    }

    if (!resourceId && !imageUrl) {
      return NextResponse.json({ error: 'resourceId or imageUrl required' }, { status: 400 });
    }

    let upstreamResp: Response;

    if (resourceId) {
      // Preferred: call Freepik's download endpoint so Freepik records the download.
      // (Requires your server-side FREEPIK_API_KEY in env)
      const freepikUrl = `https://api.freepik.com/v1/resources/${encodeURIComponent(resourceId)}/download`;
      upstreamResp = await fetch(freepikUrl, {
        method: 'GET',
        headers: {
          'x-freepik-api-key': process.env.FREEPIK_API_KEY ?? '',
        },
      });
    } else {
      // Fallback: fetch the actual image URL (public CDN). Use caution: this does not
      // notify Freepik's API that a download occurred.
      upstreamResp = await fetch(imageUrl!, { method: 'GET' });
    }

    if (!upstreamResp.ok) {
      const txt = await upstreamResp.text();
      return NextResponse.json({ error: 'Upstream fetch failed', detail: txt }, { status: upstreamResp.status });
    }

    const arrayBuffer = await upstreamResp.arrayBuffer();
    const contentType = upstreamResp.headers.get('content-type') || 'application/octet-stream';
    const contentDisposition = upstreamResp.headers.get('content-disposition') || `attachment; filename="${filename}"`;

    const headers: Record<string, string> = {
      'Content-Type': contentType,
      'Content-Disposition': contentDisposition,
    };

    return new Response(arrayBuffer, { status: 200, headers });
  } catch (err: any) {
    console.error('freepik-download proxy error', err);
    return NextResponse.json({ error: 'Server error', detail: err?.message ?? String(err) }, { status: 500 });
  }
}
