import { NextRequest, NextResponse } from 'next/server';
import { API_URL } from '@/app/lib/config';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Get the access token from the Authorization header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No access token provided' }, { status: 401 });
    }
    const accessToken = authHeader.split(' ')[1];

    // Create a new FormData instance for the external API request
    const apiFormData = new FormData();
    apiFormData.append('file', file);

    // Make the request to the external API
    const apiResponse = await fetch(`${API_URL}/api/v1/uploader/upload`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: apiFormData,
    });

    if (!apiResponse.ok) {
      throw new Error(`API responded with status: ${apiResponse.status}`);
    }

    const apiResult = await apiResponse.json();

    return NextResponse.json(apiResult);
  } catch (error) {
    console.error('Upload failed:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}