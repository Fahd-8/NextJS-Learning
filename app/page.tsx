'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import UrlShortenerForm from './ShortenForm';

interface Item {
  id: string;
  name: string;
  description: string | null;
  price: number;
  is_available: boolean;
}

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://127.0.0.1:8002/api/items');
        setItems(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching items:', err);
        setError('Failed to fetch items from backend.');
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  return (
    <main className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        <header className="text-center">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-2">🛍️ Tech Shop</h1>
          <p className="text-lg text-gray-500">Your go-to place for gadgets + tools</p>
        </header>

        {/* Shortener */}
        <section className="flex justify-center">
          <UrlShortenerForm />
        </section>

        {/* Products */}
        <section>
          <h2 className="text-3xl font-bold mb-6 text-gray-800">📦 Available Products</h2>

          {loading && <p className="text-lg">Loading items...</p>}

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && items.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border rounded-xl shadow-md hover:shadow-xl transition p-5"
                >
                  <h3 className="text-xl font-semibold text-gray-800">{item.name}</h3>
                  <p className="text-gray-500 mt-1">{item.description || 'No description'}</p>
                  <p className="text-lg font-bold text-indigo-600 mt-3">${item.price.toFixed(2)}</p>
                  <span
                    className={`inline-block mt-2 px-3 py-1 text-sm rounded-full font-medium ${
                      item.is_available
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {item.is_available ? 'Available' : 'Sold Out'}
                  </span>
                </div>
              ))}
            </div>
          )}

          {!loading && !error && items.length === 0 && (
            <p className="text-lg text-gray-500">No items found.</p>
          )}
        </section>
      </div>
    </main>
  );
}
