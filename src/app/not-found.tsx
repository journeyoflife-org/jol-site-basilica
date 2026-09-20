/**
 * 404 Not Found page — not-found.tsx
 *
 * Displayed when a route does not match any page.
 * Provides helpful navigation links back to known pages.
 *
 * Spec §4.3: 404 Error page.
 */

import { resolveLocale, type SupportedLocale } from '@/lib/resolve-locale';
import fixture from '@/fixtures/tenant.json';

const locale: SupportedLocale = (fixture.locale as SupportedLocale) ?? 'lt';

export default function NotFound() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-20 text-center">
      <p className="text-6xl font-bold text-amber-700 mb-4">404</p>
      <h1 className="text-2xl font-bold mb-4">
        {resolveLocale(
          { lt: 'Puslapis nerastas', en: 'Page Not Found', ru: 'Страница не найдена' },
          locale,
        )}
      </h1>
      <p className="text-gray-600 mb-8 max-w-lg mx-auto">
        {resolveLocale(
          {
            lt: 'Puslapis, kurio ieškote, neegzistuoja arba buvo perkeltas. Naudokite žemiau pateiktas nuorodas.',
            en: 'The page you are looking for does not exist or has been moved. Use the links below.',
            ru: 'Страница, которую вы ищете, не существует или была перемещена. Используйте ссылки ниже.',
          },
          locale,
        )}
      </p>

      {/* Helpful navigation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
        <a
          href="/"
          className="p-4 bg-white rounded-lg shadow-sm border border-gray-100 hover:border-amber-300 transition-colors"
        >
          <span className="font-medium text-amber-700">
            {resolveLocale({ lt: 'Pradžia', en: 'Home', ru: 'Главная' }, locale)}
          </span>
        </a>
        <a
          href="/worship/mass"
          className="p-4 bg-white rounded-lg shadow-sm border border-gray-100 hover:border-amber-300 transition-colors"
        >
          <span className="font-medium text-amber-700">
            {resolveLocale({ lt: 'Šv. Mišios', en: 'Mass Schedule', ru: 'Расписание Месс' }, locale)}
          </span>
        </a>
        <a
          href="/visit/info"
          className="p-4 bg-white rounded-lg shadow-sm border border-gray-100 hover:border-amber-300 transition-colors"
        >
          <span className="font-medium text-amber-700">
            {resolveLocale({ lt: 'Lankytojams', en: 'Visitor Info', ru: 'Посетителям' }, locale)}
          </span>
        </a>
        <a
          href="/contact"
          className="p-4 bg-white rounded-lg shadow-sm border border-gray-100 hover:border-amber-300 transition-colors"
        >
          <span className="font-medium text-amber-700">
            {resolveLocale({ lt: 'Kontaktai', en: 'Contact', ru: 'Контакты' }, locale)}
          </span>
        </a>
        <a
          href="/faq"
          className="p-4 bg-white rounded-lg shadow-sm border border-gray-100 hover:border-amber-300 transition-colors"
        >
          <span className="font-medium text-amber-700">
            {resolveLocale({ lt: 'DUK', en: 'FAQ', ru: 'ЧаВо' }, locale)}
          </span>
        </a>
        <a
          href="/about/history"
          className="p-4 bg-white rounded-lg shadow-sm border border-gray-100 hover:border-amber-300 transition-colors"
        >
          <span className="font-medium text-amber-700">
            {resolveLocale({ lt: 'Istorija', en: 'History', ru: 'История' }, locale)}
          </span>
        </a>
      </div>
    </div>
  );
}
