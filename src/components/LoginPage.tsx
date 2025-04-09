import React, { useState } from 'react';
import { Key } from 'lucide-react';
import type { TelegramUser } from '../lib/supabase';

type LoginPageProps = {
  onLogin: (password: string) => void;
  error?: string | null;
};

export function LoginPage({ onLogin, error }: LoginPageProps) {
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    onLogin(password);
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-block p-3 bg-blue-50 rounded-full mb-4">
            <Key className="h-8 w-8 text-blue-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome to Invite Chain Visualizer
          </h1>
          <p className="text-gray-600">
            Please enter the password to access the visualization
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <div className="mb-4 p-2 bg-red-50 text-red-600 text-sm rounded">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-500 text-white rounded-lg px-4 py-2 font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <div className="mt-8 text-sm text-gray-500 text-center">
          <p>Only authorized users will be granted access</p>
        </div>
      </div>
    </div>
  );
}