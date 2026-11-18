import React, { useState, useEffect } from 'react';
import { Users, Shield, Trash2, Search, Coffee, Calendar } from 'lucide-react';
import api from '../../services/api';
import Badge from '../../components/common/Badge';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const AdminUsers = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/users');
      if (res.data?.data) {
        setUsers(res.data.data);
      }
    } catch (err) {
      toast.error('Failed to load registered users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.put(`/users/${userId}/role`, { role: newRole });
      toast.success(`User role updated to ${newRole}`);
      fetchUsers();
    } catch (err) {
      toast.error(err.message || 'Failed to update user role');
    }
  };

  const handleDelete = async (userId, userEmail) => {
    if (userEmail === 'admin@luckycafe.com' || userEmail === 'sisodiyalucky828@gmail.com') {
      toast.error('Cannot delete the primary administrator account.');
      return;
    }
    if (userId === currentUser?._id) {
      toast.error('You cannot delete your own account from here.');
      return;
    }
    if (!window.confirm(`Delete user account ${userEmail}?`)) return;

    try {
      await api.delete(`/users/${userId}`);
      toast.success('User account removed');
      fetchUsers();
    } catch (err) {
      toast.error(err.message || 'Failed to delete user');
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-coffee-800">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-cream-50">
            Registered Users
          </h1>
          <p className="text-xs text-cream-300 mt-1">
            Manage customer directories, role permissions, and user purchase statistics.
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-cream-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-10 pr-4 py-2 bg-coffee-900 border border-coffee-800 rounded-xl text-xs text-cream-100 placeholder-cream-400/50 focus:outline-none focus:border-gold-500"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="glass-panel rounded-2xl border border-coffee-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-coffee-900/90 text-cream-400 uppercase tracking-wider text-[10px] border-b border-coffee-800">
              <tr>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Contact Phone</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Orders Placed</th>
                <th className="py-3 px-4">Registered On</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-coffee-800/60">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-cream-400">
                    Loading users directory...
                  </td>
                </tr>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((u) => (
                  <tr key={u._id} className="hover:bg-coffee-900/40 transition-colors">
                    <td className="py-3.5 px-4 flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-coffee-900 border border-gold-500/30 flex items-center justify-center font-bold text-gold-400 text-xs">
                        {u.name[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-cream-100">{u.name}</p>
                        <p className="text-[11px] text-cream-400">{u.email}</p>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-cream-300">
                      {u.phone || <span className="text-cream-500 italic">Not set</span>}
                    </td>

                    <td className="py-3.5 px-4">
                      {u.email === 'admin@luckycafe.com' || u.email === 'sisodiyalucky828@gmail.com' ? (
                        <Badge status="admin" />
                      ) : (
                        <select
                          value={u.role}
                          onChange={(e) => handleRoleChange(u._id, e.target.value)}
                          className="py-1 px-2 bg-coffee-900 border border-coffee-700 rounded-lg text-xs text-cream-100 focus:outline-none focus:border-gold-500 font-medium"
                        >
                          <option value="customer">customer</option>
                          <option value="admin">admin</option>
                        </select>
                      )}
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-gold-400">
                      {u.orderCount || 0} orders
                    </td>

                    <td className="py-3.5 px-4 text-cream-400">
                      {new Date(u.createdAt).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      {u.email !== 'admin@luckycafe.com' && u.email !== 'sisodiyalucky828@gmail.com' && u._id !== currentUser?._id && (
                        <button
                          onClick={() => handleDelete(u._id, u.email)}
                          className="p-1.5 rounded-lg bg-coffee-900 text-cream-400 hover:text-rose-400 hover:bg-coffee-800 transition-colors"
                          title="Delete User"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-cream-400">
                    No users match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
