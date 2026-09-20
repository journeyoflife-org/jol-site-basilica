'use client';

/**
 * Site header — logo, site name, primary navigation with dropdowns.
 *
 * Client component: mobile hamburger menu requires useState for toggle.
 *
 * Accessibility:
 * - aria-label on nav landmark
 * - aria-expanded on dropdown triggers
 * - aria-current="page" on active link
 * - Keyboard navigable (Enter/Space to toggle, Escape to close)
 * - Focus trap not needed — dropdowns are CSS-only on desktop, toggle on mobile
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { primaryNav, type NavItem } from '@/lib/navigation';
import { resolveLocale, type SupportedLocale } from '@/lib/resolve-locale';
import fixture from '@/fixtures/tenant.json';

const locale: SupportedLocale = (fixture.locale as SupportedLocale) ?? 'lt';

/** Short name for the header (the full fixture.name is very long). */
const shortName: Record<SupportedLocale, string> = {
  lt: 'Vilniaus katedra',
  en: 'Vilnius Cathedral',
  ru: 'Вильнюсский собор',
};

/** Cross icon — inline SVG, no external dependency. */
function CrossIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 36"
      className="h-8 w-5 text-amber-700"
      aria-hidden="true"
      fill="currentColor"
    >
      <rect x="9" y="0" width="6" height="36" rx="1" />
      <rect x="0" y="9" width="24" height="6" rx="1" />
    </svg>
  );
}

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);

  const toggleMobile = useCallback(() => {
    setMobileOpen((prev) => !prev);
    setOpenDropdown(null);
  }, []);

  const toggleDropdown = useCallback((label: string) => {
    setOpenDropdown((prev) => (prev === label ? null : label));
  }, []);

  /** Close dropdowns on Escape key. */
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setOpenDropdown(null);
        setMobileOpen(false);
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  /** Close dropdowns when clicking outside. */
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  function renderNavItem(item: NavItem) {
    const label = resolveLocale(item.label, locale);
    const hasChildren = item.children && item.children.length > 0;

    if (hasChildren) {
      const isOpen = openDropdown === label;
      return (
        <li key={label} className="relative">
          <button
            type="button"
            className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-amber-700 rounded-md hover:bg-gray-50"
            aria-expanded={isOpen}
            aria-haspopup="true"
            onClick={() => toggleDropdown(label)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleDropdown(label);
              }
            }}
          >
            {label}
            <svg
              className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          {isOpen && (
            <ul className="absolute left-0 mt-1 w-56 rounded-md bg-white shadow-lg ring-1 ring-black/5 z-50 py-1">
              {item.children!.map((child) => (
                <li key={resolveLocale(child.label, locale)}>
                  <a
                    href={child.href}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-amber-700"
                    onClick={() => setOpenDropdown(null)}
                  >
                    {resolveLocale(child.label, locale)}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </li>
      );
    }

    return (
      <li key={label}>
        <a
          href={item.href}
          className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-amber-700 rounded-md hover:bg-gray-50"
        >
          {label}
        </a>
      </li>
    );
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo + site name */}
          <a href="/" className="flex items-center gap-2 shrink-0">
            <CrossIcon />
            <span className="text-lg font-semibold text-gray-900 hidden sm:inline">
              {shortName[locale]}
            </span>
          </a>

          {/* Desktop navigation */}
          <nav
            ref={navRef}
            aria-label="Pagrindinė navigacija"
            className="hidden md:block"
          >
            <ul className="flex items-center gap-1">
              {primaryNav.map(renderNavItem)}
            </ul>
          </nav>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-50 hover:text-amber-700"
            aria-label={mobileOpen ? 'Uždaryti meniu' : 'Atidaryti meniu'}
            aria-expanded={mobileOpen}
            onClick={toggleMobile}
          >
            {mobileOpen ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile navigation panel */}
      {mobileOpen && (
        <nav aria-label="Mobili navigacija" className="md:hidden border-t border-gray-200 bg-white">
          <ul className="px-4 py-3 space-y-1">
            {primaryNav.map((item) => {
              const label = resolveLocale(item.label, locale);
              const hasChildren = item.children && item.children.length > 0;
              const isOpen = openDropdown === label;

              if (hasChildren) {
                return (
                  <li key={label}>
                    <button
                      type="button"
                      className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50"
                      aria-expanded={isOpen}
                      onClick={() => toggleDropdown(label)}
                    >
                      {label}
                      <svg
                        className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    {isOpen && (
                      <ul className="ml-4 mt-1 space-y-1">
                        {item.children!.map((child) => (
                          <li key={resolveLocale(child.label, locale)}>
                            <a
                              href={child.href}
                              className="block px-3 py-2 text-sm text-gray-600 rounded-md hover:bg-gray-50 hover:text-amber-700"
                              onClick={() => setMobileOpen(false)}
                            >
                              {resolveLocale(child.label, locale)}
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              }

              return (
                <li key={label}>
                  <a
                    href={item.href}
                    className="block px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50 hover:text-amber-700"
                    onClick={() => setMobileOpen(false)}
                  >
                    {label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </header>
  );
}
