'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

// Define interfaces for our data
interface Item {
  id: number;
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
    // Fetch data from FastAPI backend
    const fetchItems = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:8000/api/items');
        setItems(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching items:', err);
        setError('Failed to fetch items. Is the API server running?');
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8">NextJS + FastAPI Tutorial</h1>
        
        {loading && <p className="text-lg">Loading items...</p>}
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p>{error}</p>
            <p className="text-sm mt-2">
              Make sure your FastAPI server is running on http://localhost:8000
            </p>
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="border rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow"
              >
                <h2 className="text-xl font-semibold">{item.name}</h2>
                <p className="text-gray-600 mt-2">{item.description || 'No description'}</p>
                <p className="text-lg font-bold mt-2">${item.price.toFixed(2)}</p>
                <p className="mt-2">
                  Status:{' '}
                  <span
                    className={`px-2 py-1 text-sm rounded ${
                      item.is_available
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {item.is_available ? 'Available' : 'Sold Out'}
                  </span>
                </p>
              </div>
            ))}
          </div>
        )}

        {!loading && !error && items.length === 0 && (
          <p className="text-lg">No items found.</p>
        )}
      </div>
    </main>
  );
}