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
      } catch (err: any) {
        console.error('Error fetching items:', err);
        if (err.response && err.response.status === 429) {
          // Handle rate limit exceeded error
          setError(err.response.data.detail || 'Rate limit exceeded. Please try again later.');
        } else {
          // Handle other errors
          setError('Failed to fetch items. Is the API server running on http://localhost:8002?');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8 sm:p-12 lg:p-24">
      <header className="text-center mb-12">
        <h1 className="text-5xl font-extrabold text-gray-900 leading-tight">
          Welcome to <span className="text-blue-600">Tech Marketplace</span>
        </h1>
        <p className="mt-4 text-xl text-gray-600">Your one-stop shop for amazing tech products and URL shortening!</p>
      </header>

      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden p-8 sm:p-10">
        {/* URL Shortener Section */}
        <section className="mb-12 border-b-2 border-blue-100 pb-10">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            🔗 Instantly Shorten Your URLs
          </h2>
          <UrlShortenerForm />
        </section>

        {/* Products Section */}
        <section>
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            🛒 Our Latest Products
          </h2>

          {loading && (
            <div className="flex justify-center items-center h-48">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
              <p className="ml-4 text-xl text-gray-600">Loading awesome tech...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg mb-6 text-center text-lg">
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && items.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border border-gray-200 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                >
                  <h3 className="text-2xl font-semibold text-gray-800 mb-2">{item.name}</h3>
                  <p className="text-gray-600 mb-3 line-clamp-3">{item.description || 'No description provided for this product.'}</p>
                  <div className="flex justify-between items-center mt-4">
                    <p className="text-2xl font-bold text-blue-700">${item.price.toFixed(2)}</p>
                    <span
                      className={`px-3 py-1 text-sm font-medium rounded-full ${
                        item.is_available
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {item.is_available ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && !error && items.length === 0 && (
            <p className="text-center text-xl text-gray-600 py-10">No items found. Check back soon for new arrivals!</p>
          )}
        </section>
      </div>
    </div>
  );
}