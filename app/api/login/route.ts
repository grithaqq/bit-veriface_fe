import { NextResponse } from 'next/server';
import { API_URL } from '@/app/lib/config';

export async function POST(request: Request) {
  const formData = await request.formData();
  const username = formData.get('username');
  const password = formData.get('password');

  // Construct the form data to send to the external API
  const externalFormData = new URLSearchParams();
  externalFormData.append('grant_type', 'password');
  externalFormData.append('username', username as string);
  externalFormData.append('password', password as string);
  externalFormData.append('scope', '');
  externalFormData.append('client_id', 'string');
  externalFormData.append('client_secret', 'string');

  try {
    const response = await fetch(`${API_URL}/api/v1/login/access-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'accept': 'application/json'
      },
      body: externalFormData
    });

    if (response.ok) {
      const data = await response.json();
      return NextResponse.json(data);
    } else {
      return NextResponse.json({ error: 'Login failed' }, { status: 400 });
    }
  } catch (error) {
    console.error('An error occurred:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}