'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import GooglePlacesSearch from './components/GooglePlacesSearch';
import StripePayment from './components/StripePayment';
import QRCodeDisplay from './components/QRCodeDisplay';

interface Place {
  place_id: string;
  name: string;
  formatted_address: string;
  geometry?: google.maps.places.PlaceGeometry;
}

// Komponent wewnętrzny obsługujący parametry URL
function MainContent() {
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUpgradeFlow, setIsUpgradeFlow] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    const success = searchParams.get('success');
    const placeId = searchParams.get('placeId');
    const sessionId = searchParams.get('session_id');
    const type = searchParams.get('type');

    if (success === 'true' && placeId && sessionId) {
      // Weryfikacja statusu płatności
      fetch(`/api/verify-payment?session_id=${sessionId}`)
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            setPaymentSuccess(true);
            if (type === 'upgrade') {
              setIsUpgradeFlow(true);
            }
            // Znajdź i ustaw dane miejsca
            const placesService = new google.maps.places.PlacesService(
              document.createElement('div')
            );
            placesService.getDetails(
              {
                placeId: placeId,
                fields: ['name', 'formatted_address', 'place_id', 'geometry'],
              },
              (place, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK && place) {
                  setSelectedPlace({
                    place_id: place.place_id!,
                    name: place.name!,
                    formatted_address: place.formatted_address!,
                    geometry: place.geometry,
                  });
                }
              }
            );
          } else {
            setError('Nie udało się zweryfikować płatności. Spróbuj ponownie.');
          }
        })
        .catch(() => {
          setError('Wystąpił błąd podczas weryfikacji płatności. Spróbuj ponownie.');
        });
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 text-center">
            Generator QR kodów do opinii Google
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-8 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="ml-3 text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {!paymentSuccess ? (
          <div className="space-y-8">
            {/* Instrukcje */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Jak to działa?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-600 font-semibold">1</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Wyszukaj firmę</h3>
                    <p className="mt-2 text-sm text-gray-500">
                      Wpisz nazwę swojej firmy w wyszukiwarce poniżej
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-600 font-semibold">2</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Dokonaj płatności</h3>
                    <p className="mt-2 text-sm text-gray-500">
                      Zapłać 199 zł za wygenerowanie kodu QR
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-600 font-semibold">3</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Pobierz kod QR</h3>
                    <p className="mt-2 text-sm text-gray-500">
                      Otrzymaj swój unikalny kod QR do opinii z możliwością personalizacji
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Wyszukiwarka */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Wyszukaj swoją firmę
                </h2>
                <GooglePlacesSearch onPlaceSelect={setSelectedPlace} />
              </div>

              {selectedPlace ? (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Wybrana firma
                  </h2>
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900">
                      {selectedPlace.name}
                    </h3>
                    <p className="text-gray-500 mt-1">
                      {selectedPlace.formatted_address}
                    </p>
                  </div>
                  <StripePayment
                    onSuccess={() => setPaymentSuccess(true)}
                    placeId={selectedPlace.place_id}
                  />
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Podsumowanie
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 text-gray-600">
                      <svg className="h-6 w-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>Wyszukaj swoją firmę na mapie</span>
                    </div>
                    <div className="flex items-center space-x-3 text-gray-600">
                      <svg className="h-6 w-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Potwierdź wybór lokalizacji</span>
                    </div>
                    <div className="flex items-center space-x-3 text-gray-600">
                      <svg className="h-6 w-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                      <span>Dokonaj płatności 199 zł</span>
                    </div>
                    <div className="flex items-center space-x-3 text-gray-600">
                      <svg className="h-6 w-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      <span>Pobierz swój kod QR z możliwością personalizacji</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6">
            {selectedPlace && (
              <QRCodeDisplay
                placeId={selectedPlace.place_id}
                placeName={selectedPlace.name}
                isUpgradeFlow={isUpgradeFlow}
              />
            )}
          </div>
        )}

        {/* Korzyści i przykłady - zawsze widoczne */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Korzyści */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Dlaczego warto używać kodów QR?
            </h2>
            <ul className="space-y-4">
              <li className="flex items-start">
                <svg className="h-6 w-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <h3 className="font-medium text-gray-900">Więcej opinii</h3>
                  <p className="text-gray-500">Ułatw klientom zostawienie opinii w Google - wystarczy zeskanować kod</p>
                </div>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <h3 className="font-medium text-gray-900">Lepsza widoczność</h3>
                  <p className="text-gray-500">Więcej opinii to lepsza pozycja w wynikach wyszukiwania Google</p>
                </div>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <h3 className="font-medium text-gray-900">Profesjonalny wygląd</h3>
                  <p className="text-gray-500">Spersonalizowane kody QR z logo firmy wyglądają profesjonalnie</p>
                </div>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <h3 className="font-medium text-gray-900">Łatwa instalacja</h3>
                  <p className="text-gray-500">Wydrukuj i umieść w widocznym miejscu - to wszystko!</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Przykłady użycia */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Gdzie umieścić kod QR?
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <svg className="h-8 w-8 text-blue-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <h3 className="font-medium text-gray-900 mb-1">Przy wejściu</h3>
                <p className="text-sm text-gray-500">Na drzwiach lub witrynie</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <svg className="h-8 w-8 text-blue-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                <h3 className="font-medium text-gray-900 mb-1">Przy kasie</h3>
                <p className="text-sm text-gray-500">Na terminalu lub ladzie</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <svg className="h-8 w-8 text-blue-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <h3 className="font-medium text-gray-900 mb-1">Na rachunku</h3>
                <p className="text-sm text-gray-500">Na paragonie lub fakturze</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <svg className="h-8 w-8 text-blue-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <h3 className="font-medium text-gray-900 mb-1">W menu</h3>
                <p className="text-sm text-gray-500">Na karcie lub cenniku</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} QR Reviews. Wszystkie prawa zastrzeżone.
          </p>
        </div>
      </footer>
    </div>
  );
}

// Komponent główny z Suspense
export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Ładowanie...
          </h1>
        </div>
      </div>
    }>
      <MainContent />
    </Suspense>
  );
} 