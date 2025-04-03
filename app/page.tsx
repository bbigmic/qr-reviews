'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import GooglePlacesSearch from './components/GooglePlacesSearch';
import StripePayment from './components/StripePayment';
import QRCodeDisplay from './components/QRCodeDisplay';
import Logo from './components/Logo';

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
          <div className="flex items-center justify-center space-x-4">
            <Logo className="h-12 w-auto" />
            <h1 className="text-3xl font-bold text-gray-900">
              Generator QR kodów do opinii Google
            </h1>
          </div>
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
            {/* Korzyści i przykłady - przeniesione na górę */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

            {/* Instrukcje */}
            <div id="jak-to-dziala" className="bg-white rounded-lg shadow-md p-6">
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
                      Zapłać za wygenerowanie kodu QR
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
            <div id="generator" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                      <span>Dokonaj płatności </span>
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

        {/* Sekcja o wizytówce Google */}
        <div className="bg-gradient-to-br from-gray-50 to-white py-16 my-12 rounded-2xl shadow-sm border border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Nie możesz znaleźć swojej firmy?
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Prawdopodobnie nie masz jeszcze wizytówki Google. Zgłoś się do nas, a stworzymy ją dla Ciebie za darmo!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="h-12 w-12 mx-auto mb-4 text-blue-600">
                  <svg className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">Większa Widoczność</h3>
                <p className="text-gray-600 text-center">
                  Twoja firma będzie łatwiej znajdowana w Google Maps i wyszukiwarce Google
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="h-12 w-12 mx-auto mb-4 text-blue-600">
                  <svg className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">Opinie Klientów</h3>
                <p className="text-gray-600 text-center">
                  Możliwość zbierania i wyświetlania opinii klientów, budując zaufanie do Twojej marki
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="h-12 w-12 mx-auto mb-4 text-blue-600">
                  <svg className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">Wzrost Sprzedaży</h3>
                <p className="text-gray-600 text-center">
                  Firmy z wizytówką Google otrzymują średnio o 70% więcej zapytań od potencjalnych klientów
                </p>
              </div>
            </div>

            <div className="text-center mt-12">
              <a
                href="mailto:kontakt@qrkod.eu"
                className="inline-flex items-center px-6 py-3 border border-transparent text-lg font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg transition-all duration-200 hover:shadow-xl"
              >
                Skontaktuj się z nami
                <svg className="ml-2 -mr-1 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Sekcja o programie afiliacyjnym */}
        <div className="bg-gradient-to-br from-blue-600 via-blue-500 to-blue-600 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">
                Zarabiaj Polecając QR Reviews
              </h2>
              <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                Dołącz do programu afiliacyjnego i zarabiaj na każdym poleceniu. Twoi klienci otrzymają rabat, a Ty prowizję!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <div className="bg-white rounded-xl p-8 shadow-xl transform hover:scale-105 transition-transform duration-300">
                <div className="h-14 w-14 mx-auto mb-6 bg-blue-100 rounded-2xl flex items-center justify-center">
                  <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">50% Prowizji</h3>
                <p className="text-gray-600 text-center text-lg">
                  Otrzymuj połowę wartości każdego zamówienia zrealizowanego z Twoim kodem
                </p>
              </div>

              <div className="bg-white rounded-xl p-8 shadow-xl transform hover:scale-105 transition-transform duration-300">
                <div className="h-14 w-14 mx-auto mb-6 bg-blue-100 rounded-2xl flex items-center justify-center">
                  <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Rabaty dla Klientów</h3>
                <p className="text-gray-600 text-center text-lg">
                  Zaoferuj swoim klientom atrakcyjny rabat na zakup kodu QR
                </p>
              </div>

              <div className="bg-white rounded-xl p-8 shadow-xl transform hover:scale-105 transition-transform duration-300">
                <div className="h-14 w-14 mx-auto mb-6 bg-blue-100 rounded-2xl flex items-center justify-center">
                  <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Błyskawiczne Wypłaty</h3>
                <p className="text-gray-600 text-center text-lg">
                  Wypłacaj zarobione prowizje szybko i bezpiecznie na swoje konto
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-xl max-w-lg mx-auto backdrop-blur-lg bg-opacity-95">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Rozpocznij Współpracę
              </h3>
              <form className="space-y-6" onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                fetch('/api/affiliate-signup', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    email: formData.get('email'),
                    phone: formData.get('phone'),
                  }),
                })
                .then(response => response.json())
                .then(data => {
                  if (data.success) {
                    alert('Dziękujemy za zgłoszenie! Skontaktujemy się z Tobą wkrótce.');
                    (e.target as HTMLFormElement).reset();
                  } else {
                    alert('Wystąpił błąd. Spróbuj ponownie później.');
                  }
                })
                .catch(() => {
                  alert('Wystąpił błąd. Spróbuj ponownie później.');
                });
              }}>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Adres Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    required
                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-3 px-4"
                    placeholder="jan.kowalski@example.com"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Numer Telefonu
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    required
                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-3 px-4"
                    placeholder="+48 123 456 789"
                  />
                </div>
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="terms"
                      name="terms"
                      type="checkbox"
                      required
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="terms" className="font-medium text-gray-700">
                      Akceptuję{' '}
                      <a href="/legal/terms" className="text-blue-600 hover:text-blue-500" target="_blank">
                        Regulamin
                      </a>
                      {' '}oraz{' '}
                      <a href="/legal/privacy-policy" className="text-blue-600 hover:text-blue-500" target="_blank">
                        Politykę Prywatności
                      </a>
                    </label>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full flex justify-center items-center px-8 py-4 border border-transparent text-lg font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg transition-all duration-200 hover:shadow-xl"
                >
                  Dołącz do Programu
                  <svg className="ml-2 -mr-1 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center space-y-4">
            <div className="flex space-x-6">
              <a href="/legal/privacy-policy" className="text-gray-500 hover:text-gray-900 text-sm">
                Polityka Prywatności
              </a>
              <a href="/legal/terms" className="text-gray-500 hover:text-gray-900 text-sm">
                Regulamin
              </a>
            </div>
            <p className="text-center text-gray-500 text-sm">
              © {new Date().getFullYear()} QR Reviews. Wszystkie prawa zastrzeżone.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Komponent główny z Suspense
export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Sekcja Hero */}
      <div className="relative overflow-hidden">
        {/* Zdjęcie w tle */}
        <div className="absolute inset-0 w-full h-full">
          <div 
            className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: 'url("/hero-background.png")'
            }}
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-white/10"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative">
          <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block">Zbieraj opinie</span>
                  <span className="block text-blue-600">łatwiej niż kiedykolwiek</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Generuj unikalne kody QR, które przekierują Twoich klientów bezpośrednio do wystawienia opinii w Google. 
                  Zwiększ liczbę pozytywnych opinii i popraw widoczność swojej firmy.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <a
                      href="#generator"
                      onClick={(e) => {
                        e.preventDefault();
                        document.getElementById('generator')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
                    >
                      Wygeneruj kod QR
                    </a>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <a
                      href="#jak-to-dziala"
                      onClick={(e) => {
                        e.preventDefault();
                        document.getElementById('jak-to-dziala')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 md:py-4 md:text-lg md:px-10"
                    >
                      Jak to działa?
                    </a>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* Główna zawartość */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <MainContent />
      </div>
    </div>
  );
} 