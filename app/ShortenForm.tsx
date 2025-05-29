'use client';

import { useState } from 'react';
import axios from 'axios';

export default function UrlShortenerForm() {
  const [longUrl, setLongUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setShortUrl('');
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:8002/api/shorten', {
        url: longUrl,
      });
      setShortUrl(response.data.short_url);
      setLongUrl(''); // Clear the input after successful shortening
    } catch (err: any) {
      console.error(err);
      setError('Oops! Failed to shorten URL. Please ensure it\'s a valid link and the backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyClick = () => {
    if (shortUrl) {
      navigator.clipboard.writeText(shortUrl);
      alert('Short URL copied to clipboard!');
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 sm:p-8 border border-blue-200 shadow-lg max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="longUrl" className="block text-lg font-medium text-gray-700 mb-2">
            Enter the long URL you want to shorten:
          </label>
          <input
            type="url"
            id="longUrl"
            placeholder="e.g., https://very-long-website-address.com/page/details/..."
            value={longUrl}
            onChange={(e) => setLongUrl(e.target.value)}
            required
            className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 text-lg transition duration-200"
            disabled={isLoading}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Shortening...
            </>
          ) : (
            '🚀 Shorten URL'
          )}
        </button>
      </form>

      {shortUrl && (
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-5 flex flex-col sm:flex-row items-center justify-between shadow-inner">
          <p className="text-blue-800 font-medium text-lg mb-2 sm:mb-0">
            Your Short URL:
            <a
              href={shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-blue-600 hover:underline break-all mt-1 font-mono text-xl"
            >
              {shortUrl}
            </a>
          </p>
          <button
            onClick={handleCopyClick}
            className="bg-blue-500 text-white px-5 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 flex items-center justify-center text-base"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
              <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
            </svg>
            Copy
          </button>
        </div>
      )}

      {error && (
        <div className="mt-6 bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg text-center text-lg shadow-sm">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}