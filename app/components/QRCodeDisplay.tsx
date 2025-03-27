'use client';

import { QRCodeSVG } from 'qrcode.react';
import { useState } from 'react';

interface QRCodeDisplayProps {
  placeId: string;
  placeName: string;
}

export default function QRCodeDisplay({ placeId, placeName }: QRCodeDisplayProps) {
  const [copied, setCopied] = useState(false);
  const reviewUrl = `https://search.google.com/local/writereview?placeid=${placeId}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(reviewUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Nie udało się skopiować linku:', err);
    }
  };

  const handleDownloadQR = () => {
    const svg = document.querySelector('#qr-code svg') as SVGElement;
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        const pngFile = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.download = `qr-kod-${placeName.toLowerCase().replace(/\s+/g, '-')}.png`;
        downloadLink.href = pngFile;
        downloadLink.click();
      };
      img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
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
              Płatność zakończona sukcesem!
            </h3>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Twój kod QR jest gotowy
      </h2>
      <p className="text-gray-600 mb-8">
        Dla firmy: {placeName}
      </p>

      <div className="bg-white p-8 rounded-xl shadow-lg mb-8" id="qr-code">
        <QRCodeSVG
          value={reviewUrl}
          size={256}
          level="H"
          includeMargin={true}
          className="mx-auto"
        />
      </div>

      <div className="space-y-4">
        <button
          onClick={handleDownloadQR}
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