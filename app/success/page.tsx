'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function SuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const placeId = searchParams.get('placeId');
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (placeId && sessionId) {
      // Przekieruj z powrotem do strony głównej z informacją o sukcesie i identyfikatorem sesji
      router.push(`/?success=true&placeId=${placeId}&session_id=${sessionId}`);
    } else {
      router.push('/');
    }
  }, [placeId, sessionId, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Przetwarzanie płatności...
        </h1>
        <p className="text-gray-600">
          Proszę czekać, trwa przekierowanie...
        </p>
      </div>
    </div>
  );
} 