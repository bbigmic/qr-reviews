'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CancelPage() {
  const router = useRouter();

  useEffect(() => {
    // Przekieruj z powrotem do strony głównej z informacją o anulowaniu
    router.push('/?canceled=true');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Anulowanie płatności...
        </h1>
        <p className="text-gray-600">
          Proszę czekać, trwa przekierowanie...
        </p>
      </div>
    </div>
  );
} 