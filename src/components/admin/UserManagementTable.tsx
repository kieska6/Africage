import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui/Button';
import { Loader2, User, AlertTriangle } from 'lucide-react';

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  is_banned: boolean;
}

export function UserManagementTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('users')
        .select('id, email, first_name, last_name, is_banned')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      setUsers(data || []);
    } catch (err: any) {
      setError('Erreur lors du chargement des utilisateurs');
      console.error('Users fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBan = async (userId: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    const action = newStatus ? 'bannir' : 'réactiver';
    
    if (!window.confirm(`Êtes-vous sûr de vouloir ${action} cet utilisateur ?`)) {
      return;
    }

    try {
      const { error: updateError } = await supabase
        .from('users')
        .update({ is_banned: newStatus })
        .eq('id', userId);

      if (updateError) throw updateError;

      // Mettre à jour l'état local
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === userId ? { ...user, is_banned: newStatus } : user
        )
      );
    } catch (err: any) {
      setError(`Erreur lors de la mise à jour de l'utilisateur`);
      console.error('Ban toggle error:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 bg-red-50 rounded-lg">
        <p className="text-red-600">{error}</p>
        <Button onClick={fetchUsers} className="mt-4">
          Réessayer
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-neutral-200">
          <thead className="bg-neutral-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Nom
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-neutral-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-neutral-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900 font-mono">
                  {user.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                  {user.first_name} {user.last_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user.is_banned
                      ? 'bg-red-100 text-red-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {user.is_banned ? (
                      <>
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        Banni
                      </>
                    ) : (
                      <>
                        <User className="w-3 h-3 mr-1" />
                        Actif
                      </>
                    )}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleBan(user.id, user.is_banned)}
                    className={`${
                      user.is_banned
                        ? 'border-green-500 text-green-600 hover:bg-green-50'
                        : 'border-red-500 text-red-600 hover:bg-red-50'
                    }`}
                  >
                    {user.is_banned ? 'Réactiver' : 'Bannir'}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {users.length === 0 && (
        <div className="text-center py-12">
          <p className="text-neutral-500">Aucun utilisateur trouvé.</p>
        </div>
      )}
    </div>
  );
}