'use client';

import React, { useEffect } from 'react';
import Navbar from '../ui/navbar/navbar';
import { fetchWithAuth } from '@/app/lib/fetchWithAuth';

/**
 * Layout ini melakukan token validation on mount dengan hit /api/menu.
 * Jika token sudah tidak berlaku (server restart → 403), fetchWithAuth
 * otomatis clear auth state dan redirect ke /login.
 *
 * Ini cover semua halaman di bawah /runner/* tanpa perlu
 * menambahkan pengecekan di setiap page secara terpisah.
 */
export default function RunnerLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Validasi token dengan hit endpoint yang ringan
    fetchWithAuth('/api/menu', { method: 'GET' }).catch(() => {
      // fetchWithAuth sudah handle redirect ke /login jika 403
      // catch ini hanya untuk error jaringan (server down, dll)
    });
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex-1 px-8 py-5 overflow-auto">{children}</div>
    </div>
  );
}
