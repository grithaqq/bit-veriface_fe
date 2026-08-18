/**
 * fetchWithAuth
 *
 * Wrapper di atas native `fetch` yang secara otomatis menangani:
 * - Menambahkan Bearer token dari localStorage ke header Authorization
 * - Mendeteksi response 401 / 403 (invalid / expired credentials)
 * - Membersihkan semua auth state (localStorage + cookie)
 * - Redirect ke /login menggunakan window.location (bekerja di luar React context)
 *
 * Gunakan ini di semua client component yang butuh autentikasi.
 */

const AUTH_KEYS = ['access_token', 'token_type', 'menu_navigation', 'menu_user'];

function clearAuthState() {
  AUTH_KEYS.forEach((key) => localStorage.removeItem(key));
  // Hapus cookie access_token
  document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
}

/**
 * @param input  - URL atau Request (sama seperti parameter pertama `fetch`)
 * @param init   - RequestInit options (sama seperti parameter kedua `fetch`)
 * @returns      - Response jika sukses, atau void jika di-redirect ke /login
 * @throws       - Error jika bukan 401/403 (agar caller bisa handle error-nya sendiri)
 */
export async function fetchWithAuth(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  const token = localStorage.getItem('access_token');

  // Gabungkan header Authorization dengan headers yang sudah ada
  const headers: HeadersInit = {
    ...(init?.headers ?? {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const response = await fetch(input, { ...init, headers });

  // Jika server menolak token (restart server / token expired)
  if (response.status === 401 || response.status === 403) {
    clearAuthState();
    // Arahkan ke login dan hentikan eksekusi
    window.location.replace('/login');
    // Return dummy response agar TypeScript puas (tidak akan pernah dieksekusi)
    return new Response(null, { status: response.status });
  }

  return response;
}
