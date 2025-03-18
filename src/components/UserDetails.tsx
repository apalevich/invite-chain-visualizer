import React from 'react';
import { format } from 'date-fns';
import type { TelegramUser } from '../lib/supabase';
import { User, Calendar, UserPlus, X } from 'lucide-react';

type UserDetailsProps = {
  user: TelegramUser;
  invitedBy?: TelegramUser;
  invitedUsers: TelegramUser[];
  onClose: () => void;
};

export function UserDetails({ user, invitedBy, invitedUsers, onClose }: UserDetailsProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center">
          <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
            <User className="h-8 w-8 text-gray-500" />
          </div>
          <div className="ml-4">
            <h2 className="text-2xl font-bold">
              {user.first_name} {user.last_name}
            </h2>
            <p className="text-gray-600">@{user.username || 'no username'}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center text-gray-600">
          <Calendar className="h-5 w-5 mr-2" />
          <span>Joined on {format(new Date(user.joined_at), 'PPP')}</span>
        </div>

        {invitedBy && (
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-2">Invited by</h3>
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                <User className="h-5 w-5 text-gray-500" />
              </div>
              <div className="ml-3">
                <p className="font-medium">
                  {invitedBy.first_name} {invitedBy.last_name}
                </p>
                <p className="text-sm text-gray-500">
                  @{invitedBy.username || 'no username'}
                </p>
              </div>
            </div>
          </div>
        )}

        {invitedUsers.length > 0 && (
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-2">
              Invited Members ({invitedUsers.length})
            </h3>
            <div className="space-y-3">
              {invitedUsers.map(invitedUser => (
                <div key={invitedUser.id} className="flex items-center">
                  <UserPlus className="h-5 w-5 text-gray-400 mr-2" />
                  <div>
                    <p className="font-medium">
                      {invitedUser.first_name} {invitedUser.last_name}
                    </p>
                    <p className="text-sm text-gray-500">
                      @{invitedUser.username || 'no username'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}