import { NextRequest, NextResponse } from 'next/server';
import { API_URL } from '@/app/lib/config';

export async function POST(req: NextRequest) {
  const accessToken = req.headers.get('Authorization');
  if (!accessToken) {
    return NextResponse.json({ error: 'No access token provided' }, { status: 401 });
  }

  const formData = await req.formData();
  const { searchParams } = new URL(req.url);
  const limit = searchParams.get('limit') || '10'; // top-k, default 10

  try {
    const response = await fetch(
      `${API_URL}/api/v1/uploader/search?skip=0&limit=${limit}`,
      {
        method: 'POST',
        headers: {
          'Authorization': accessToken,
          'accept': 'application/json',
        },
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error('API request failed');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Search failed:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}