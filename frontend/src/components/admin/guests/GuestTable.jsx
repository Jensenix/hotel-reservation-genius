import {
  Mail,
  Phone,
  User,
  Shield,
  Edit,
  Trash2,
  Users as UsersIcon,
  Plus,
  AlertTriangle,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import PropTypes from 'prop-types';

const GUEST_RESOURCE_TYPE = 'guest';

function makeGuestEditKey(userId) {
  return `${GUEST_RESOURCE_TYPE}:${userId}`;
}

function getOtherEditors(editors = [], currentSocketId) {
  return editors.filter((editor) => editor.socketId !== currentSocketId);
}

function formatEditorNames(editors = []) {
  if (editors.length === 0) return '';

  return editors
    .map((editor) => editor.userName || `Admin ${editor.userId}`)
    .join(', ');
}

export default function GuestTable({
  users,
  loading,
  allUsers,
  activeEditsByKey,
  currentSocketId,
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
      <Shield className="w-3 h-3 sm:w-4 sm:h-4" />
    ) : (
      <User className="w-3 h-3 sm:w-4 sm:h-4" />
    );

  const getEditingInfo = (userId) => {
    const editKey = makeGuestEditKey(userId);
    const editors = activeEditsByKey?.[editKey] || [];
    const otherEditors = getOtherEditors(editors, currentSocketId);

    return {
      isBeingEdited: otherEditors.length > 0,
      editorNames: formatEditorNames(otherEditors),
    };
  };

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
        <table className="w-full min-w-[500px] sm:min-w-full">
          <thead>
            <tr className="bg-gradient-to-r from-slate-900 to-slate-800 text-white">
              <th className="px-4 py-3 sm:px-6 lg:px-8 lg:py-5 text-left text-[10px] sm:text-xs lg:text-sm font-semibold uppercase tracking-wider">
                User
              </th>
              <th className="px-4 py-3 sm:px-6 lg:px-8 lg:py-5 text-left text-[10px] sm:text-xs lg:text-sm font-semibold uppercase tracking-wider">
                Email
              </th>
              <th className="hidden sm:table-cell px-4 py-3 sm:px-6 lg:px-8 lg:py-5 text-left text-[10px] sm:text-xs lg:text-sm font-semibold uppercase tracking-wider">
                Phone
              </th>
              <th className="px-4 py-3 sm:px-6 lg:px-8 lg:py-5 text-left text-[10px] sm:text-xs lg:text-sm font-semibold uppercase tracking-wider">
                Role
              </th>
              <th className="px-4 py-3 sm:px-6 lg:px-8 lg:py-5 text-center text-[10px] sm:text-xs lg:text-sm font-semibold uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {users.map((user) => {
              const { isBeingEdited, editorNames } = getEditingInfo(user.id);

              return (
                <tr
                  key={user.id}
                  className="hover:bg-amber-50/50 transition-colors duration-200"
                >
                  <td className="px-4 py-3 sm:px-6 lg:px-8 lg:py-5">
                    <div className="flex items-center">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg shrink-0">
                        <User className="w-4 h-4 lg:w-6 lg:h-6 text-white" />
                      </div>

                      <div className="ml-3 sm:ml-4">
                        <div className="flex flex-col gap-1">
                          <p className="font-semibold text-slate-900 text-sm sm:text-base">
                            {user.fullName}
                          </p>

                          {isBeingEdited && (
                            <div
                              className="inline-flex items-center w-fit px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-[10px] sm:text-xs font-semibold"
                              title={`${editorNames} ${
                                editorNames.includes(',')
                                  ? 'are'
                                  : 'is'
                              } currently editing this user`}
                            >
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              Being edited
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3 sm:px-6 lg:px-8 lg:py-5 text-slate-600 text-xs sm:text-sm">
                    <Mail className="hidden lg:inline w-4 h-4 mr-2 text-slate-400" />
                    <span className="break-all">{user.email}</span>
                  </td>

                  <td className="hidden sm:table-cell px-4 py-3 sm:px-6 lg:px-8 lg:py-5 text-slate-600 text-xs sm:text-sm">
                    {user.phoneNumber ? (
                      <>
                        <Phone className="hidden lg:inline w-4 h-4 mr-2 text-slate-400" />
                        {user.phoneNumber}
                      </>
                    ) : (
                      '-'
                    )}
                  </td>

                  <td className="px-4 py-3 sm:px-6 lg:px-8 lg:py-5">
                    <div
                      className={`inline-flex items-center px-2 py-1 lg:px-3 lg:py-1.5 rounded-full text-[10px] sm:text-xs font-semibold uppercase tracking-wider border ${getRoleColor(
                        user.role,
                      )}`}
                    >
                      {getRoleIcon(user.role)}
                      <span className="ml-1 lg:ml-1.5">{user.role}</span>
                    </div>
                  </td>

                  <td className="px-4 py-3 sm:px-6 lg:px-8 lg:py-5">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2">
                      <Button
                        onClick={() => onEdit(user, { ...user, password: '' })}
                        className={`w-full sm:w-auto text-white border-0 px-2 py-1.5 sm:px-3 sm:py-1.5 lg:px-4 lg:py-2 text-[10px] sm:text-xs lg:text-sm rounded-lg shadow-md transition-all flex items-center justify-center ${
                          isBeingEdited
                            ? 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700'
                            : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700'
                        }`}
                      >
                        <Edit className="w-3 h-3 lg:w-4 lg:h-4 mr-1" />
                        Edit
                      </Button>

                      <Button
                        onClick={() => onDelete(user)}
                        disabled={
                          user.role === 'admin' &&
                          allUsers.filter((u) => u.role === 'admin').length ===
                            1
                        }
                        className="w-full sm:w-auto bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-0 px-2 py-1.5 sm:px-3 sm:py-1.5 lg:px-4 lg:py-2 text-[10px] sm:text-xs lg:text-sm rounded-lg shadow-md transition-all flex items-center justify-center disabled:opacity-50"
                      >
                        <Trash2 className="w-3 h-3 lg:w-4 lg:h-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {users.length === 0 && (
        <div className="text-center py-16">
          <UsersIcon className="w-16 h-16 sm:w-20 sm:h-20 text-slate-300 mx-auto mb-4 sm:mb-6" />

          <p className="text-slate-500 text-base sm:text-lg mb-4">
            No users found
          </p>

          <Button
            onClick={onAddUser}
            className="bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg border-0 px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl font-semibold"
          >
            <Plus className="w-4 h-4 mr-2" /> Add First User
          </Button>
        </div>
      )}
    </div>
  );
}

GuestTable.propTypes = {
  users: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      fullName: PropTypes.string,
      email: PropTypes.string,
      phoneNumber: PropTypes.string,
      role: PropTypes.string.isRequired,
      updatedAt: PropTypes.string,
    }),
  ).isRequired,

  loading: PropTypes.bool.isRequired,

  allUsers: PropTypes.arrayOf(
    PropTypes.shape({
      role: PropTypes.string,
    }),
  ).isRequired,

  activeEditsByKey: PropTypes.objectOf(
    PropTypes.arrayOf(
      PropTypes.shape({
        socketId: PropTypes.string,
        userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        userName: PropTypes.string,
        role: PropTypes.string,
      }),
    ),
  ),

  currentSocketId: PropTypes.string,

  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onAddUser: PropTypes.func.isRequired,
};

GuestTable.defaultProps = {
  activeEditsByKey: {},
  currentSocketId: null,
};