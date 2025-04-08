import React, { useEffect, useState } from 'react';
import { TableView } from './components/TableView';
import { TreeView } from './components/TreeView';
import { UserDetails } from './components/UserDetails';
import { LoginPage } from './components/LoginPage';
import { supabase, type TelegramUser } from './lib/supabase';
import { verifyTelegramUser, type TelegramUser as TelegramAuthUser } from './lib/auth';
import { Table2, GitGraph } from 'lucide-react';

type View = 'table' | 'tree' | 'details';

function App() {
  const [users, setUsers] = useState<TelegramUser[]>([]);
  const [currentView, setCurrentView] = useState<View>('table');
  const [selectedUser, setSelectedUser] = useState<TelegramUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authenticatedUser, setAuthenticatedUser] = useState<TelegramUser | null>(null);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const { data, error } = await supabase
          .from('telegram_users')
          .select('*')
          .order('joined_at', { ascending: true });

        if (error) throw error;
        setUsers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch users');
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  const handleLogin = async (telegramUser: TelegramAuthUser) => {
    const verifiedUser = await verifyTelegramUser(telegramUser);
    if (verifiedUser) {
      setAuthenticatedUser(verifiedUser);
    } else {
      setError('Access denied. Your Telegram account is not in the invite chain.');
    }
  };

  const handleUserSelect = (user: TelegramUser) => {
    setSelectedUser(user);
    setCurrentView('details');
  };

  if (!authenticatedUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Telegram Invite Chain Visualizer
            </h1>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                Logged in as {authenticatedUser.username}
              </span>
            </div>
          </div>
          
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setCurrentView('table')}
              className={`flex items-center px-4 py-2 rounded-lg ${
                currentView === 'table'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Table2 className="h-5 w-5 mr-2" />
              Table View
            </button>
            <button
              onClick={() => setCurrentView('tree')}
              className={`flex items-center px-4 py-2 rounded-lg ${
                currentView === 'tree'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <GitGraph className="h-5 w-5 mr-2" />
              Tree View
            </button>
          </div>

          {currentView === 'table' && (
            <TableView users={users} onUserSelect={handleUserSelect} />
          )}
          
          {currentView === 'tree' && (
            <TreeView users={users} onUserSelect={handleUserSelect} />
          )}
          
          {currentView === 'details' && selectedUser && (
            <UserDetails
              user={selectedUser}
              invitedBy={users.find(u => u.id === selectedUser.invited_by)}
              invitedUsers={users.filter(u => u.invited_by === selectedUser.id)}
              onClose={() => {
                setSelectedUser(null);
                setCurrentView('table');
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;