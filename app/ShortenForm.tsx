'use client';

import { useState } from 'react';
import axios from 'axios';

export default function UrlShortenerForm() {
  const [longUrl, setLongUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setShortUrl('');

    try {
      const response = await axios.post('http://localhost:8002/api/shorten', {
        url: longUrl,
      });
      setShortUrl(response.data.short_url);
    } catch (err: any) {
      console.error(err);
      setError('Failed to shorten URL. Please check your input and server status.');
    }
  };

  return (
    <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-xl border">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">🔗 Shorten a URL</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="url"
          placeholder="Enter a long URL..."
          value={longUrl}
          onChange={(e) => setLongUrl(e.target.value)}
          required
          className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
        >
          Generate Short URL
        </button>
      </form>

      {shortUrl && (
        <div className="mt-5 text-center">
          <p className="text-gray-700 font-medium">Your short URL:</p>
          <a
            href={shortUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline font-semibold"
          >
            {shortUrl}
          </a>
        </div>
      )}

      {error && (
        <p className="text-red-500 mt-3 font-medium text-center">{error}</p>
      )}
    </div>
  );
}
