'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const placeId = searchParams.get('placeId');
  const sessionId = searchParams.get('session_id');
  const type = searchParams.get('type');

  useEffect(() => {
    if (placeId && sessionId) {
      // Przekieruj z powrotem do strony głównej z informacją o sukcesie
      router.push(`/?success=true&placeId=${placeId}&session_id=${sessionId}${type ? `&type=${type}` : ''}`);
    } else {
      router.push('/');
    }
  }, [placeId, sessionId, type, router]);

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

export default function SuccessPage() {
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
      <SuccessContent />
    </Suspense>
  );
} 