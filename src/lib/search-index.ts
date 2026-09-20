/**
 * Search index — static data for client-side site-wide search.
 *
 * Each entry contains localized title, description, URL, and extra keywords
 * for all 3 locales (lt/en/ru). The search form component filters this index
 * client-side using simple substring matching.
 *
 * TODO: generate from fixture + route manifest when CMS is integrated.
 */

import type { LocalizedText } from './resolve-locale';

export interface SearchEntry {
  /** Page URL (absolute path). */
  url: string;
  /** Localized page title. */
  title: LocalizedText;
  /** Localized page description. */
  description: LocalizedText;
  /** Extra localized keywords for better search matching. */
  keywords?: LocalizedText;
}

/**
 * Full site search index.
 *
 * Covers all 27 pages: Home, 3 legal, 3 About, 4 Worship, 3 Community,
 * 4 Visit, Contact, FAQ, Gallery, Resources, Support, 404.
 */
export const searchIndex: SearchEntry[] = [
  // ── Home ──────────────────────────────────────────────────────────
  {
    url: '/',
    title: { lt: 'Pradžia', en: 'Home', ru: 'Главная' },
    description: {
      lt: 'Vilniaus arkikatedra bazilika — pagrindinis puslapis',
      en: 'Vilnius Cathedral Basilica — home page',
      ru: 'Кафедральный собор Вильнюса — главная страница',
    },
    keywords: {
      lt: 'katedra bazilika vilnius pradžios',
      en: 'cathedral basilica vilnius home',
      ru: 'собор базилика вильнюс главная',
    },
  },

  // ── About ─────────────────────────────────────────────────────────
  {
    url: '/about/history',
    title: { lt: 'Istorija', en: 'History', ru: 'История' },
    description: {
      lt: 'Vilniaus katedros istorija nuo 1387 m. iki šių dienų',
      en: 'History of Vilnius Cathedral from 1387 to present',
      ru: 'История Виленского собора с 1387 года до наших дней',
    },
    keywords: {
      lt: 'istorija praeitis kronika karalius mindaugas lenkija lietuva krikštas',
      en: 'history past chronicle king mindaugas poland lithuania baptism christianization',
      ru: 'история прошлое хроника король миндаугас польша литва крещение',
    },
  },
  {
    url: '/about/architecture',
    title: { lt: 'Architektūra ir menas', en: 'Architecture & Art', ru: 'Архитектура и искусство' },
    description: {
      lt: 'Katedros architektūra, menas ir architektūriniai elementai',
      en: 'Cathedral architecture, art, and architectural elements',
      ru: 'Архитектура собора, искусство и архитектурные элементы',
    },
    keywords: {
      lt: 'architektūra menas fasadas interjeras freskos skulptūros stuoka gucevičius klasicizmas',
      en: 'architecture art façade interior frescoes sculptures stuoka-gucevičius classicism',
      ru: 'архитектура искусство фасад интерьер фрески скульптуры стуока-гуцевичюс классицизм',
    },
  },
  {
    url: '/about/clergy',
    title: { lt: 'Dvasininkija ir personalas', en: 'Clergy & Staff', ru: 'Духовенство и персонал' },
    description: {
      lt: 'Katedros klebonas, vikaras ir personalas',
      en: 'Cathedral parish priest, vicar, and staff',
      ru: 'Настоятель, викарий и персонал собора',
    },
    keywords: {
      lt: 'kunigas klebonas vikaras dvasininkas personalas kontaktai',
      en: 'priest parish-pastor vicar clergy staff contacts',
      ru: 'священник настоятель викарий духовенство персонал контакты',
    },
  },

  // ── Worship ───────────────────────────────────────────────────────
  {
    url: '/worship/mass',
    title: { lt: 'Šv. Mišių tvarkaraštis', en: 'Mass Schedule', ru: 'Расписание Месс' },
    description: {
      lt: 'Šv. Mišių tvarkaraštis sekmadieniais ir darbo dienomis',
      en: 'Mass schedule for Sundays and weekdays',
      ru: 'Расписание Месс по воскресеньям и будням',
    },
    keywords: {
      lt: 'mišios tvarkaraštis sekmadienis darbo diena liturgija eucharistija',
      en: 'mass schedule sunday weekday liturgy eucharist',
      ru: 'месса расписание воскресенье будний день литургия евхаристия',
    },
  },
  {
    url: '/worship/confession',
    title: { lt: 'Išpažinties tvarkaraštis', en: 'Confession Schedule', ru: 'Расписание исповеди' },
    description: {
      lt: 'Išpažinties tvarkaraštis ir informacija',
      en: 'Confession schedule and information',
      ru: 'Расписание исповеди и информация',
    },
    keywords: {
      lt: 'išpažintis atgaila sakramentas susitaikinimas zakristija',
      en: 'confession repentance sacrament reconciliation sacristy',
      ru: 'исповедь покаяние таинство примирение ризница',
    },
  },
  {
    url: '/worship/sacraments',
    title: { lt: 'Sakramentai', en: 'Sacraments', ru: 'Таинства' },
    description: {
      lt: 'Sakramentai: krikštas, santuoka, mišių intencijos ir kita',
      en: 'Sacraments: baptism, marriage, mass intentions, and more',
      ru: 'Таинства: крещение, венчание, намерения Мессы и другое',
    },
    keywords: {
      lt: 'sakramentas krikštas santuoka mišios intencija krikštijimas vestuvės',
      en: 'sacrament baptism marriage mass intention christening wedding',
      ru: 'таинство крещение венчание месса намерение крещение свадьба',
    },
  },
  {
    url: '/worship/calendar',
    title: { lt: 'Liturginis kalendorius', en: 'Liturgical Calendar', ru: 'Литургический календарь' },
    description: {
      lt: 'Liturginis kalendorius — šventės ir ypatingos dienos',
      en: 'Liturgical calendar — feasts and special days',
      ru: 'Литургический календарь — праздники и особые дни',
    },
    keywords: {
      lt: 'kalendorius liturginis šventė adventas gavėnas Kalėdos Velykos',
      en: 'calendar liturgical feast advent lent christmas easter',
      ru: 'календарь литургический праздник адвент пост рождество пасха',
    },
  },

  // ── Community ─────────────────────────────────────────────────────
  {
    url: '/community/services',
    title: { lt: 'Parapijos paslaugos', en: 'Parish Services', ru: 'Приходские службы' },
    description: {
      lt: 'Katedros tarnystės ir parapijos paslaugos',
      en: 'Cathedral ministries and parish services',
      ru: 'Служения собора и приходские службы',
    },
    keywords: {
      lt: 'parapija paslauga tarnystė koplyčia muziejus adoracija',
      en: 'parish service ministry chapel museum adoration',
      ru: 'приход служба служение капелла музей поклонение',
    },
  },
  {
    url: '/community/events',
    title: { lt: 'Renginiai', en: 'Events', ru: 'События' },
    description: {
      lt: 'Katedros renginiai ir koncertai',
      en: 'Cathedral events and concerts',
      ru: 'События и концерты собора',
    },
    keywords: {
      lt: 'renginys koncertas festivalis koncertas vox organi',
      en: 'event concert festival vox organi',
      ru: 'событие концерт фестиваль vox organi',
    },
  },
  {
    url: '/community/news',
    title: { lt: 'Naujienos', en: 'News', ru: 'Новости' },
    description: {
      lt: 'Parapijos naujienos ir skelbimai',
      en: 'Parish news and announcements',
      ru: 'Приходские новости и объявления',
    },
    keywords: {
      lt: 'naujiena skelbimas pranešimas informacija',
      en: 'news announcement bulletin information',
      ru: 'новость объявление бюллетень информация',
    },
  },

  // ── Visit ─────────────────────────────────────────────────────────
  {
    url: '/visit/info',
    title: { lt: 'Lankytojo informacija', en: 'Visitor Information', ru: 'Информация для посетителей' },
    description: {
      lt: 'Informacija lankytojams — ką žinoti prieš lankantis',
      en: 'Information for visitors — what to know before visiting',
      ru: 'Информация для посетителей — что нужно знать перед посещением',
    },
    keywords: {
      lt: 'lankytojas informacija lankymas gidai ekskursija įėjimas',
      en: 'visitor information visiting guide tour entry',
      ru: 'посетитель информация посещение гид экскурсия вход',
    },
  },
  {
    url: '/visit/hours',
    title: { lt: 'Darbo laikas', en: 'Opening Hours', ru: 'Часы работы' },
    description: {
      lt: 'Katedros darbo ir lankymo laikas',
      en: 'Cathedral opening and visiting hours',
      ru: 'Часы работы и посещения собора',
    },
    keywords: {
      lt: 'darbo laikas valanda atidarymas uždarymas pirmadienis sekmadienis',
      en: 'opening hours time open close monday sunday',
      ru: 'часы работы время открытие закрытие понедельник воскресенье',
    },
  },
  {
    url: '/visit/location',
    title: { lt: 'Vieta ir nuorodos', en: 'Location & Directions', ru: 'Местоположение и как добраться' },
    description: {
      lt: 'Kaip atvykti iki katedros — adresas, GPS, viešasis transportas',
      en: 'How to get to the cathedral — address, GPS, public transport',
      ru: 'Как добраться до собора — адрес, GPS, общественный транспорт',
    },
    keywords: {
      lt: 'vieta adresas kryptis maršrutas autobusas troleibusas GPS koordinatė',
      en: 'location address directions route bus trolleybus GPS coordinates',
      ru: 'местоположение адрес направление маршрут автобус троллейбус GPS координаты',
    },
  },
  {
    url: '/visit/pilgrimage',
    title: { lt: 'Piligrimystė', en: 'Pilgrimage', ru: 'Паломничество' },
    description: {
      lt: 'Piligrimystė — dvasinė kelionė į Vilniaus katedrą',
      en: 'Pilgrimage — spiritual journey to Vilnius Cathedral',
      ru: 'Паломничество — духовное путешествие в Виленский собор',
    },
    keywords: {
      lt: 'piligrimystė kelionė dvasia maldą šventovė',
      en: 'pilgrimage journey spiritual prayer sanctuary',
      ru: 'паломничество путешествие духовный молитва святыня',
    },
  },

  // ── Gallery ───────────────────────────────────────────────────────
  {
    url: '/gallery',
    title: { lt: 'Galerija', en: 'Gallery', ru: 'Галерея' },
    description: {
      lt: 'Vilniaus katedros nuotraukų galerija',
      en: 'Photo gallery of Vilnius Cathedral',
      ru: 'Фотогалерея Виленского собора',
    },
    keywords: {
      lt: 'galerija nuotrauka vaizdas fasadas interjeras',
      en: 'gallery photo image façade interior',
      ru: 'галерея фото изображение фасад интерьер',
    },
  },

  // ── Resources ─────────────────────────────────────────────────────
  {
    url: '/resources',
    title: { lt: 'Dokumentai ir ištekliai', en: 'Documents & Resources', ru: 'Документы и ресурсы' },
    description: {
      lt: 'Parapijos dokumentai ir ištekliai',
      en: 'Parish documents and resources',
      ru: 'Приходские документы и ресурсы',
    },
    keywords: {
      lt: 'dokumentas ištekliai statutas ataskaita forma atsisiųsti',
      en: 'document resource statute report form download',
      ru: 'документ ресурс устав отчёт бланк скачать',
    },
  },

  // ── Support ───────────────────────────────────────────────────────
  {
    url: '/support',
    title: { lt: 'Parama', en: 'Support', ru: 'Поддержка' },
    description: {
      lt: 'Paremkite katedrą — GPM 1.2% ir aukos',
      en: 'Support the cathedral — GPM 1.2% allocation and donations',
      ru: 'Поддержите собор — перечисление 1.2% GPM и пожертвования',
    },
    keywords: {
      lt: 'parama auka GPM mokestis 1.2% paremti',
      en: 'support donation GPM tax 1.2% contribute',
      ru: 'поддержка пожертвование GPM налог 1.2% внести',
    },
  },

  // ── Contact ───────────────────────────────────────────────────────
  {
    url: '/contact',
    title: { lt: 'Kontaktai', en: 'Contact', ru: 'Контакты' },
    description: {
      lt: 'Vilniaus arkikatedros bazilikos kontaktai',
      en: 'Contact information for Vilnius Cathedral Basilica',
      ru: 'Контактная информация Кафедрального собора Вильнюса',
    },
    keywords: {
      lt: 'kontaktas telefonas elpaštas adresas susisiekti',
      en: 'contact phone email address get-in-touch',
      ru: 'контакт телефон email адрес связаться',
    },
  },

  // ── FAQ ───────────────────────────────────────────────────────────
  {
    url: '/faq',
    title: { lt: 'DUK', en: 'FAQ', ru: 'ЧаВо' },
    description: {
      lt: 'Dažnai užduodami klausimai apie katedrą',
      en: 'Frequently asked questions about the cathedral',
      ru: 'Часто задаваемые вопросы о соборе',
    },
    keywords: {
      lt: 'DUK klausimas atsakymas dažnas',
      en: 'FAQ question answer frequent',
      ru: 'ЧаВо вопрос ответ частый',
    },
  },

  // ── Legal ─────────────────────────────────────────────────────────
  {
    url: '/privacy',
    title: { lt: 'Privatumo politika', en: 'Privacy Policy', ru: 'Политика конфиденциальности' },
    description: {
      lt: 'Privatumo politika ir asmens duomenų apsauga',
      en: 'Privacy policy and personal data protection',
      ru: 'Политика конфиденциальности и защита персональных данных',
    },
    keywords: {
      lt: 'privatumas politika GDPR asmens duomenys',
      en: 'privacy policy GDPR personal data',
      ru: 'конфиденциальность политика GDPR персональные данные',
    },
  },
  {
    url: '/cookies',
    title: { lt: 'Slapukų politika', en: 'Cookies Policy', ru: 'Политика cookies' },
    description: {
      lt: 'Slapukų naudojimo politika',
      en: 'Cookie usage policy',
      ru: 'Политика использования cookies',
    },
    keywords: {
      lt: 'slapukas cookie politika naršyklė',
      en: 'cookie policy browser',
      ru: 'cookie политика браузер',
    },
  },
  {
    url: '/accessibility-statement',
    title: { lt: 'Prieinamumo pareiškimas', en: 'Accessibility Statement', ru: 'Заявление о доступности' },
    description: {
      lt: 'Svetainės prieinamumo pareiškimas',
      en: 'Website accessibility statement',
      ru: 'Заявление о доступности сайта',
    },
    keywords: {
      lt: 'prieinamumas neįgalumas WCAG aklumas',
      en: 'accessibility disability WCAG blind',
      ru: 'доступность инвалидность WCAG слепота',
    },
  },
];
