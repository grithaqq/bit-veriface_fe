import { NextRequest, NextResponse } from 'next/server';
import { API_URL } from '@/app/lib/config';

/**
 * GET /api/image?user_id={user_id}&filename={saved_filename}
 *
 * Proxy untuk mengambil file gambar dari backend.
 * File disimpan di backend dengan struktur folder: /upload_files/{user_id}/{saved_filename}
 * Proxy diperlukan karena API_URL menggunakan 0.0.0.0 yang tidak bisa
 * diakses langsung dari browser — hanya server-to-server yang bisa.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('user_id');
  const filename = searchParams.get('filename');

  if (!userId || !filename) {
    return NextResponse.json({ error: 'user_id and filename are required' }, { status: 400 });
  }

  // Sanitasi: hanya izinkan karakter aman
  // filename boleh mengandung '/' untuk subfolder (misal thumbnails/thumb_xxx.jpg)
  // tapi blokir path traversal (../)
  const safeUserId = userId.replace(/[^a-zA-Z0-9-]/g, '');
  const safeFilename = filename
    .replace(/\.\.\/|\.\.$/g, '')    // hapus path traversal
    .replace(/[^a-zA-Z0-9._\-\/]/g, ''); // izinkan huruf, angka, '.', '-', '_', '/'

  if (!safeUserId || !safeFilename) {
    return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
  }

  try {
    const imageUrl = `${API_URL}/upload_files/${safeUserId}/${safeFilename}`;
    const response = await fetch(imageUrl, { cache: 'no-store' });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Backend returned ${response.status}` },
        { status: response.status }
      );
    }

    const contentType = response.headers.get('content-type') ?? 'image/jpeg';
    const imageData = await response.arrayBuffer();

    return new NextResponse(imageData, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400', // cache 24 jam di browser
      },
    });
  } catch (error) {
    console.error('Image proxy failed:', error);
    return NextResponse.json({ error: 'Failed to fetch image' }, { status: 500 });
  }
}
