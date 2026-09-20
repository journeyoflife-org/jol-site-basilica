/**
 * Breadcrumb component — visual breadcrumbs + JSON-LD BreadcrumbList.
 *
 * Accepts an array of items with label and optional href.
 * The last item is treated as the current page (no link, aria-current="page").
 *
 * Emits JSON-LD via breadcrumbListEntity from @journeyoflife-org/seo.
 */

import type { SupportedLocale } from '@/lib/resolve-locale';
import { breadcrumbListEntity } from '@journeyoflife-org/seo';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

/**
 * Prefix a breadcrumb href with the current locale.
 * - '/' → '/lt'
 * - '#' is treated as a section root (not linked, rendered as plain text)
 * - '/path' → '/lt/path'
 */
function prefixHref(href: string, locale: SupportedLocale): string {
  if (href === '#') return '#';
  if (href === '/') return `/${locale}`;
  return `/${locale}${href}`;
}

export default function Breadcrumb({
  items,
  locale,
}: {
  items: BreadcrumbItem[];
  locale?: SupportedLocale;
}) {
  const resolvedItems = locale
    ? items.map((item) => ({
        ...item,
        href: item.href ? prefixHref(item.href, locale) : undefined,
      }))
    : items;

  const jsonLd = breadcrumbListEntity(
    resolvedItems.map((item) => ({
      name: item.label,
      url: item.href && item.href !== '#' ? item.href : '',
    })),
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="Breadcrumbs" className="bg-gray-50 border-b border-gray-200">
        <ol className="max-w-4xl mx-auto px-4 py-2 flex items-center space-x-2 text-sm text-gray-600">
          {resolvedItems.map((item, index) => {
            const isLast = index === resolvedItems.length - 1;
            return (
              <li key={index} className="flex items-center">
                {!isLast && item.href ? (
                  <>
                    <a
                      href={item.href}
                      className="hover:text-amber-700 hover:underline"
                    >
                      {item.label}
                    </a>
                    <span className="mx-2 text-gray-400" aria-hidden="true">
                      /
                    </span>
                  </>
                ) : (
                  <span aria-current="page" className="font-medium text-gray-900">
                    {item.label}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
