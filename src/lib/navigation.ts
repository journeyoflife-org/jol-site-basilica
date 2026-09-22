/**
 * Navigation data — hardcoded menu structure with localized labels.
 *
 * All labels use the LocalizedText pattern (lt mandatory, en/ru optional).
 * Resolved at render time via resolveLocale().
 *
 * Future: make fixture-driven so each tenant can customize their nav.
 */

import type { LocalizedText } from './resolve-locale';

export interface NavItem {
  label: LocalizedText;
  href: string;
  children?: NavItem[];
}

/**
 * Primary navigation structure.
 *
 * Matches the spec (docs/specs/basilica-frontend-spec.md §5.1):
 * Home, About (4), Worship (4), Community (3), Visit (4), Contact.
 *
 * Note: most sub-pages do not exist yet. Links point to "/" with a
 * data attribute marking them as placeholder. As pages are implemented,
 * update the href values.
 */
export const primaryNav: NavItem[] = [
  {
    label: { lt: 'Pradžia', en: 'Home', ru: 'Главная' },
    href: '/',
  },
  {
    label: { lt: 'Apie', en: 'About', ru: 'О нас' },
    href: '#',
    children: [
      { label: { lt: 'Istorija', en: 'History', ru: 'История' }, href: '/about/history' },
      { label: { lt: 'Architektūra ir menas', en: 'Architecture & Art', ru: 'Архитектура и искусство' }, href: '/about/architecture' },
      { label: { lt: 'Dvasininkija ir personalas', en: 'Clergy & Staff', ru: 'Духовенство и персонал' }, href: '/about/clergy' },
    ],
  },
  {
    label: { lt: 'Dievgarba', en: 'Worship', ru: 'Богослужение' },
    href: '#',
    children: [
      { label: { lt: 'Šv. Mišių tvarkaraštis', en: 'Mass Schedule', ru: 'Расписание Месс' }, href: '/worship/mass' },
      { label: { lt: 'Išpažinties tvarkaraštis', en: 'Confession Schedule', ru: 'Расписание исповеди' }, href: '/worship/confession' },
      { label: { lt: 'Sakramentai', en: 'Sacraments', ru: 'Таинства' }, href: '/worship/sacraments' },
      { label: { lt: 'Liturginis kalendorius', en: 'Liturgical Calendar', ru: 'Литургический календарь' }, href: '/worship/calendar' },
    ],
  },
  {
    label: { lt: 'Bendruomenė', en: 'Community', ru: 'Община' },
    href: '#',
    children: [
      { label: { lt: 'Parapijos paslaugos', en: 'Parish Services', ru: 'Приходские службы' }, href: '/community/services' },
      { label: { lt: 'Renginiai', en: 'Events', ru: 'События' }, href: '/community/events' },
      { label: { lt: 'Naujienos', en: 'News', ru: 'Новости' }, href: '/community/news' },
    ],
  },
  {
    label: { lt: 'Lankytojams', en: 'Visit', ru: 'Посетителям' },
    href: '#',
    children: [
      { label: { lt: 'Lankytojo informacija', en: 'Visitor Information', ru: 'Информация для посетителей' }, href: '/visit/info' },
      { label: { lt: 'Darbo laikas', en: 'Opening Hours', ru: 'Часы работы' }, href: '/visit/hours' },
      { label: { lt: 'Vieta ir nuorodos', en: 'Location & Directions', ru: 'Местоположение и как добраться' }, href: '/visit/location' },
      { label: { lt: 'Piligrimystė', en: 'Pilgrimage', ru: 'Паломничество' }, href: '/visit/pilgrimage' },
    ],
  },
  {
    label: { lt: 'Kontaktai', en: 'Contact', ru: 'Контакты' },
    href: '/contact',
  },
];

/**
 * Footer legal links — always present regardless of tenant.
 */
export const legalNav: NavItem[] = [
  { label: { lt: 'Privatumas', en: 'Privacy', ru: 'Конфиденциальность' }, href: '/privacy' },
  { label: { lt: 'Slapukai', en: 'Cookies', ru: 'Cookies' }, href: '/cookies' },
  { label: { lt: 'Prieinamumas', en: 'Accessibility', ru: 'Доступность' }, href: '/accessibility-statement' },
];
