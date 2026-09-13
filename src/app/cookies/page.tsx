import type { Metadata } from 'next';
import fixture from '@/fixtures/tenant.json';
import { resolveLocale, type SupportedLocale } from '@/lib/resolve-locale';

export const metadata: Metadata = {
  title: 'Slapukų politika | Journey of Life',
  description: 'Slapukų (cookies) politika — Journey of Life Catholic Church platform',
};

export default function CookiesPage() {
  const locale: SupportedLocale = 'lt';
  const tenantName = resolveLocale(fixture.name, locale);
  const tenantEmail = fixture.identity?.email ?? '';

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Slapukų politika</h1>

      <div className="prose prose-lg space-y-6">
        <p className="text-gray-700">
          Paskutinis atnaujinimas: 2026 m. rugsėjo 13 d.
        </p>

        <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-8">
          <p className="text-amber-800">
            <strong>Pastaba:</strong> Ši slapukų politika yra parengiamoji ir turi būti peržiūrėta teisininkų prieš paskelbiant viešai.
            Ji parengta pagal e. privatumo direktyvą (2002/58/EB) ir BDAR (ES reglamentas 2016/679) reikalavimus.
          </p>
        </div>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">1. Kas yra slapukai</h2>
          <p className="text-gray-700">
            Slapukai — tai maži tekstiniai failai, kurie įrašomi į jūsų įrenginį, kai lankotės svetainėje.
            Jie padeda svetainei atpažinti jūsų įrenginį ir teikti tinkamesnę patirtį.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">2. Kokius slapukus naudojame</h2>
          <p className="text-gray-700">
            {tenantName} svetainėje naudojami šie slapukai:
          </p>

          <h3 className="text-xl font-medium mt-6 mb-3">Būtinieji slapukai</h3>
          <p className="text-gray-700">
            Šie slapukai yra būtini svetainės funkcionavimui. Be jų svetainė negalėtų tinkamai veikti.
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mt-2">
            <li><strong>session_id</strong> — sesijos identifikatorius (galioja iki naršymo sesijos pabaigos)</li>
            <li><strong>cookie_consent</strong> — jūsų sutikimo su slapukais būsena (galioja 6 mėn.)</li>
          </ul>

          <h3 className="text-xl font-medium mt-6 mb-3">Analitiniai slapukai (su sutikimu)</h3>
          <p className="text-gray-700">
            Šie slapukai renka informaciją apie tai, kaip lankytojai naudojasi svetaine.
            Jie aktyvuojami tik gavus jūsų sutikimą.
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mt-2">
            <li><strong>_ga</strong> — Google Analytics lankytojų identifikatorius (galioja 2 metus)</li>
            <li><strong>_gid</strong> — Google Analytics sesijos identifikatorius (galioja 24 val.)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">3. Kaip valdyti slapukus</h2>
          <p className="text-gray-700">
            Jūs galite valdyti ir (arba) ištrinti slapukus savo naršyklės nustatymuose.
            Daugiau informacijos rasite adresu <a href="https://www.aboutcookies.org" className="text-amber-600 hover:underline" target="_blank" rel="noopener noreferrer">aboutcookies.org</a>.
          </p>
          <p className="text-gray-700 mt-4">
            Atkreipkite dėmesį, kad ištrynus būtinuosius slapukus, svetainė gali netinkamai veikti.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">4. Sutikimas</h2>
          <p className="text-gray-700">
            Pirmąkart apsilankę svetainėje, matysite slapukų juostą, kurioje galėsite pasirinkti,
            kokius slapukus leidžiate naudoti. Būtinieji slapukai įrašomi automatiškai, nes jie
            yra būtini svetainės funkcionavimui. Analitiniai slapukai aktyvuojami tik su jūsų sutikimu.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">5. Kontaktai</h2>
          <p className="text-gray-700">
            Jei turite klausimų apie slapukų politiką, susisiekite:<br />
            <br />
            {tenantName}<br />
            {fixture.identity?.address}<br />
            El. paštas: {tenantEmail}
          </p>
          <p className="text-gray-700 mt-4">
            Daugiau informacijos apie asmens duomenų tvarkymą rasite mūsų{' '}
            <a href="/privacy" className="text-amber-600 hover:underline">privatumo politikoje</a>.
          </p>
        </section>
      </div>

      <div className="mt-12 pt-8 border-t">
        <a href="/" className="text-amber-600 hover:underline">← Grįžti į pagrindinį puslapį</a>
      </div>
    </div>
  );
}
