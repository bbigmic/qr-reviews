'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface StripePaymentProps {
  onSuccess: () => void;
  placeId: string;
}

export default function StripePayment({ onSuccess, placeId }: StripePaymentProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePayment = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/create-checkout-session', {
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

      onSuccess();
    } catch (error) {
      console.error('Błąd płatności:', error);
      setError(error instanceof Error ? error.message : 'Wystąpił nieznany błąd');
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            Szczegóły zamówienia
          </h3>
          <span className="text-2xl font-bold text-gray-900">
            199 zł
          </span>
        </div>
        <ul className="space-y-3">
          <li className="flex items-start">
            <svg className="h-5 w-5 text-green-500 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <span className="ml-3 text-gray-600">
              Unikalny kod QR dla Twojej firmy
            </span>
          </li>
          <li className="flex items-start">
            <svg className="h-5 w-5 text-green-500 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <span className="ml-3 text-gray-600">
              Bezpośredni link do wystawienia opinii
            </span>
          </li>
          <li className="flex items-start">
            <svg className="h-5 w-5 text-green-500 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <span className="ml-3 text-gray-600">
              Możliwość pobrania w wysokiej jakości
            </span>
          </li>
        </ul>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="ml-3 text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      <button
        onClick={handlePayment}
        disabled={loading}
        className="w-full flex items-center justify-center px-6 py-4 border border-transparent text-lg font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
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
            Zapłać 199 zł i wygeneruj kod QR
          </>
        )}
      </button>

      <p className="text-center text-sm text-gray-500">
        Płatność jest realizowana przez <span className="font-medium">Stripe</span> - bezpiecznego dostawcę płatności
      </p>
    </div>
  );
} 