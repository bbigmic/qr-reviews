'use client';

import { useEffect, useRef, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import QRCodeStyling from 'qr-code-styling';

type QRDotType = 'rounded' | 'dots' | 'square';
type QRCornerSquareType = 'extra-rounded' | 'rounded' | 'square';
type QRCornerDotType = 'dot' | 'square';

declare module 'qr-code-styling' {
  interface QRCodeStylingOptions {
    width: number;
    height: number;
    data: string;
    margin?: number;
    dotsOptions?: {
      color: string;
      type: QRDotType;
    };
    cornersSquareOptions?: {
      color: string;
      type: QRCornerSquareType;
    };
    cornersDotOptions?: {
      color: string;
      type: QRCornerDotType;
    };
    backgroundOptions?: {
      color: string;
    };
    imageOptions?: {
      crossOrigin: string;
      margin: number;
      imageSize?: number;
    };
    image?: string;
  }
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface QRCodeDisplayProps {
  placeId: string;
  placeName: string;
  isUpgradeFlow?: boolean;
}

export default function QRCodeDisplay({ placeId, placeName, isUpgradeFlow = false }: QRCodeDisplayProps) {
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [logo, setLogo] = useState<string | null>(null);
  const [logoSize, setLogoSize] = useState(0.4);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [dotsStyle, setDotsStyle] = useState<QRDotType>("rounded");
  const [dotsColor, setDotsColor] = useState("#1a1a1a");
  const [cornerSquaresStyle, setCornerSquaresStyle] = useState<QRCornerSquareType>("extra-rounded");
  const [cornerSquaresColor, setCornerSquaresColor] = useState("#1a1a1a");
  const [cornerDotsStyle, setCornerDotsStyle] = useState<QRCornerDotType>("dot");
  const [cornerDotsColor, setCornerDotsColor] = useState("#1a1a1a");
  const [showText, setShowText] = useState(false);
  const [customText, setCustomText] = useState("Oceń nas");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const qrRef = useRef<HTMLDivElement>(null);
  const qrCode = useRef<QRCodeStyling | null>(null);
  
  const reviewUrl = `https://search.google.com/local/writereview?placeid=${placeId}`;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      qrCode.current = new QRCodeStyling({
        width: 1024,
        height: 1024,
        data: reviewUrl,
        margin: 16,
        dotsOptions: {
          color: dotsColor,
          type: dotsStyle
        },
        cornersSquareOptions: {
          color: cornerSquaresColor,
          type: cornerSquaresStyle
        },
        cornersDotOptions: {
          color: cornerDotsColor,
          type: cornerDotsStyle
        },
        backgroundOptions: {
          color: "#ffffff",
        },
        imageOptions: {
          crossOrigin: "anonymous",
          margin: 2,
          imageSize: logoSize
        },
        image: logo || undefined
      });

      if (qrRef.current) {
        qrRef.current.innerHTML = '';
        qrCode.current.append(qrRef.current);
      }
    }
  }, [reviewUrl, dotsStyle, dotsColor, cornerSquaresStyle, cornerSquaresColor, cornerDotsStyle, cornerDotsColor, logo, logoSize]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(reviewUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Nie udało się skopiować linku:', err);
    }
  };

  const handleUpgradePayment = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/create-upgrade-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ placeId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Wystąpił błąd podczas tworzenia sesji płatności');
      }

      if (!data.sessionId) {
        throw new Error('Nie otrzymano identyfikatora sesji płatności');
      }

      const stripe = await stripePromise;

      if (!stripe) {
        throw new Error('Nie można załadować Stripe');
      }

      const { error: stripeError } = await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      });

      if (stripeError) {
        throw new Error(stripeError.message);
      }
    } catch (error) {
      console.error('Błąd płatności:', error);
      setError(error instanceof Error ? error.message : 'Wystąpił nieznany błąd');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Sprawdź rozmiar pliku (max 1MB)
    if (file.size > 1024 * 1024) {
      setUploadError('Plik jest zbyt duży. Maksymalny rozmiar to 1MB.');
      return;
    }

    // Sprawdź typ pliku
    if (!file.type.startsWith('image/')) {
      setUploadError('Dozwolone są tylko pliki graficzne.');
      return;
    }

    try {
      setUploadError(null);
      setLoading(true);

      const formData = new FormData();
      formData.append('logo', file);

      const response = await fetch('/api/upload-logo', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Wystąpił błąd podczas przesyłania pliku');
      }

      setLogo(data.logoUrl);
    } catch (error) {
      console.error('Błąd podczas przesyłania logo:', error);
      setUploadError(error instanceof Error ? error.message : 'Wystąpił błąd podczas przesyłania pliku');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="bg-green-50 rounded-lg p-4 mb-8">
        <div className="flex items-center justify-center">
          <div className="flex-shrink-0">
            <svg className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-green-800">
              {isUpgradeFlow ? 'Ulepszenie zakończone sukcesem!' : 'Płatność zakończona sukcesem!'}
            </h3>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        {isUpgradeFlow ? 'Dodaj logo do swojego kodu QR' : 'Twój kod QR jest gotowy'}
      </h2>
      <p className="text-gray-600 mb-8">
        Dla firmy: {placeName}
      </p>

      <div className="mb-8 space-y-6">
        {isUpgradeFlow && (
          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="image/*"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Wybierz logo
            </button>
            {logo && (
              <div className="mt-4">
                <label htmlFor="logo-size" className="block text-sm font-medium text-gray-700 mb-2">
                  Rozmiar logo ({Math.round(logoSize * 100)}%)
                </label>
                <input
                  type="range"
                  id="logo-size"
                  min="0.1"
                  max="0.8"
                  step="0.05"
                  value={logoSize}
                  onChange={(e) => setLogoSize(parseFloat(e.target.value))}
                  className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>10%</span>
                  <span>80%</span>
                </div>
              </div>
            )}
            {uploadError && (
              <p className="mt-2 text-sm text-red-600">{uploadError}</p>
            )}
            <p className="mt-2 text-sm text-gray-500">
              Zalecany format logo: PNG lub JPG, max 1MB
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Styl punktów
            </label>
            <select
              value={dotsStyle}
              onChange={(e) => setDotsStyle(e.target.value as QRDotType)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="rounded">Zaokrąglone</option>
              <option value="dots">Kropki</option>
              <option value="square">Kwadratowe</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kolor punktów
            </label>
            <input
              type="color"
              value={dotsColor}
              onChange={(e) => setDotsColor(e.target.value)}
              className="w-full h-10 p-1 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Styl narożników
            </label>
            <select
              value={cornerSquaresStyle}
              onChange={(e) => setCornerSquaresStyle(e.target.value as QRCornerSquareType)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="extra-rounded">Bardzo zaokrąglone</option>
              <option value="rounded">Zaokrąglone</option>
              <option value="square">Kwadratowe</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kolor narożników
            </label>
            <input
              type="color"
              value={cornerSquaresColor}
              onChange={(e) => setCornerSquaresColor(e.target.value)}
              className="w-full h-10 p-1 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Styl punktów narożnych
            </label>
            <select
              value={cornerDotsStyle}
              onChange={(e) => setCornerDotsStyle(e.target.value as QRCornerDotType)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="dot">Kropka</option>
              <option value="square">Kwadrat</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kolor punktów narożnych
            </label>
            <input
              type="color"
              value={cornerDotsColor}
              onChange={(e) => setCornerDotsColor(e.target.value)}
              className="w-full h-10 p-1 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Dodatkowe opcje</h3>
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                id="show-text"
                type="checkbox"
                checked={showText}
                onChange={(e) => setShowText(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="show-text" className="ml-2 block text-sm text-gray-900">
                Dodaj tekst nad kodem QR
              </label>
            </div>

            {showText && (
              <div>
                <label htmlFor="custom-text" className="block text-sm font-medium text-gray-700 mb-2">
                  Własny tekst
                </label>
                <input
                  type="text"
                  id="custom-text"
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Oceń nas"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center mb-8">
        <div className="flex flex-col items-center justify-center" style={{ minHeight: '400px' }}>
          {showText && (
            <div className="mb-4 text-2xl font-bold text-gray-900">{customText}</div>
          )}
          <div ref={qrRef} className="qr-container" style={{ 
            transform: 'scale(0.35)',
            transformOrigin: 'center center',
            height: '358px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}></div>
        </div>
      </div>

      <div className="space-y-4">
        <button
          onClick={async () => {
            if (!qrCode.current) return;

            const container = document.createElement('div');
            container.style.position = 'absolute';
            container.style.left = '-9999px';
            container.style.width = '1024px';
            container.style.height = '1024px';
            container.style.backgroundColor = 'white';
            container.style.display = 'flex';
            container.style.flexDirection = 'column';
            container.style.alignItems = 'center';
            container.style.justifyContent = 'center';
            container.style.padding = '20px';
            container.style.boxSizing = 'border-box';

            document.body.appendChild(container);

            try {
              // Pobierz QR kod jako obraz
              const qrBlob = await qrCode.current.getRawData('png') as Blob;
              if (!qrBlob) return;

              // Stwórz canvas do złożenia finalnego obrazu
              const canvas = document.createElement('canvas');
              canvas.width = 2048; // 2x scale
              canvas.height = 2048;
              const ctx = canvas.getContext('2d');
              if (!ctx) return;

              // Wypełnij tło
              ctx.fillStyle = 'white';
              ctx.fillRect(0, 0, canvas.width, canvas.height);

              // Oblicz całkowitą wysokość wszystkich elementów
              const qrSize = 1600;
              const textHeight = showText ? 120 : 0; // Wysokość tekstu
              const textMargin = showText ? 80 : 0; // Margines pod tekstem
              const totalHeight = textHeight + textMargin + qrSize;

              // Oblicz pozycję startową Y, aby wszystko było wycentrowane w pionie
              const startY = (canvas.height - totalHeight) / 2;
              let currentY = startY;

              // Dodaj tekst jeśli jest włączony
              if (showText) {
                ctx.font = 'bold 96px Arial';
                ctx.fillStyle = '#1a1a1a';
                ctx.textAlign = 'center';
                ctx.fillText(customText, canvas.width / 2, currentY + 96); // +96 to wysokość tekstu
                currentY += textHeight + textMargin;
              }

              // Wczytaj i narysuj QR kod
              const qrImage = new Image();
              qrImage.src = URL.createObjectURL(qrBlob);
              await new Promise((resolve) => {
                qrImage.onload = () => {
                  const x = (canvas.width - qrSize) / 2;
                  ctx.drawImage(qrImage, x, currentY, qrSize, qrSize);
                  resolve(null);
                };
              });

              // Pobierz finalny obraz
              const link = document.createElement('a');
              link.download = `qr-kod-${placeName.toLowerCase().replace(/\s+/g, '-')}${logo ? '-z-logo' : ''}.png`;
              link.href = canvas.toDataURL('image/png');
              link.click();
            } finally {
              document.body.removeChild(container);
            }
          }}
          className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Pobierz kod QR
        </button>

        <button
          onClick={handleCopyLink}
          className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
          </svg>
          {copied ? 'Skopiowano!' : 'Kopiuj link'}
        </button>
      </div>

      {!isUpgradeFlow && (
        <div className="mt-8 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Ulepsz swój kod QR o logo firmy!
          </h3>
          <p className="text-gray-600 mb-4">
            Spraw, by Twój kod QR wyróżniał się i był bardziej rozpoznawalny dzięki dodaniu logo Twojej firmy.
          </p>
          <div className="flex flex-col items-center space-y-4">
            <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600 mb-1">
                Tylko 20 zł
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Jednorazowa płatność
              </p>
            </div>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 w-full">
                <div className="flex">
                  <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="ml-3 text-sm text-red-700">{error}</p>
                </div>
              </div>
            )}
            <button
              onClick={handleUpgradePayment}
              disabled={loading}
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Przetwarzanie...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Ulepsz o logo za 20 zł
                </>
              )}
            </button>
          </div>
        </div>
      )}

      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-medium text-gray-900 mb-2">
          Jak używać kodu QR?
        </h3>
        <ol className="text-sm text-gray-600 text-left list-decimal list-inside space-y-2">
          <li>Wydrukuj kod QR i umieść go w widocznym miejscu w swojej firmie</li>
          <li>Poproś klientów o zeskanowanie kodu za pomocą aparatu w telefonie</li>
          <li>Klienci zostaną przekierowani bezpośrednio do strony z opinią</li>
        </ol>
      </div>
    </div>
  );
} 