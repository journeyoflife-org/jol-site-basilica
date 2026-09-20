import type { Metadata } from 'next';
import fixture from '@/fixtures/tenant.json';
import { resolveLocale } from '@/lib/resolve-locale';
import { resolvePageLocale } from '@/lib/locale-context';

export function generateMetadata(_props: { params: Record<string, string> }): Metadata {
  return {
  title: 'Privatumo politika | Journey of Life',
  description: 'Privatumo politika — Journey of Life Catholic Church platform',
  };
}

export default function PrivacyPage({ params }: { params: Record<string, string> }) {
  const locale = resolvePageLocale(params);
  const tenantName = resolveLocale(fixture.name, locale);
  const tenantEmail = fixture.identity?.email ?? '';

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Privatumo politika</h1>

      <div className="prose prose-lg space-y-6">
        <p className="text-gray-700">
          Paskutinis atnaujinimas: 2026 m. rugsėjo 13 d.
        </p>

        <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-8">
          <p className="text-amber-800">
            <strong>Pastaba:</strong> Ši privatumo politika yra parengiamoji ir turi būti peržiūrėta teisininkų prieš paskelbiant viešai.
            Ji atitinka BDAR (ES reglamentas 2016/679) 13 ir 14 straipsnių reikalavimus, tačiau konkrečios nuostatos turi būti pritaikytos
            pagal faktinį duomenų tvarkymą.
          </p>
        </div>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">1. Duomenų valdytojas</h2>
          <p className="text-gray-700">
            {tenantName}<br />
            {fixture.identity?.address}<br />
            El. paštas: {tenantEmail}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">2. Kokius asmens duomenis renkame</h2>
          <p className="text-gray-700">
            Ši svetainė renka šiuos asmens duomenis:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mt-4">
            <li><strong>Tekniniai duomenys:</strong> IP adresas, naršyklės tipas, įrenginio informacija (automatiškai surenkami)</li>
            <li><strong>Slapukai:</strong> būtinieji slapukai svetainės funkcionavimui</li>
            <li><strong>Analitiniai duomenys:</strong> savarankiška analitikos sistema (be trečiųjų šalių SDK), renkama tik su jūsų sutikimu per naršyklės localStorage</li>
            <li><strong>Kontaktiniai duomenys:</strong> jei susisiekiate el. paštu ar per kontaktinę formą</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">3. Duomenų tvarkymo tikslai</h2>
          <p className="text-gray-700">
            Jūsų asmens duomenys tvarkomi šiais tikslais:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mt-4">
            <li>Svetainės funkcionavimas ir saugumas</li>
            <li>Ryšys su lankytojais (atsakymai į užklausas)</li>
            <li>Statistinė analizė (su jūsų sutikimu)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">4. Jūsų teisės</h2>
          <p className="text-gray-700">
            Pagal BDAR jūs turite šias teises:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mt-4">
            <li>Teisė susipažinti su savo duomenimis</li>
            <li>Teisė ištaisyti netikslius duomenis</li>
            <li>Teisė ištrinti duomenis ("teisė būti pamirštam")</li>
            <li>Teisė apriboti duomenų tvarkymą</li>
            <li>Teisė į duomenų perkeliamumą</li>
            <li>Teisė nesutikti su duomenų tvarkymu</li>
          </ul>
          <p className="text-gray-700 mt-4">
            Norėdami pasinaudoti šiomis teisėmis, susisiekite su mumis el. paštu: {tenantEmail}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">5. Slapukai</h2>
          <p className="text-gray-700">
            Išsamią informaciją apie slapukus rasite mūsų{' '}
            <a href="/cookies" className="text-amber-600 hover:underline">slapukų politikoje</a>.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">6. Kontaktai</h2>
          <p className="text-gray-700">
            Jei turite klausimų apie šią privatumo politiką arba savo asmens duomenų tvarkymą, susisiekite:<br />
            <br />
            {tenantName}<br />
            {fixture.identity?.address}<br />
            El. paštas: {tenantEmail}
          </p>
        </section>
      </div>

      <div className="mt-12 pt-8 border-t">
        <a href="/" className="text-amber-600 hover:underline">← Grįžti į pagrindinį puslapį</a>
      </div>
    </div>
  );
}
