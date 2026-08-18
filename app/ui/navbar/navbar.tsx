'use client';

import Logo from './logo';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useMenu } from '@/app/context/MenuContext';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { navigation, user, clearMenu } = useMenu();

  const handleLogout = () => {
    clearMenu();
    localStorage.removeItem('access_token');
    localStorage.removeItem('token_type');
    // Hapus cookie agar middleware auth guard ikut ter-reset
    document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
    router.push('/login');
  };

  return (
    <div className="navbar bg-base-100 shadow-sm px-4 md:px-8 sticky top-0 z-50 border-b border-base-200">
      <div className="flex-1">
        <Link href="/" className="hover:opacity-80 transition-opacity">
          <Logo />
        </Link>
      </div>

      <div className="flex-none gap-2 md:gap-4">
        {/* Navigation Menu */}
        <ul className="menu menu-horizontal px-1 font-medium hidden sm:flex">
          {navigation.map((item) => (
            <li key={item.id}>
              <Link 
                href={item.path} 
                className={`${pathname === item.path ? 'active text-primary bg-primary/10' : 'hover:text-primary'} transition-colors`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* User Profile & Logout */}
        <div className="flex items-center gap-3">
          {user && (
            <div className="flex items-center gap-2 px-2 py-1 bg-base-200/50 rounded-lg border border-base-300">
              <span className="text-sm font-medium">👤 {user.username}</span>
              <span className="badge badge-primary badge-sm uppercase text-[10px] font-bold shadow-sm">{user.role}</span>
            </div>
          )}
          
          {user ? (
            <button 
              className="btn btn-sm btn-outline btn-error hover:shadow-md transition-shadow ml-1" 
              onClick={handleLogout}
              title="Logout"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="hidden md:inline">Logout</span>
            </button>
          ) : (
            <Link href="/login" className="btn btn-sm btn-primary shadow-sm">
              Login
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
