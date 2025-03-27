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
  const searchParams = useSearchParams();

  useEffect(() => {
    const success = searchParams.get('success');
    const placeId = searchParams.get('placeId');
    const sessionId = searchParams.get('session_id');

    if (success === 'true' && placeId && sessionId) {
      // Weryfikacja statusu płatności
      fetch(`/api/verify-payment?session_id=${sessionId}`)
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            setPaymentSuccess(true);
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
                      Otrzymaj swój unikalny kod QR do opinii
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Wyszukiwarka */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Wyszukaj swoją firmę
              </h2>
              <GooglePlacesSearch onPlaceSelect={setSelectedPlace} />
            </div>

            {/* Wybrana firma i płatność */}
            {selectedPlace && (
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
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6">
            {selectedPlace && (
              <QRCodeDisplay
                placeId={selectedPlace.place_id}
                placeName={selectedPlace.name}
              />
            )}
          </div>
        )}
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