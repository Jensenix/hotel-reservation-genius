import {
  Mail,
  Phone,
  User,
  Shield,
  Edit,
  Trash2,
  Users as UsersIcon,
  Plus,
} from 'lucide-react';
import Button from '@/components/ui/Button';

export default function GuestTable({
  users,
  loading,
  allUsers,
  onEdit,
  onDelete,
  onAddUser,
}) {
  const getRoleColor = (role) =>
    role === 'admin'
      ? 'bg-purple-100 text-purple-700 border-purple-200'
      : 'bg-blue-100 text-blue-700 border-blue-200';
  const getRoleIcon = (role) =>
    role === 'admin' ? (
      <Shield className="w-4 h-4" />
    ) : (
      <User className="w-4 h-4" />
    );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-slate-900 to-slate-800 text-white">
              <th className="px-8 py-5 text-left text-sm font-semibold uppercase tracking-wider">
                User
              </th>
              <th className="px-8 py-5 text-left text-sm font-semibold uppercase tracking-wider">
                Email
              </th>
              <th className="px-8 py-5 text-left text-sm font-semibold uppercase tracking-wider">
                Phone
              </th>
              <th className="px-8 py-5 text-left text-sm font-semibold uppercase tracking-wider">
                Role
              </th>
              <th className="px-8 py-5 text-center text-sm font-semibold uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-amber-50/50 transition-colors duration-200"
              >
                <td className="px-8 py-5">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div className="ml-4">
                      <p className="font-semibold text-slate-900">
                        {user.fullName}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-5 text-slate-600">
                  <Mail className="inline w-4 h-4 mr-2 text-slate-400" />
                  {user.email}
                </td>
                <td className="px-8 py-5 text-slate-600">
                  {user.phoneNumber ? (
                    <>
                      <Phone className="inline w-4 h-4 mr-2 text-slate-400" />
                      {user.phoneNumber}
                    </>
                  ) : (
                    '-'
                  )}
                </td>
                <td className="px-8 py-5">
                  <div
                    className={`inline-flex items-center px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider border ${getRoleColor(user.role)}`}
                  >
                    {getRoleIcon(user.role)}{' '}
                    <span className="ml-2">{user.role}</span>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <div className="flex items-center justify-center gap-3">
                    <Button
                      onClick={() => onEdit(user, { ...user, password: '' })}
                      className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white border-0 px-4 py-2 text-sm rounded-lg shadow-md transition-all"
                    >
                      <Edit className="w-4 h-4 mr-1" /> Edit
                    </Button>
                    <Button
                      onClick={() => onDelete(user)}
                      disabled={
                        user.role === 'admin' &&
                        allUsers.filter((u) => u.role === 'admin').length === 1
                      }
                      className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-0 px-4 py-2 text-sm rounded-lg shadow-md transition-all disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4 mr-1" /> Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {users.length === 0 && (
        <div className="text-center py-16">
          <UsersIcon className="w-20 h-20 text-slate-300 mx-auto mb-6" />
          <p className="text-slate-500 text-lg mb-4">No users found</p>
          <Button
            onClick={onAddUser}
            className="bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg border-0 px-8 py-3 rounded-xl font-semibold"
          >
            <Plus className="w-4 h-4 mr-2" /> Add First User
          </Button>
        </div>
      )}
    </div>
  );
}
