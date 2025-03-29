import Logo from '@/app/components/Logo';
import Link from 'next/link';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/" className="flex items-center">
                  <Logo className="h-8 w-auto mr-3" />
                  <span className="text-xl font-bold text-gray-900">QR Reviews</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Polityka Prywatności</h1>
        
        <div className="prose prose-blue max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Informacje ogólne</h2>
            <p>Niniejsza Polityka Prywatności określa zasady przetwarzania i ochrony danych osobowych przekazanych przez Użytkowników w związku z korzystaniem z serwisu QR Reviews.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Administrator danych osobowych</h2>
            <p>Administratorem danych osobowych jest QR Reviews z siedzibą w Polsce.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Zakres zbieranych danych</h2>
            <p>Przetwarzamy następujące dane osobowe:</p>
            <ul className="list-disc pl-6 mt-2">
              <li>Dane identyfikacyjne firm (nazwa, adres)</li>
              <li>Dane kontaktowe (adres email, numer telefonu)</li>
              <li>Dane płatności</li>
              <li>Dane dotyczące korzystania z serwisu (pliki cookies)</li>
              <li>W przypadku programu afiliacyjnego: dane rozliczeniowe</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Cel i podstawa przetwarzania</h2>
            <p>Dane osobowe przetwarzamy w następujących celach:</p>
            <ul className="list-disc pl-6 mt-2">
              <li>Świadczenie usług generowania kodów QR (podstawa: umowa)</li>
              <li>Obsługa płatności (podstawa: umowa)</li>
              <li>Realizacja programu afiliacyjnego (podstawa: umowa)</li>
              <li>Marketing własnych usług (podstawa: uzasadniony interes)</li>
              <li>Analiza i poprawa jakości usług (podstawa: uzasadniony interes)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Okres przechowywania danych</h2>
            <p>Dane osobowe przechowujemy przez okres:</p>
            <ul className="list-disc pl-6 mt-2">
              <li>Aktywności konta w serwisie</li>
              <li>Wymagany przez przepisy podatkowe (5 lat)</li>
              <li>Do momentu wniesienia sprzeciwu (marketing)</li>
              <li>Do momentu wycofania zgody</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Prawa użytkownika</h2>
            <p>Użytkownik ma prawo do:</p>
            <ul className="list-disc pl-6 mt-2">
              <li>Dostępu do swoich danych</li>
              <li>Sprostowania danych</li>
              <li>Usunięcia danych (&quot;prawo do bycia zapomnianym&quot;)</li>
              <li>Ograniczenia przetwarzania</li>
              <li>Przenoszenia danych</li>
              <li>Wniesienia sprzeciwu</li>
              <li>Wycofania zgody na przetwarzanie</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Pliki cookies</h2>
            <p>Serwis wykorzystuje pliki cookies w celu:</p>
            <ul className="list-disc pl-6 mt-2">
              <li>Zapewnienia prawidłowego działania serwisu</li>
              <li>Zapamiętywania preferencji użytkownika</li>
              <li>Celów statystycznych</li>
              <li>Personalizacji treści marketingowych</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Bezpieczeństwo danych</h2>
            <p>Stosujemy odpowiednie środki techniczne i organizacyjne zapewniające bezpieczeństwo danych osobowych, w tym:</p>
            <ul className="list-disc pl-6 mt-2">
              <li>Szyfrowanie SSL</li>
              <li>Zabezpieczenia baz danych</li>
              <li>Regularne aktualizacje zabezpieczeń</li>
              <li>Kontrolę dostępu</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Kontakt</h2>
            <p>W sprawach związanych z ochroną danych osobowych można kontaktować się z nami:</p>
            <ul className="list-disc pl-6 mt-2">
              <li>Email: kontakt@qrkod.eu</li>
              <li>Adres: [Adres firmy]</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Zmiany polityki prywatności</h2>
            <p>Zastrzegamy sobie prawo do wprowadzania zmian w Polityce Prywatności. O wszelkich zmianach będziemy informować użytkowników poprzez stronę internetową.</p>
          </section>
        </div>
      </main>
    </div>
  );
} 