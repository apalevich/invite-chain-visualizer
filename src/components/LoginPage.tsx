import React from 'react';
import { GitBranch as BrandTelegram } from 'lucide-react';
import TelegramLoginButton from 'telegram-login-button';
import type { TelegramUser } from '../lib/auth';

type LoginPageProps = {
  onLogin: (user: TelegramUser) => void;
};

export function LoginPage({ onLogin }: LoginPageProps) {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-block p-3 bg-blue-50 rounded-full mb-4">
            <BrandTelegram className="h-8 w-8 text-blue-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome to Invite Chain Visualizer
          </h1>
          <p className="text-gray-600">
            Please log in with your Telegram account to access the visualization
          </p>
        </div>

        <div className="flex justify-center">
          <TelegramLoginButton
            botName="invite_chain_auth_bot" // Replace with your bot name
            dataOnauth={onLogin}
            buttonSize="large"
            cornerRadius={8}
            requestAccess="write"
          />
        </div>

        <div className="mt-8 text-sm text-gray-500 text-center">
          <p>Only users who are part of the invite chain will be granted access</p>
        </div>
      </div>
    </div>
  );
}