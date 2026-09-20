/**
 * Architecture & Art page — /about/architecture
 *
 * Renders architectural description with gallery images from the tenant
 * fixture. Showcases the basilica's Classicist exterior, interior art,
 * and notable features.
 *
 * Spec §4.1: About → Architecture & Art.
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
    { lt: 'Architektūra ir menas', en: 'Architecture & Art', ru: 'Архитектура и искусство' },
    locale,
  ),
  description: resolveLocale(
    {
      lt: 'Vilniaus arkikatedros bazilikos architektūra — klasicistinis fasadas, barokinis interjeras',
      en: 'Architecture of Vilnius Cathedral Basilica — Classicist façade, Baroque interior',
      ru: 'Архитектура Вильнюсского кафедрального собора — классицистический фасад, барочный интерьер',
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

export const dynamic = 'force-static';

export default function ArchitecturePage({ params }: { params: Record<string, string> }) {
  const locale = resolvePageLocale(params);
  const homePage = fixture.pages[0];
  if (!homePage) return null;
  const blocks = homePage.contentBlocks as ContentBlock[];

  // Extract gallery images for visual showcase
  const galleryBlock = blocks.find((b) => b.type === 'gallery');
  const images = galleryBlock && Array.isArray(galleryBlock.images)
    ? (galleryBlock.images as Array<{
        src: string;
        alt: { lt: string; en?: string; ru?: string };
        width: number;
        height: number;
        caption?: { lt: string; en?: string; ru?: string };
      }>)
    : [];

  const breadcrumbItems = [
    { label: resolveLocale({ lt: 'Pradžia', en: 'Home', ru: 'Главная' }, locale), href: '/' },
    {
      label: resolveLocale({ lt: 'Apie', en: 'About', ru: 'О нас' }, locale),
      href: '#',
    },
    {
      label: resolveLocale(
        { lt: 'Architektūra ir menas', en: 'Architecture & Art', ru: 'Архитектура и искусство' },
        locale,
      ),
    },
  ];

  const breadcrumbJsonLd = breadcrumbListEntity(
    breadcrumbItems.map((item) => ({
      name: item.label,
      url: item.href ? `${BASE_URL}${item.href}` : `${BASE_URL}/about/architecture`,
    })),
  );

  return (
    <>
      <Breadcrumb locale={locale} items={breadcrumbItems} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-4">
          {resolveLocale(
            { lt: 'Architektūra ir menas', en: 'Architecture & Art', ru: 'Архитектура и искусство' },
            locale,
          )}
        </h1>
        <p className="text-gray-600 mb-8 text-lg">
          {resolveLocale(
            {
              lt: 'Vilniaus arkikatedra bazilika — klasicistinio architektūros šedevras, kurį sukūrė architektas Laurynas Stuoka-Gucevičius XVIII–XIX a. sandūroje.',
              en: 'Vilnius Cathedral Basilica is a masterpiece of Classicist architecture, designed by architect Laurynas Stuoka-Gucevičius at the turn of the 18th–19th centuries.',
              ru: 'Вильнюсский кафедральный собор — шедевр архитектуры классицизма, созданный архитектором Лауринасом Стуока-Гуцевичюсом на рубеже XVIII–XIX веков.',
            },
            locale,
          )}
        </p>

        {/* Exterior */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4">
            {resolveLocale(
              { lt: 'Fasadas', en: 'Façade', ru: 'Фасад' },
              locale,
            )}
          </h2>
          <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100">
            <p className="text-gray-700 leading-relaxed">
              {resolveLocale(
                {
                  lt: 'Katedros fasadą puošia šešios kolonos, laikančios frontoną su trimis skulptūromis: šv. Stanislovo centre, šv. Kazimiero kairėje ir šv. Vladislovo dešinėje. Fasado viršuje — trys kryžiai, simbolizuojantys krikščionybės triumfą Lietuvoje.',
                  en: 'The cathedral façade features six columns supporting a pediment with three sculptures: St. Stanislaus in the center, St. Casimir on the left, and St. Ladislaus on the right. Three crosses crown the façade, symbolizing the triumph of Christianity in Lithuania.',
                  ru: 'Фасад собора украшен шестью колоннами, поддерживающими фронтон с тремя скульптурами: св. Станислав в центре, св. Казимир слева и св. Владислав справа. Три креста венчают фасад, символизируя торжество христианства в Литве.',
                },
                locale,
              )}
            </p>
          </div>
        </section>

        {/* Interior */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4">
            {resolveLocale(
              { lt: 'Interjeras', en: 'Interior', ru: 'Интерьер' },
              locale,
            )}
          </h2>
          <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100">
            <p className="text-gray-700 leading-relaxed mb-4">
              {resolveLocale(
                {
                  lt: 'Viduje — erdvūs navai su barokiniais altoriais, klasicistiniais baldais ir gausiomis freskomis. Centrinėje navėje yra didysis altorius su nukryžiuoto Kristaus skulptūra.',
                  en: 'Inside, spacious naves with Baroque altars, Classicist furnishings, and rich frescoes. The central nave houses the high altar with a sculpture of the Crucified Christ.',
                  ru: 'Внутри — просторные нефы с барочными алтарями, классицистической мебелью и богатыми фресками. В центральном нефе находится главный алтарь со скульптурой Распятого Христа.',
                },
                locale,
              )}
            </p>
          </div>
        </section>

        {/* Notable features */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4">
            {resolveLocale(
              { lt: 'Svarbūs objektai', en: 'Notable Features', ru: 'Достопримечательности' },
              locale,
            )}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                title: resolveLocale(
                  { lt: 'Šv. Kazimiero koplyčia', en: 'Chapel of St. Casimir', ru: 'Каплица св. Казимира' },
                  locale,
                ),
                desc: resolveLocale(
                  {
                    lt: 'Barokinė koplyčia su šventojo relikvijomis — vienas svarbiausių piligrimystės objektų Lietuvoje',
                    en: 'Baroque chapel with the saint\'s relics — one of the most important pilgrimage objects in Lithuania',
                    ru: 'Барочная каплица с мощами святого — один из важнейших объектов паломничества в Литве',
                  },
                  locale,
                ),
              },
              {
                title: resolveLocale(
                  { lt: 'Požemiai', en: 'Catacombs', ru: 'Подземелья' },
                  locale,
                ),
                desc: resolveLocale(
                  {
                    lt: 'Bažnytinio paveldo muziejus su XIV–XVIII a. захоронениями ir meno kūriniais',
                    en: 'Church Heritage Museum with 14th–18th century burials and works of art',
                    ru: 'Музей церковного наследия с захоронениями XIV–XVIII веков и произведениями искусства',
                  },
                  locale,
                ),
              },
              {
                title: resolveLocale(
                  { lt: 'Varpai', en: 'Bells', ru: 'Колокола' },
                  locale,
                ),
                desc: resolveLocale(
                  {
                    lt: 'Katedros bokšte kabantys varpai — istoriniai muzikos instrumentai',
                    en: 'Bells in the cathedral tower — historical musical instruments',
                    ru: 'Колокола в башне собора — исторические музыкальные инструменты',
                  },
                  locale,
                ),
              },
              {
                title: resolveLocale(
                  { lt: 'Vargonai', en: 'Organ', ru: 'Орган' },
                  locale,
                ),
                desc: resolveLocale(
                  {
                    lt: 'Koncertinis vargonas — Vox Organi Cathedralis vasaros koncertų instrumentas',
                    en: 'Concert organ — instrument for Vox Organi Cathedralis summer concerts',
                    ru: 'Концертный орган — инструмент летних концертов Vox Organi Cathedralis',
                  },
                  locale,
                ),
              },
            ].map((feature, i) => (
              <div key={i} className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Gallery */}
        {images.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold mb-4">
              {resolveLocale(
                { lt: 'Galerija', en: 'Gallery', ru: 'Галерея' },
                locale,
              )}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {images.map((img, i) => (
                <figure key={i} className="overflow-hidden rounded-lg shadow-sm">
                  <Image
                    src={img.src}
                    alt={resolveLocale(img.alt, locale)}
                    width={img.width}
                    height={img.height}
                    className="w-full h-64 object-cover"
                    loading="lazy"
                  />
                  {img.caption && (
                    <figcaption className="mt-2 text-sm text-gray-500 text-center pb-2">
                      {resolveLocale(img.caption, locale)}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
