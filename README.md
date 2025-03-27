# QR Reviews - Generator QR kodów do opinii Google

Aplikacja SAAS do generowania QR kodów, które przekierowują klientów bezpośrednio do strony z opinią Google dla Twojej firmy.

## Funkcje

- Wyszukiwarka firm z wykorzystaniem Google Places API
- Integracja z systemem płatności Stripe
- Generowanie QR kodów do opinii Google
- Responsywny interfejs użytkownika

## Wymagania

- Node.js 18+
- Konto Google Cloud z włączonym Places API
- Konto Stripe
- Zmienne środowiskowe skonfigurowane w pliku `.env.local`

## Instalacja

1. Sklonuj repozytorium:
```bash
git clone [url-repozytorium]
cd qr-reviews
```

2. Zainstaluj zależności:
```bash
npm install
```

3. Skonfiguruj zmienne środowiskowe:
- Skopiuj plik `.env.local.example` do `.env.local`
- Uzupełnij wymagane klucze API:
  - `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` - klucz API Google Maps
  - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - klucz publiczny Stripe
  - `STRIPE_SECRET_KEY` - klucz sekretny Stripe
  - `NEXT_PUBLIC_BASE_URL` - URL aplikacji

4. Uruchom aplikację w trybie deweloperskim:
```bash
npm run dev
```

## Użycie

1. Wpisz nazwę swojej firmy w wyszukiwarkę
2. Wybierz swoją firmę z listy wyników
3. Kliknij przycisk "Zapłać 49 zł i wygeneruj QR kod"
4. Wykonaj płatność przez Stripe
5. Pobierz wygenerowany QR kod i link do opinii

## Technologie

- Next.js 14
- TypeScript
- Tailwind CSS
- Google Maps Places API
- Stripe
- QRCode.react

## Licencja

MIT
