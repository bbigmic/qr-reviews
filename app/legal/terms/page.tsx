import Logo from '@/app/components/Logo';
import Link from 'next/link';

export default function Terms() {
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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Regulamin</h1>
        
        <div className="prose prose-blue max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Postanowienia ogólne</h2>
            <p>Niniejszy regulamin określa zasady korzystania z serwisu QR Reviews, dostępnego pod adresem kodqr.eu.</p>
            <p>Właścicielem serwisu jest QR Reviews z siedzibą w Polsce.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Definicje</h2>
            <ul className="list-disc pl-6 mt-2">
              <li><strong>Serwis</strong> - strona internetowa dostępna pod adresem kodqr.eu</li>
              <li><strong>Użytkownik</strong> - osoba fizyczna lub prawna korzystająca z Serwisu</li>
              <li><strong>Kod QR</strong> - wygenerowany przez Serwis kod prowadzący do strony z opiniami Google</li>
              <li><strong>Partner Afiliacyjny</strong> - osoba lub firma uczestnicząca w programie afiliacyjnym Serwisu</li>
              <li><strong>Administrator</strong> - QR Reviews z siedzibą w Polsce, będący właścicielem i operatorem Serwisu</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Zakres usług</h2>
            <p>Serwis świadczy następujące usługi:</p>
            <ul className="list-disc pl-6 mt-2">
              <li>Generowanie kodów QR do zbierania opinii Google</li>
              <li>Personalizacja kodów QR</li>
              <li>Program afiliacyjny</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Warunki korzystania</h2>
            <p>Użytkownik zobowiązuje się do:</p>
            <ul className="list-disc pl-6 mt-2">
              <li>Podawania prawdziwych danych</li>
              <li>Przestrzegania praw własności intelektualnej</li>
              <li>Nienaruszania praw osób trzecich</li>
              <li>Niekorzystania z Serwisu w sposób niezgodny z prawem</li>
              <li>Przestrzegania zasad przetwarzania danych osobowych określonych w Umowie Powierzenia Przetwarzania Danych (DPA), która stanowi załącznik do niniejszego Regulaminu i jest dostępna pod adresem <a href="/legal/dpa" className="text-blue-600 hover:text-blue-500" target="_blank">Umowa DPA</a></li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Płatności i rozliczenia</h2>
            <p>Zasady dotyczące płatności:</p>
            <ul className="list-disc pl-6 mt-2">
              <li>Domyślna opłata za wygenerowanie kodu QR wynosi 199 zł. Użycie kodu rabatowego zmniejszą tą opłatę. (minimalna opłata wynosi ok. 2 zł)</li>
              <li>Domyślna opłata za dodanie logo do QR kodu wynosi 19 zł. Użycie kodu rabatowego zmniejszą tą opłatę. (minimalna opłata wynosi ok. 2 zł)</li>
              <li>Płatności są realizowane przez zewnętrznego operatora płatności</li>
              <li>Faktury są wystawiane automatycznie po dokonaniu płatności</li>
              <li>W przypadku programu afiliacyjnego, prowizje są wypłacane miesięcznie</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Polityka zwrotów</h2>
            <p>Zasady zwrotów:</p>
            <ul className="list-disc pl-6 mt-2">
              <li>Zwrot jest możliwy w ciągu 14 dni od zakupu</li>
              <li>Zwrot nie jest możliwy po wygenerowaniu i pobraniu kodu QR</li>
              <li>Środki są zwracane w tej samej formie, w jakiej dokonano płatności lub innej określonej przez Administratora</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Program afiliacyjny</h2>
            <p>Zasady programu afiliacyjnego:</p>
            <ul className="list-disc pl-6 mt-2">
              <li>Prowizja wynosi do 50% od każdej sprzedaży</li>
              <li>Szczegóły dotyczące wysokości prowizji oraz warunków jej wypłaty są ustalane indywidualnie z każdym Partnerem Afiliacyjnym</li>
              <li>Minimalna kwota wypłaty wynosi 1000 zł lub mniej w przypadku złożenia wniosku i pozytywnym rozpatrzeniu go przez Administratora. Wniosek należy składać mailowo na kontakt@kodqr.eu</li>
              <li>Wypłaty są realizowane do 10. dnia każdego miesiąca</li>
              <li>Partner może oferować rabaty w ramach ustalonego limitu</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Odpowiedzialność</h2>
            <p>Ograniczenia odpowiedzialności:</p>
            <ul className="list-disc pl-6 mt-2">
              <li>Serwis nie odpowiada za treść opinii pozostawianych przez klientów</li>
              <li>Serwis nie gwarantuje określonej liczby opinii</li>
              <li>Serwis nie ponosi odpowiedzialności za przerwy w działaniu wynikające z przyczyn technicznych</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Własność intelektualna</h2>
            <p>Prawa własności intelektualnej:</p>
            <ul className="list-disc pl-6 mt-2">
              <li>Wszelkie prawa do Serwisu są zastrzeżone</li>
              <li>Użytkownik może korzystać z wygenerowanych kodów QR w ramach zakupionej licencji</li>
              <li>Zabronione jest kopiowanie i rozpowszechnianie elementów Serwisu</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Postanowienia końcowe</h2>
            <ul className="list-disc pl-6 mt-2">
              <li>Regulamin wchodzi w życie z dniem publikacji</li>
              <li>Serwis zastrzega sobie prawo do zmiany Regulaminu</li>
              <li>W sprawach nieuregulowanych zastosowanie mają przepisy prawa polskiego</li>
              <li>Wszelkie spory będą rozstrzygane przez sąd właściwy dla siedziby Serwisu</li>
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
} 