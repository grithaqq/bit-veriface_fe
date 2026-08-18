import { NextRequest, NextResponse } from 'next/server';
import { API_URL } from '@/app/lib/config';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'No access token provided' }, { status: 401 });
  }

  try {
    const response = await fetch(`${API_URL}/api/v1/menu`, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'accept': 'application/json',
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch menu' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Menu fetch failed:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
