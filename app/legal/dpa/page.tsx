import Logo from '@/app/components/Logo';
import Link from 'next/link';

export default function DPA() {
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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Umowa Powierzenia Przetwarzania Danych</h1>
        
        <div className="prose prose-blue max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Strony umowy</h2>
            <p>Niniejsza umowa powierzenia przetwarzania danych osobowych zostaje zawarta pomiędzy:</p>
            <ul className="list-disc pl-6 mt-2">
              <li>QR Reviews (Administrator) z siedzibą w Polsce</li>
              <li>Użytkownikiem serwisu (Podmiot przetwarzający)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Przedmiot umowy</h2>
            <p>Administrator powierza Podmiotowi przetwarzającemu dane osobowe do przetwarzania w zakresie i celu określonym w niniejszej umowie, a Podmiot przetwarzający zobowiązuje się do ich przetwarzania zgodnie z prawem i niniejszą umową.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Zakres i cel przetwarzania</h2>
            <p>Zakres powierzonych danych obejmuje:</p>
            <ul className="list-disc pl-6 mt-2">
              <li>Dane identyfikacyjne firm</li>
              <li>Dane kontaktowe</li>
              <li>Dane dotyczące transakcji</li>
              <li>Dane związane z programem afiliacyjnym</li>
            </ul>
            <p className="mt-4">Cel przetwarzania:</p>
            <ul className="list-disc pl-6 mt-2">
              <li>Świadczenie usług generowania kodów QR</li>
              <li>Obsługa płatności</li>
              <li>Realizacja programu afiliacyjnego</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Obowiązki Podmiotu przetwarzającego</h2>
            <p>Podmiot przetwarzający zobowiązuje się do:</p>
            <ul className="list-disc pl-6 mt-2">
              <li>Przetwarzania danych zgodnie z RODO</li>
              <li>Zapewnienia bezpieczeństwa danych</li>
              <li>Zachowania poufności</li>
              <li>Pomocy Administratorowi w realizacji praw osób, których dane dotyczą</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Bezpieczeństwo danych</h2>
            <p>Podmiot przetwarzający wdraża odpowiednie środki techniczne i organizacyjne, aby zapewnić bezpieczeństwo danych:</p>
            <ul className="list-disc pl-6 mt-2">
              <li>Szyfrowanie danych</li>
              <li>Kontrola dostępu</li>
              <li>Regularne testowanie zabezpieczeń</li>
              <li>Procedury awaryjne</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Podpowierzenie</h2>
            <p>Podmiot przetwarzający może podpowierzyć przetwarzanie danych innemu podmiotowi tylko za zgodą Administratora.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Audyt</h2>
            <p>Administrator ma prawo do przeprowadzenia audytu przetwarzania danych przez Podmiot przetwarzający.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Odpowiedzialność</h2>
            <p>Podmiot przetwarzający odpowiada za szkody spowodowane przetwarzaniem danych osobowych niezgodnie z umową lub przepisami prawa.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Czas trwania umowy</h2>
            <p>Umowa obowiązuje przez okres korzystania z usług Serwisu przez Podmiot przetwarzający.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Postanowienia końcowe</h2>
            <ul className="list-disc pl-6 mt-2">
              <li>Umowa wchodzi w życie z dniem rozpoczęcia korzystania z Serwisu</li>
              <li>Wszelkie zmiany umowy wymagają formy pisemnej</li>
              <li>W sprawach nieuregulowanych zastosowanie mają przepisy RODO i prawa polskiego</li>
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
} 