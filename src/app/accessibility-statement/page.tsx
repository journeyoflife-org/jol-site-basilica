import type { Metadata } from 'next';
import fixture from '@/fixtures/tenant.json';
import { resolveLocale, type SupportedLocale } from '@/lib/resolve-locale';

export const metadata: Metadata = {
  title: 'Prieinamumo pareiškimas | Journey of Life',
  description: 'Prieinamumo (accessibility) pareiškimas — Journey of Life Catholic Church platform',
};

export default function AccessibilityStatementPage() {
  const locale: SupportedLocale = 'lt';
  const tenantName = resolveLocale(fixture.name, locale);
  const tenantEmail = fixture.identity?.email ?? '';

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Prieinamumo pareiškimas</h1>

      <div className="prose prose-lg space-y-6">
        <p className="text-gray-700">
          Paskutinis atnaujinimas: 2026 m. rugsėjo 13 d.
        </p>

        <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-8">
          <p className="text-amber-800">
            <strong>Pastaba:</strong> Šis prieinamumo pareiškimas yra parengiamasis ir turi būti peržiūrėtas
            prieš paskelbiant viešai. Parengtas pagal ES skaitmeninio prieinamumo direktyvą (ES) 2016/2102
            ir WCAG 2.2 standartą.
          </p>
        </div>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">1. Įsipareigojimas</h2>
          <p className="text-gray-700">
            {tenantName} įsipareigoja užtikrinti savo svetainės prieinamumą visiems lankytojams,
            ypač asmenims su negalia. Siekiame, kad svetainė būtų prieinama pagal
            WCAG 2.2 (Web Content Accessibility Guidelines) AA lygio standartą.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">2. Atitikties būsena</h2>
          <p className="text-gray-700">
            Ši svetainė iš dalies atitinka WCAG 2.2 AA lygio reikalavimus.
            Vykdomi šie veiksmai:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mt-4">
            <li>Semantinis HTML (teisinga antraščių hierarchija, landmark regionai)</li>
            <li>ARIA atributai ten, kur semantinių elementų nepakanka</li>
            <li>Klaviatūros navigacija — visos sąveikos pasiekiamos be pelės</li>
            <li>Spalvų kontrastas — tekstas ir sąveikos elementai atitinka AA kontrasto reikalavimus (4.5:1)</li>
            <li>Alternatyvusis tekstas (alt) visiems informatyviems vaizdams</li>
            <li>Responsyvus dizainas — svetainė veikia įvairiuose įrenginiuose ir ekrano dydžiuose</li>
            <li>„Skip to content" nuoroda — leidžia apeiti pasikartojančią navigaciją</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">3. Žinomi prieinamumo trūkumai</h2>
          <p className="text-gray-700">
            Šiuo metu žinomi trūkumai, kuriuos planuojame pašalinti:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mt-4">
            <li>Kai kurie vaizdai naudoja vietines rezervacijas (placeholder) — trūksta tikrų nuotraukų su aprašymais</li>
            <li>PDF dokumentų (jei bus paskelbti) prieinamumas dar neįvertintas</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">4. Grįžtamasis ryšys</h2>
          <p className="text-gray-700">
            Jei pastebėjote prieinamumo problemų arba jums reikia turinio alternatyviu formatu,
            prašome susisiekti:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mt-4">
            <li>El. paštas: {tenantEmail}</li>
            <li>Pašto adresas: {fixture.identity?.address}</li>
          </ul>
          <p className="text-gray-700 mt-4">
            Stengiamės atsakyti per 14 darbo dienų.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">5. Vykdymo procedūra</h2>
          <p className="text-gray-700">
            Jei manote, kad jūsų prašymas ar skundas dėl prieinamumo nebuvo tinkamai išnagrinėtas,
            galite kreiptis į Lygių galimybių kontrolieriaus tarnybą
            (<a href="https://www.lygybe.lt" className="text-amber-600 hover:underline" target="_blank" rel="noopener noreferrer">lygybe.lt</a>).
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">6. Techninė informacija</h2>
          <p className="text-gray-700">
            Ši svetainė sukurta naudojant šias technologijas:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mt-4">
            <li>HTML5</li>
            <li>CSS3 (Tailwind CSS)</li>
            <li>JavaScript (React / Next.js)</li>
            <li>WCAG 2.2 AA lygio tikslas</li>
          </ul>
          <p className="text-gray-700 mt-4">
            Automatiniai source lygio patikrinimai vykdomi kiekvieno pakeitimo metu.
            Pilnas testavimas su pagalbinėmis technologijomis (NVDA, VoiceOver, TalkBack)
            suplanuotas, bet dar neatliktas.
          </p>
        </section>
      </div>

      <div className="mt-12 pt-8 border-t">
        <a href="/" className="text-amber-600 hover:underline">← Grįžti į pagrindinį puslapį</a>
      </div>
    </div>
  );
}
