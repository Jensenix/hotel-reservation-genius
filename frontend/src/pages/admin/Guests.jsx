import React, { useState, useEffect } from 'react';
import apiService from '../../services/apiService';
import AdminLayout from '../../components/layout/AdminLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { Plus, Edit, Trash2, Search, Users as UsersIcon, Shield, Mail, Phone, User } from 'lucide-react';

const Guests = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  // User Modal
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userFormData, setUserFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phoneNumber: '',
    role: 'guest'
  });

  // Delete Modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingUser, setDeletingUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await apiService.users.getAll();
      setUsers(response.data.data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  // User Handlers
  const handleOpenUserModal = (user = null) => {
    if (user) {
      setEditingUser(user);
      setUserFormData({
        fullName: user.fullName,
        email: user.email,
        password: '',
        phoneNumber: user.phoneNumber || '',
        role: user.role
      });
    } else {
      setEditingUser(null);
      setUserFormData({
        fullName: '',
        email: '',
        password: '',
        phoneNumber: '',
        role: 'guest'
      });
    }
    setShowUserModal(true);
  };

  const handleCloseUserModal = () => {
    setShowUserModal(false);
    setEditingUser(null);
    setUserFormData({
      fullName: '',
      email: '',
      password: '',
      phoneNumber: '',
      role: 'guest'
    });
  };

  const handleSubmitUser = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        const updateData = { ...userFormData };
        if (!updateData.password) {
          delete updateData.password;
        }
        await apiService.users.update(editingUser.id, updateData);
      } else {
        await apiService.users.create(userFormData);
      }
      handleCloseUserModal();
      fetchUsers();
    } catch (error) {
      console.error('Error saving user:', error);
      alert('Error saving user: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDelete = async () => {
    try {
      await apiService.users.delete(deletingUser.id);
      setShowDeleteModal(false);
      setDeletingUser(null);
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Error deleting user: ' + (error.response?.data?.message || error.message));
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'guest':
      default:
        return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin':
        return <Shield className="w-4 h-4" />;
      case 'guest':
      default:
        return <User className="w-4 h-4" />;
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !roleFilter || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-2xl border-b border-slate-700">
          <div className="container mx-auto px-6 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-light tracking-tight mb-2">
                  User <span className="font-semibold text-amber-400">Management</span>
                </h1>
                <p className="text-slate-300 text-sm tracking-wide uppercase">
                  Manage Hotel Users & Staff
                </p>
              </div>
              <Button
                onClick={() => handleOpenUserModal()}
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg border border-amber-400"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add User
              </Button>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white border-2 border-slate-700 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Total Users</p>
                  <p className="text-3xl font-bold">{users.length}</p>
                </div>
                <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center">
                  <UsersIcon className="w-6 h-6 text-amber-400" />
                </div>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-purple-900 to-purple-800 text-white border-2 border-purple-700 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-300 text-xs uppercase tracking-wider mb-1">Admins</p>
                  <p className="text-3xl font-bold">{users.filter(u => u.role === 'admin').length}</p>
                </div>
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-purple-400" />
                </div>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-blue-900 to-blue-800 text-white border-2 border-blue-700 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-300 text-xs uppercase tracking-wider mb-1">Guests</p>
                  <p className="text-3xl font-bold">{users.filter(u => u.role === 'guest').length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <User className="w-6 h-6 text-blue-400" />
                </div>
              </div>
            </Card>
          </div>

          {/* Search & Filter Section */}
          <Card className="bg-white border-2 border-slate-200 shadow-xl mb-8">
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Search Users</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search by name or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Filter by Role</label>
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                  >
                    <option value="">All Roles</option>
                    <option value="admin">Admin</option>
                    <option value="guest">Guest</option>
                  </select>
                </div>
              </div>
            </div>
          </Card>

          {/* Users Table */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
            </div>
          ) : (
            <Card className="bg-white border-2 border-slate-200 shadow-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-slate-900 to-slate-800 text-white">
                      <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">User</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Email</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Phone</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Role</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center shadow-md">
                              <User className="w-5 h-5 text-white" />
                            </div>
                            <div className="ml-4">
                              <p className="font-semibold text-slate-900">{user.fullName}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center text-slate-600">
                            <Mail className="w-4 h-4 mr-2 text-slate-400" />
                            <span>{user.email}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {user.phoneNumber ? (
                            <div className="flex items-center text-slate-600">
                              <Phone className="w-4 h-4 mr-2 text-slate-400" />
                              <span>{user.phoneNumber}</span>
                            </div>
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border ${getRoleColor(user.role)}`}>
                            {getRoleIcon(user.role)}
                            <span className="ml-2">{user.role}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <Button
                              onClick={() => handleOpenUserModal(user)}
                              className="bg-slate-100 hover:bg-slate-200 text-slate-700 border-2 border-slate-300 px-3 py-1.5 text-sm"
                            >
                              <Edit className="w-4 h-4 mr-1" />
                              Edit
                            </Button>
                            <Button
                              onClick={() => {
                                setDeletingUser(user);
                                setShowDeleteModal(true);
                              }}
                              className="bg-red-100 hover:bg-red-200 text-red-700 border-2 border-red-300 px-3 py-1.5 text-sm"
                              disabled={user.role === 'admin' && users.filter(u => u.role === 'admin').length === 1}
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredUsers.length === 0 && !loading && (
                <div className="text-center py-12">
                  <UsersIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500 text-lg">No users found</p>
                  <Button
                    onClick={() => handleOpenUserModal()}
                    className="mt-4 bg-amber-500 hover:bg-amber-600 text-white border-2 border-amber-400"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add First User
                  </Button>
                </div>
              )}
            </Card>
          )}
        </div>

        {/* User Modal */}
        <Modal
          isOpen={showUserModal}
          onClose={handleCloseUserModal}
          title={editingUser ? 'Edit User' : 'Add New User'}
        >
          <form onSubmit={handleSubmitUser} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
              <input
                type="text"
                required
                value={userFormData.fullName}
                onChange={(e) => setUserFormData({ ...userFormData, fullName: e.target.value })}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                placeholder="e.g., John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
              <input
                type="email"
                required
                value={userFormData.email}
                onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                placeholder="e.g., john@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Password {editingUser && '(leave empty to keep current)'}
              </label>
              <input
                type="password"
                required={!editingUser}
                value={userFormData.password}
                onChange={(e) => setUserFormData({ ...userFormData, password: e.target.value })}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                placeholder={editingUser ? 'Leave empty to keep current password' : 'Enter password'}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
              <input
                type="tel"
                value={userFormData.phoneNumber}
                onChange={(e) => setUserFormData({ ...userFormData, phoneNumber: e.target.value })}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                placeholder="e.g., +1234567890"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Role</label>
              <select
                required
                value={userFormData.role}
                onChange={(e) => setUserFormData({ ...userFormData, role: e.target.value })}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              >
                <option value="guest">Guest</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                onClick={handleCloseUserModal}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 border-2 border-slate-300"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg border border-amber-400"
              >
                {editingUser ? 'Update User' : 'Add User'}
              </Button>
            </div>
          </form>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setDeletingUser(null);
          }}
          title="Delete User"
        >
          <div className="space-y-6">
            <p className="text-slate-600">
              Are you sure you want to delete user <strong>{deletingUser?.fullName}</strong> ({deletingUser?.email})? This action cannot be undone.
            </p>
            <div className="flex gap-4">
              <Button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeletingUser(null);
                }}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 border-2 border-slate-300"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDelete}
                className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg border border-red-400"
              >
                Delete User
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </AdminLayout>
  );
};

export default Guests;
