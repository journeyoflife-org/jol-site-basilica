/**
 * FAQ page — /faq
 *
 * Frequently asked questions about the basilica. Uses native <details>
 * elements for accessible accordion behavior (no JavaScript required).
 *
 * Spec §4.1: FAQ.
 * Spec §8.2: FAQAccordion component — native <details> elements.
 * TODO: replace with fixture-driven FAQ when data becomes available.
 */

import type { Metadata } from 'next';
import fixture from '@/fixtures/tenant.json';
import { resolveLocale, type SupportedLocale } from '@/lib/resolve-locale';
import { breadcrumbListEntity, faqPageEntity } from '@journeyoflife-org/seo';
import Breadcrumb from '@/components/breadcrumb';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const locale: SupportedLocale = (fixture.locale as SupportedLocale) ?? 'lt';

export const metadata: Metadata = {
  title: resolveLocale(
    { lt: 'DUK', en: 'FAQ', ru: 'ЧаВо' },
    locale,
  ),
  description: resolveLocale(
    {
      lt: 'Dažniausiai užduodami klausimai apie Vilniaus arkikatedrą baziliką',
      en: 'Frequently asked questions about Vilnius Cathedral Basilica',
      ru: 'Часто задаваемые вопросы о Вильнюсском кафедральном соборе',
    },
    locale,
  ),
  robots: {
    index: false,
    follow: false,
  },
};

interface FaqEntry {
  question: { lt: string; en?: string; ru?: string };
  answer: { lt: string; en?: string; ru?: string };
}

const faqEntries: FaqEntry[] = [
  {
    question: {
      lt: 'Kada vyksta šv. Mišios sekmadieniais?',
      en: 'When are Sunday Masses?',
      ru: 'Когда проходят Мессы по воскресеньям?',
    },
    answer: {
      lt: 'Šv. Mišios sekmadieniais vyksta 08:00, 09:00, 10:00, 11:15, 12:30, 17:30 ir 18:30 val.',
      en: 'Sunday Masses are celebrated at 08:00, 09:00, 10:00, 11:15, 12:30, 17:30, and 18:30.',
      ru: 'Мессы по воскресеньям совершаются в 08:00, 09:00, 10:00, 11:15, 12:30, 17:30 и 18:30.',
    },
  },
  {
    question: {
      lt: 'Ar galima išpažintis kitu nei nurodytu laiku?',
      en: 'Can I confess at a time other than the scheduled one?',
      ru: 'Можно исповедоваться в другое время?',
    },
    answer: {
      lt: 'Taip, galite susitarti su kunigu iš anksto paskambinę telefonu arba atėję į parapijos raštinę.',
      en: 'Yes, you can arrange with the priest in advance by phone or at the parish office.',
      ru: 'Да, вы можете договориться со священником заранее по телефону или в приходской канцелярии.',
    },
  },
  {
    question: {
      lt: 'Ar įėjimas į katedrą yra nemokamas?',
      en: 'Is entry to the cathedral free?',
      ru: 'Вход в собор бесплатный?',
    },
    answer: {
      lt: 'Įėjimas į katedrą yra nemokamas. Gido paslaugos teikiamos pagal susitarimą.',
      en: 'Entry to the cathedral is free. Guide services are available by arrangement.',
      ru: 'Вход в собор бесплатный. Услуги гида предоставляются по договорённости.',
    },
  },
  {
    question: {
      lt: 'Ar galima aplankyti požemius?',
      en: 'Can I visit the catacombs?',
      ru: 'Можно посетить подземелья?',
    },
    answer: {
      lt: 'Taip, požemiuose veikia Bažnytinio paveldo muziejus. Daugiau informacijos: www.bpmuziejus.lt',
      en: 'Yes, the Church Heritage Museum operates in the catacombs. More info: www.bpmuziejus.lt',
      ru: 'Да, в подземельях работает Музей церковного наследия. Подробнее: www.bpmuziejus.lt',
    },
  },
  {
    question: {
      lt: 'Kaip užsakyti Mišias intenciją?',
      en: 'How do I book a Mass intention?',
      ru: 'Как заказать намерение Мессы?',
    },
    answer: {
      lt: 'Mišias intencijas galima užsakyti paskambinę telefonu +370 5 261 0731 arba el. paštu parapija@katedra.lt.',
      en: 'Mass intentions can be booked by calling +370 5 261 0731 or emailing parapija@katedra.lt.',
      ru: 'Намерения Мессы можно заказать по телефону +370 5 261 0731 или по электронной почте parapija@katedra.lt.',
    },
  },
  {
    question: {
      lt: 'Koks yra katedros darbo laikas?',
      en: 'What are the opening hours of the cathedral?',
      ru: 'Каковы часы работы собора?',
    },
    answer: {
      lt: 'Pirmadieniais–šeštadieniais 07:00–18:00, sekmadieniais 07:00–19:00. Mišių metu lankytojai prašomi netrukdyti.',
      en: 'Monday–Saturday 07:00–18:00, Sunday 07:00–19:00. Visitors are asked not to disturb during Mass.',
      ru: 'Понедельник–суббота 07:00–18:00, воскресенье 07:00–19:00. Во время Мессы просим не беспокоить.',
    },
  },
  {
    question: {
      lt: 'Ar galima fotografuoti katedroje?',
      en: 'Is photography allowed in the cathedral?',
      ru: 'Можно фотографировать в соборе?',
    },
    answer: {
      lt: 'Fotografuoti leidžiama be blykstės. Prašome elgtis pagarbiai ir netrukdyti maldos.',
      en: 'Photography is allowed without flash. Please be respectful and not disturb prayer.',
      ru: 'Фотографировать разрешено без вспышки. Просим уважительно относиться к молитве.',
    },
  },
  {
    question: {
      lt: 'Kaip atvykti iki katedros?',
      en: 'How do I get to the cathedral?',
      ru: 'Как добраться до собора?',
    },
    answer: {
      lt: 'Autobusais 10, 11, 33 arba troleibusais 1, 3, 7 iki stotelės „Katedra". Iš Rotušės aikštės — ~5 min pėsčiomis.',
      en: 'By buses 10, 11, 33 or trolleybuses 1, 3, 7 to the "Katedra" stop. From Town Hall Square: ~5 min walk.',
      ru: 'Автобусами 10, 11, 33 или троллейбусами 1, 3, 7 до остановки «Катедрa». От площади Ратуши: ~5 мин пешком.',
    },
  },
];

export default function FaqPage() {
  const breadcrumbItems = [
    { label: resolveLocale({ lt: 'Pradžia', en: 'Home', ru: 'Главная' }, locale), href: '/' },
    {
      label: resolveLocale({ lt: 'DUK', en: 'FAQ', ru: 'ЧаВо' }, locale),
    },
  ];

  const breadcrumbJsonLd = breadcrumbListEntity(
    breadcrumbItems.map((item) => ({
      name: item.label,
      url: item.href ? `${BASE_URL}${item.href}` : `${BASE_URL}/faq`,
    })),
  );

  // FAQPage JSON-LD for SEO
  const faqJsonLd = faqPageEntity(
    faqEntries.map((entry) => ({
      question: resolveLocale(entry.question, locale),
      answer: resolveLocale(entry.answer, locale),
    })),
  );

  return (
    <>
      <Breadcrumb items={breadcrumbItems} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-4">
          {resolveLocale(
            { lt: 'Dažniausiai užduodami klausimai', en: 'Frequently Asked Questions', ru: 'Часто задаваемые вопросы' },
            locale,
          )}
        </h1>
        <p className="text-gray-600 mb-8">
          {resolveLocale(
            {
              lt: 'Atsakymai į dažniausiai užduodamus klausimus apie Vilniaus arkikatedrą baziliką',
              en: 'Answers to the most common questions about Vilnius Cathedral Basilica',
              ru: 'Ответы на самые частые вопросы о Вильнюсском кафедральном соборе',
            },
            locale,
          )}
        </p>

        {/* FAQ accordion using native <details> */}
        <div className="space-y-3">
          {faqEntries.map((entry, i) => (
            <details
              key={i}
              className="group bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"
            >
              <summary className="flex items-center justify-between cursor-pointer p-4 text-gray-900 font-medium hover:bg-gray-50">
                <span>{resolveLocale(entry.question, locale)}</span>
                <svg
                  className="w-5 h-5 text-gray-400 shrink-0 ml-4 transition-transform group-open:rotate-180"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </summary>
              <div className="px-4 pb-4 text-gray-600">
                <p>{resolveLocale(entry.answer, locale)}</p>
              </div>
            </details>
          ))}
        </div>

        {/* Still have questions */}
        <div className="mt-10 p-6 bg-gray-50 rounded-lg text-center">
          <h2 className="text-lg font-semibold mb-2">
            {resolveLocale(
              { lt: 'Neturite atsakymo?', en: 'Still Have Questions?', ru: 'Остались вопросы?' },
              locale,
            )}
          </h2>
          <p className="text-gray-600 mb-4">
            {resolveLocale(
              {
                lt: 'Susisiekite su mumis — mielai padėsime',
                en: 'Contact us — we will be happy to help',
                ru: 'Свяжитесь с нами — мы будем рады помочь',
              },
              locale,
            )}
          </p>
          <a
            href="/contact"
            className="inline-block px-6 py-3 bg-amber-700 text-white rounded hover:bg-amber-800"
          >
            {resolveLocale(
              { lt: 'Susisiekti', en: 'Contact Us', ru: 'Связаться' },
              locale,
            )}
          </a>
        </div>
      </div>
    </>
  );
}
