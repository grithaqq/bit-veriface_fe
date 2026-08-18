'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMenu } from '@/app/context/MenuContext';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { fetchMenu } = useMenu();

  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');
    const storedNav = localStorage.getItem('menu_navigation');
    if (accessToken && storedNav) {
      const nav = JSON.parse(storedNav);
      router.push(nav[0]?.path ?? '/dashboard');
    } else {
      setIsLoading(false);
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        setErrorMsg('Username atau password salah.');
        return;
      }

      const data = await response.json();
      const token = data.access_token;

      localStorage.setItem('access_token', token);
      localStorage.setItem('token_type', data.token_type);
      // Simpan ke cookie agar middleware bisa baca (auth guard)
      document.cookie = `access_token=${token}; path=/; SameSite=Lax`;

      // Fetch menu sesuai role, lalu redirect ke halaman pertama
      await fetchMenu(token);

      const storedNav = localStorage.getItem('menu_navigation');
      const nav = storedNav ? JSON.parse(storedNav) : [];
      const redirectPath = nav[0]?.path ?? '/dashboard';
      router.push(redirectPath);

    } catch (error) {
      console.error('An error occurred:', error);
      setErrorMsg('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center">
      <div className="card w-full max-w-sm shadow-2xl bg-base-100">
        <form onSubmit={handleSubmit} className="card-body">
          <h2 className="card-title justify-center mb-4">Sign in to your account</h2>

          {errorMsg && (
            <div className="alert alert-error text-sm py-2">
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="form-control">
            <label className="label" htmlFor="username">
              <span className="label-text">Email</span>
            </label>
            <input
              id="username"
              type="email"
              placeholder="email@example.com"
              className="input input-bordered"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="form-control">
            <label className="label" htmlFor="password">
              <span className="label-text">Password</span>
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              className="input input-bordered"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label className="label">
              <a href="#" className="label-text-alt link link-hover">Forgot password?</a>
            </label>
          </div>

          <div className="form-control mt-4">
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? <span className="loading loading-spinner loading-sm"></span> : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}