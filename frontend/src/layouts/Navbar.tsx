import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useUIStore } from '../store/uiStore';
import { client } from '../graphql/client';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Maps a route pathname to a human-readable page title */
const ROUTE_LABELS: Record<string, string> = {
  '/dashboard':   'Dashboard',
  '/students':    'Students',
  '/teachers':    'Teachers',
  '/courses':     'Courses',
  '/enrollments': 'Enrollments',
  '/grades':      'Grades',
};

function getPageTitle(pathname: string): string {
  return ROUTE_LABELS[pathname] ?? 'Page';
}

/** Returns up to two uppercase initials from a full name */
function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase())
    .join('');
}

// ─── Icons ────────────────────────────────────────────────────────────────────

const MenuIcon = () => (
  <svg
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <line x1="4" y1="6" x2="20" y2="6" />
    <line x1="4" y1="12" x2="20" y2="12" />
    <line x1="4" y1="18" x2="20" y2="18" />
  </svg>
);

const LogoutIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const ChevronIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

// ─── Component ────────────────────────────────────────────────────────────────

const Navbar: React.FC = () => {
  const { user, logout } = useAuthStore();
  const { toggleSidebar } = useUIStore();
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const pageTitle = getPageTitle(location.pathname);
  const initials = user?.name ? getInitials(user.name) : '?';

  // ── Close dropdown on outside click or Escape ─────────────────────────────

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    triggerRef.current?.focus(); // return focus to trigger on close
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        closeMenu();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMenu();
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [menuOpen, closeMenu]);

  // ── Close dropdown on route change ────────────────────────────────────────

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // ── Logout ────────────────────────────────────────────────────────────────

  const handleLogout = () => {
    logout();
    client.clearStore();
    navigate('/login');
  };

  return (
    <header
      role="banner"
      className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between border-b border-gray-200 bg-white/95 px-4 backdrop-blur-sm lg:px-6"
    >
      {/* ── Left: Hamburger + Page Title ── */}
      <div className="flex items-center gap-3">
        {/* Mobile hamburger — only shown on small screens */}
        <button
          type="button"
          onClick={toggleSidebar}
          className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 lg:hidden"
          aria-label="Open navigation menu"
        >
          <MenuIcon />
        </button>

        {/* Current page breadcrumb — hidden on small screens to save space */}
        <h1 className="hidden text-sm font-semibold text-gray-900 sm:block">
          {pageTitle}
        </h1>
      </div>

      {/* ── Right: User Menu ── */}
      <div className="relative" ref={menuRef}>
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          aria-label={`Account menu for ${user?.name ?? 'user'}`}
          className="flex items-center gap-2.5 rounded-lg py-1.5 pl-1.5 pr-2.5 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          {/* Avatar initials */}
          <span
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-[11px] font-semibold text-white"
            aria-hidden="true"
          >
            {initials}
          </span>

          {/* Name — hidden on very small screens */}
          <span className="hidden max-w-[120px] truncate text-sm font-medium text-gray-700 sm:block">
            {user?.name}
          </span>

          {/* Chevron */}
          <span
            className={`text-gray-400 transition-transform duration-200 ${menuOpen ? 'rotate-180' : ''}`}
          >
            <ChevronIcon />
          </span>
        </button>

        {/* ── Dropdown Menu ── */}
        {menuOpen && (
          <div
            role="menu"
            aria-label="User account options"
            className="absolute right-0 top-full mt-2 w-56 origin-top-right animate-[fadeSlideIn_0.15s_ease-out] rounded-xl border border-gray-200 bg-white py-1 shadow-lg ring-1 ring-black/5"
          >
            {/* User info header */}
            <div className="border-b border-gray-100 px-4 py-3">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {user?.name}
              </p>
              <p className="text-xs text-gray-400 truncate mt-0.5">
                {user?.email}
              </p>
            </div>

            {/* Logout action */}
            <div className="px-1 py-1">
              <button
                type="button"
                role="menuitem"
                onClick={handleLogout}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-red-600 transition-colors hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
              >
                <LogoutIcon />
                Sign out
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
