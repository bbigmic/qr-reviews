'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Logo from '../components/Logo';

interface Order {
  id: string;
  createdAt: string;
  status: string;
  amount: number;
  placeId?: string;
  orderType: string;
  affiliateCode?: {
    code: string;
    discount: number;
  };
}

interface AffiliateCode {
  id: string;
  code: string;
  discount: number;
  commission: number;
  isActive: boolean;
  createdAt: string;
  usageCount: number;
}

interface AffiliateSignup {
  id: string;
  email: string;
  phone: string;
  status: string;
  createdAt: string;
}

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<'orders' | 'affiliate' | 'signups'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [affiliateCodes, setAffiliateCodes] = useState<AffiliateCode[]>([]);
  const [affiliateSignups, setAffiliateSignups] = useState<AffiliateSignup[]>([]);
  const [newCode, setNewCode] = useState({ code: '', discount: '', commission: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  // Pobieranie zamówień
  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/admin/orders');
      const data = await response.json();
      setOrders(data);
    } catch (_err) {
      setError('Błąd podczas pobierania zamówień');
    }
  };

  // Pobieranie kodów afiliacyjnych
  const fetchAffiliateCodes = async () => {
    try {
      const response = await fetch('/api/admin/affiliate-codes');
      const data = await response.json();
      setAffiliateCodes(data);
    } catch (_err) {
      setError('Błąd podczas pobierania kodów afiliacyjnych');
    }
  };

  // Pobieranie zgłoszeń
  const fetchSignups = async () => {
    try {
      const response = await fetch('/api/admin/affiliate-signups');
      const data = await response.json();
      setAffiliateSignups(data);
    } catch (_err) {
      setError('Błąd podczas pobierania zgłoszeń');
    }
  };

  // Dodawanie nowego kodu afiliacyjnego
  const handleAddCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/admin/affiliate-codes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: newCode.code,
          discount: Number(newCode.discount),
          commission: Number(newCode.commission)
        }),
      });
      if (!response.ok) throw new Error('Błąd podczas dodawania kodu');
      await fetchAffiliateCodes();
      setNewCode({ code: '', discount: '', commission: '' });
      setIsModalOpen(false);
    } catch (_err) {
      setError('Błąd podczas dodawania kodu afiliacyjnego');
    }
    setLoading(false);
  };

  // Aktualizacja statusu zgłoszenia
  const updateSignupStatus = async (id: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/affiliate-signups/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) throw new Error('Błąd podczas aktualizacji statusu');
      await fetchSignups();
    } catch (_err) {
      setError('Błąd podczas aktualizacji statusu zgłoszenia');
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchAffiliateCodes();
    fetchSignups();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Logo className="h-8 w-auto mr-3" />
                <h1 className="text-xl font-bold text-gray-900">Panel Administracyjny</h1>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`${
                    activeTab === 'orders'
                      ? 'border-blue-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  Zamówienia
                </button>
                <button
                  onClick={() => setActiveTab('affiliate')}
                  className={`${
                    activeTab === 'affiliate'
                      ? 'border-blue-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  Program Afiliacyjny
                </button>
                <button
                  onClick={() => setActiveTab('signups')}
                  className={`${
                    activeTab === 'signups'
                      ? 'border-blue-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  Zgłoszenia
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {activeTab === 'orders' ? (
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Lista Zamówień</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Data
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Firma
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Kwota
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Typ
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Kod rabatowy
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders.map((order) => (
                      <tr key={order.id} className="border-b">
                        <td className="px-6 py-3 text-left text-xs font-medium text-gray-900">{order.id}</td>
                        <td className="px-6 py-3 text-left text-xs font-medium text-gray-900">{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td className="px-6 py-3 text-left text-xs font-medium text-gray-900">{order.placeId || '-'}</td>
                        <td className="px-6 py-3 text-left text-xs font-medium text-gray-900">{order.amount} zł</td>
                        <td className="px-6 py-3 text-left text-xs font-medium text-gray-900">{order.status}</td>
                        <td className="px-6 py-3 text-left text-xs font-medium text-gray-900">
                          {order.orderType === 'upgrade' ? 'Ulepszenie' : 'Standardowy'}
                        </td>
                        <td className="px-6 py-3 text-left text-xs font-medium text-gray-900">{order.affiliateCode?.code || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : activeTab === 'affiliate' ? (
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-900">Program Afiliacyjny</h2>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Dodaj Nowy Kod
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Kod
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Zniżka
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Użycia
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Prowizja
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Akcje
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {affiliateCodes.map((code) => (
                      <tr key={code.id} className="border-b">
                        <td className="px-6 py-3 text-left text-xs font-medium text-gray-900">{code.code}</td>
                        <td className="px-6 py-3 text-left text-xs font-medium text-gray-900">{code.discount}%</td>
                        <td className="px-6 py-3 text-left text-xs font-medium text-gray-900">{code.usageCount}</td>
                        <td className="px-6 py-3 text-left text-xs font-medium text-gray-900">{code.commission}%</td>
                        <td className="px-6 py-3 text-left text-xs font-medium text-gray-900">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            code.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {code.isActive ? 'Aktywny' : 'Nieaktywny'}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-left text-xs font-medium">
                          <button
                            onClick={() => {
                              // Toggle status
                              fetch(`/api/admin/affiliate-codes/${code.id}`, {
                                method: 'PATCH',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ isActive: !code.isActive }),
                              }).then(() => fetchAffiliateCodes());
                            }}
                            className={`px-3 py-1 rounded-md ${
                              code.isActive
                                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                            }`}
                          >
                            {code.isActive ? 'Dezaktywuj' : 'Aktywuj'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Zgłoszenia do Programu Afiliacyjnego</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Telefon
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Data zgłoszenia
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Akcje
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {affiliateSignups.map((signup) => (
                      <tr key={signup.id} className="border-b">
                        <td className="px-6 py-3 text-left text-xs font-medium text-gray-900">{signup.email}</td>
                        <td className="px-6 py-3 text-left text-xs font-medium text-gray-900">{signup.phone}</td>
                        <td className="px-6 py-3 text-left text-xs font-medium text-gray-900">
                          {new Date(signup.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-3 text-left text-xs font-medium">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            signup.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                            signup.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {signup.status === 'APPROVED' ? 'Zatwierdzono' :
                             signup.status === 'REJECTED' ? 'Odrzucono' :
                             'Oczekujące'}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-left text-xs font-medium space-x-2">
                          {signup.status === 'PENDING' && (
                            <>
                              <button
                                onClick={() => updateSignupStatus(signup.id, 'APPROVED')}
                                className="px-3 py-1 rounded-md bg-green-100 text-green-700 hover:bg-green-200"
                              >
                                Zatwierdź
                              </button>
                              <button
                                onClick={() => updateSignupStatus(signup.id, 'REJECTED')}
                                className="px-3 py-1 rounded-md bg-red-100 text-red-700 hover:bg-red-200"
                              >
                                Odrzuć
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Modal do dodawania nowego kodu */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Dodaj nowy kod afiliacyjny</h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Zamknij</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <form onSubmit={handleAddCode} className="space-y-4">
                <div>
                  <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                    Kod
                  </label>
                  <input
                    type="text"
                    id="code"
                    value={newCode.code}
                    onChange={(e) => setNewCode({ ...newCode, code: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="discount" className="block text-sm font-medium text-gray-700">
                    Zniżka (%)
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <input
                      type="number"
                      id="discount"
                      value={newCode.discount}
                      onChange={(e) => {
                        const value = e.target.value === '' ? '' : Math.min(Math.max(0, Number(e.target.value)), 100).toString();
                        setNewCode({ ...newCode, discount: value });
                      }}
                      onWheel={(e) => e.currentTarget.blur()}
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 pr-7 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      min="0"
                      max="100"
                      step="1"
                      placeholder="Wpisz wartość"
                      required
                    />
                    <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">%</span>
                    </div>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">Wartość od 0 do 100%</p>
                </div>
                <div>
                  <label htmlFor="commission" className="block text-sm font-medium text-gray-700">
                    Prowizja (%)
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <input
                      type="number"
                      id="commission"
                      value={newCode.commission}
                      onChange={(e) => {
                        const value = e.target.value === '' ? '' : Math.min(Math.max(0, Number(e.target.value)), 100).toString();
                        setNewCode({ ...newCode, commission: value });
                      }}
                      onWheel={(e) => e.currentTarget.blur()}
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 pr-7 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      min="0"
                      max="100"
                      step="1"
                      placeholder="Wpisz wartość"
                      required
                    />
                    <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">%</span>
                    </div>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">Wartość od 0 do 100%</p>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Anuluj
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {loading ? 'Dodawanie...' : 'Dodaj kod'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
} 