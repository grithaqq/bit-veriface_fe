import { NextRequest, NextResponse } from 'next/server';
import { API_URL } from '@/app/lib/config';

/**
 * GET /api/files?skip=&limit=
 * Proxy ke /api/v1/uploader/files — hanya file milik user yang sedang login.
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'No access token provided' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const skip = searchParams.get('skip') || '0';
  const limit = searchParams.get('limit') || '15';

  try {
    const response = await fetch(
      `${API_URL}/api/v1/uploader/files?skip=${skip}&limit=${limit}`,
      {
        method: 'GET',
        headers: {
          'Authorization': authHeader,
          'accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch files' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Files fetch failed:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * DELETE /api/files?id=
 * Proxy ke /api/v1/uploader/file/{id}
 */
export async function DELETE(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'No access token provided' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'No id provided' }, { status: 400 });
  }

  try {
    const response = await fetch(
      `${API_URL}/api/v1/uploader/file/${id}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': authHeader,
          'accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to delete file' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('File delete failed:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
