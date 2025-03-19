import React from 'react';
import { format } from 'date-fns';
import type { TelegramUser } from '../lib/supabase';
import { User } from 'lucide-react';

type TableViewProps = {
  users: TelegramUser[];
  onUserSelect: (user: TelegramUser) => void;
};

export function TableView({ users, onUserSelect }: TableViewProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invited By</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined At</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {users.map((user) => (
            <tr
              key={user.id}
              className="hover:bg-gray-50 cursor-pointer"
              onClick={() => onUserSelect(user)}
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <User className="h-6 w-6 text-gray-500" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {user.first_name} {user.last_name}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {user.username ?? '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {users.find(u => u.id === user.invited_by)?.username || '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {format(new Date(user.joined_at), 'PPP')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}