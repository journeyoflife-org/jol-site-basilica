/**
 * Gallery page — /gallery
 *
 * Renders all images from the tenant fixture gallery block with proper
 * alt text, captions, and lazy loading.
 *
 * Spec §4.1: Gallery.
 * Spec §7: Gallery template — image grid + lightbox.
 */

import type { Metadata } from 'next';
import Image from 'next/image';
import fixture from '@/fixtures/tenant.json';
import { resolveLocale } from '@/lib/resolve-locale';
import { resolvePageLocale } from '@/lib/locale-context';
import { breadcrumbListEntity } from '@journeyoflife-org/seo';
import Breadcrumb from '@/components/breadcrumb';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export function generateMetadata({ params }: { params: Record<string, string> }): Metadata {
  const locale = resolvePageLocale(params);
  return {
  title: resolveLocale(
    { lt: 'Galerija', en: 'Gallery', ru: 'Галерея' },
    locale,
  ),
  description: resolveLocale(
    {
      lt: 'Vilniaus arkikatedros bazilikos nuotraukų galerija',
      en: 'Photo gallery of Vilnius Cathedral Basilica',
      ru: 'Фотогалерея Вильнюсского кафедрального собора',
    },
    locale,
  ),
  robots: {
    index: false,
    follow: false,
  },
  };
}

interface ContentBlock {
  type: string;
  heading?: { lt: string; en?: string; ru?: string };
  [key: string]: unknown;
}

interface GalleryImage {
  src: string;
  alt: { lt: string; en?: string; ru?: string };
  width: number;
  height: number;
  caption?: { lt: string; en?: string; ru?: string };
}

export const dynamic = 'force-static';

export default function GalleryPage({ params }: { params: Record<string, string> }) {
  const locale = resolvePageLocale(params);
  const homePage = fixture.pages[0];
  if (!homePage) return null;
  const blocks = homePage.contentBlocks as ContentBlock[];

  const galleryBlock = blocks.find((b) => b.type === 'gallery');
  const images = galleryBlock && Array.isArray(galleryBlock.images)
    ? (galleryBlock.images as GalleryImage[])
    : [];

  const breadcrumbItems = [
    { label: resolveLocale({ lt: 'Pradžia', en: 'Home', ru: 'Главная' }, locale), href: '/' },
    {
      label: resolveLocale({ lt: 'Galerija', en: 'Gallery', ru: 'Галерея' }, locale),
    },
  ];

  const breadcrumbJsonLd = breadcrumbListEntity(
    breadcrumbItems.map((item) => ({
      name: item.label,
      url: item.href ? `${BASE_URL}${item.href}` : `${BASE_URL}/gallery`,
    })),
  );

  return (
    <>
      <Breadcrumb locale={locale} items={breadcrumbItems} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-4">
          {resolveLocale({ lt: 'Galerija', en: 'Gallery', ru: 'Галерея' }, locale)}
        </h1>
        <p className="text-gray-600 mb-8">
          {resolveLocale(
            {
              lt: 'Vilniaus arkikatedros bazilikos nuotraukos',
              en: 'Photos of Vilnius Cathedral Basilica',
              ru: 'Фотографии Вильнюсского кафедрального собора',
            },
            locale,
          )}
        </p>

        {images.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((img, i) => (
              <figure key={i} className="overflow-hidden rounded-lg shadow-sm bg-white">
                <Image
                  src={img.src}
                  alt={resolveLocale(img.alt, locale)}
                  width={img.width}
                  height={img.height}
                  className="w-full h-64 object-cover"
                  loading="lazy"
                />
                {img.caption && (
                  <figcaption className="p-3 text-sm text-gray-600 text-center">
                    {resolveLocale(img.caption, locale)}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 italic">
              {resolveLocale(
                {
                  lt: 'Galerija bus papildyta netrukus',
                  en: 'The gallery will be updated soon',
                  ru: 'Галерея будет обновлена в ближайшее время',
                },
                locale,
              )}
            </p>
          </div>
        )}
      </div>
    </>
  );
}
