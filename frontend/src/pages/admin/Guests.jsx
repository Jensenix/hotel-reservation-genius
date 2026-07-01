import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Plus, Users } from 'lucide-react';

import apiService from '@/services/api/apiService';
import AdminLayout from '@/layouts/AdminLayout';
import Button from '@/components/ui/Button';
import { WebSocketContext } from '@/context/WebSocketContext';
import { useWebSocket } from '@/hooks/useWebSocket';
import { useAdminCRUD } from '@/hooks/admin/useAdminCRUD';
import { RealtimeEvents } from '@/shared/eventContract';

import GuestStats from '@/components/admin/guests/GuestStats';
import GuestFilterBar from '@/components/admin/guests/GuestFilterBar';
import GuestTable from '@/components/admin/guests/GuestTable';
import GuestModals from '@/components/admin/guests/GuestModals';

const GUEST_RESOURCE_TYPE = 'guest';

/**
 * @param {string|number} userId
 * @returns {string}
 */
function makeGuestEditKey(userId) {
  return `${GUEST_RESOURCE_TYPE}:${userId}`;
}

/**
 * @param {Array<Object>} [activeEdits]
 * @returns {Object<string, Array<Object>>}
 */
function mapActiveEdits(activeEdits = []) {
  const mapped = {};

  for (const item of activeEdits) {
    if (!item?.key) continue;
    mapped[item.key] = item.editors || [];
  }

  return mapped;
}

/**
 * @param {Array<Object>} [editors]
 * @param {string} currentSocketId
 * @returns {Array<Object>}
 */
function getOtherEditors(editors = [], currentSocketId) {
  return editors.filter((editor) => editor.socketId !== currentSocketId);
}

/**
 * @param {Array<Object>} [editors]
 * @returns {string}
 */
function formatEditorNames(editors = []) {
  if (editors.length === 0) return '';

  return editors
    .map((editor) => editor.userName || `Admin ${editor.userId}`)
    .join(', ');
}

/**
 * @param {string|number} userId
 * @returns {string}
 */
export default function Guests() {
  const socket = useContext(WebSocketContext);

  const [roleFilter, setRoleFilter] = useState('');
  const [activeEditsByKey, setActiveEditsByKey] = useState({});
  const [editingWarningEditors, setEditingWarningEditors] = useState([]);
  const [onlineStaff, setOnlineStaff] = useState([]);

  const editingItemRef = useRef(null);

  const initialFormState = {
    fullName: '',
    email: '',
    password: '',
    phoneNumber: '',
    role: 'guest',
  };

  const mapApiResponse = useCallback((apiData) => {
    return Array.isArray(apiData)
      ? apiData.map((item) => ({
          id: item.id,
          name: item.fullName || '',
          fullName: item.fullName || '',
          email: item.email || '',
          phoneNumber: item.phoneNumber || '',
          role: item.role || 'guest',
          updatedAt: item.updatedAt,
        }))
      : [];
  }, []);

  const { state, actions } = useAdminCRUD({
    endpoint: 'users',
    initialFormState,
    mapApiResponse,
  });

  useEffect(() => {
    editingItemRef.current = state.editingItem;
  }, [state.editingItem]);

  useWebSocket(RealtimeEvents.EDITING.STARTED, (data) => {
    if (!data?.key) return;

    setActiveEditsByKey((prev) => ({
      ...prev,
      [data.key]: data.editors || [],
    }));
  });

  useWebSocket(RealtimeEvents.EDITING.STOPPED, (data) => {
    if (!data?.key) return;

    setActiveEditsByKey((prev) => {
      const next = { ...prev };

      if (data.editors && data.editors.length > 0) {
        next[data.key] = data.editors;
      } else {
        delete next[data.key];
      }

      return next;
    });
  });

  useWebSocket(RealtimeEvents.EDITING.ACTIVE_LIST, (data) => {
    setActiveEditsByKey(mapActiveEdits(data?.activeEdits || []));
  });

  useWebSocket(RealtimeEvents.STAFF.ACTIVE_LIST, (data) => {
    setOnlineStaff(data?.staff || []);
  });

  useWebSocket(RealtimeEvents.USER.CREATED, () => {
    actions.fetchData();
  });

  useWebSocket(RealtimeEvents.USER.UPDATED, () => {
    actions.fetchData();
  });

  useWebSocket(RealtimeEvents.USER.DELETED, () => {
    actions.fetchData();
  });

  useEffect(() => {
    if (!socket) return;

    socket.emit('editing:get_active', (response) => {
      if (!response?.ok) return;
      setActiveEditsByKey(mapActiveEdits(response.activeEdits || []));
    });

    socket.emit('staff:get_active', (response) => {
      if (!response?.ok) return;
      setOnlineStaff(response.staff || []);
    });
  }, [socket]);

  useEffect(() => {
    return () => {
      const editingItem = editingItemRef.current;

      if (!socket || !editingItem?.id) return;

      socket.emit('editing:stop', {
        resourceType: GUEST_RESOURCE_TYPE,
        resourceId: editingItem.id,
      });
    };
  }, [socket]);

  const stopEditingForItem = useCallback(
    (item) => {
      if (!socket || !item?.id) return;

      socket.emit('editing:stop', {
        resourceType: GUEST_RESOURCE_TYPE,
        resourceId: item.id,
      });
    },
    [socket],
  );

  const closeModalWithPresence = useCallback(() => {
    if (state.editingItem) {
      stopEditingForItem(state.editingItem);
    }

    setEditingWarningEditors([]);
    actions.closeModal();
  }, [actions, state.editingItem, stopEditingForItem]);

  const handleAddUser = () => {
    setEditingWarningEditors([]);
    actions.setShowModal(true);
  };

  const handleEditWithPresence = (user, mappedFormData = null) => {
    const editKey = makeGuestEditKey(user.id);
    const editors = activeEditsByKey[editKey] || [];
    const otherEditors = getOtherEditors(editors, socket?.id);

    if (otherEditors.length > 0) {
      const editorNames = formatEditorNames(otherEditors);

      const confirmed = window.confirm(
        `${editorNames} ${otherEditors.length === 1 ? 'is' : 'are'} currently editing this user. ` +
          'Are you sure you want to continue? Your changes may conflict with theirs.',
      );

      if (!confirmed) return;

      setEditingWarningEditors(otherEditors);
    } else {
      setEditingWarningEditors([]);
    }

    socket?.emit(
      'editing:start',
      {
        resourceType: GUEST_RESOURCE_TYPE,
        resourceId: user.id,
        resourceLabel: user.fullName || user.email || `User ${user.id}`,
      },
      (response) => {
        if (!response?.ok) return;

        const latestOtherEditors = response.otherEditors || [];

        if (latestOtherEditors.length > 0) {
          setEditingWarningEditors(latestOtherEditors);
        }
      },
    );

    actions.handleEdit(user, mappedFormData || { ...user, password: '' });
  };

  const finalFilteredUsers = state.filteredData.filter(
    (user) => !roleFilter || user.role === roleFilter,
  );

  const handleCustomSubmit = async (e) => {
    e.preventDefault();

    try {
      if (state.editingItem) {
        const updateData = {
          ...state.formData,
          expectedUpdatedAt: state.editingItem.updatedAt,
        };

        if (!updateData.password) {
          delete updateData.password;
        }

        await apiService.users.update(state.editingItem.id, updateData);

        stopEditingForItem(state.editingItem);
      } else {
        await apiService.users.create(state.formData);
      }

      setEditingWarningEditors([]);
      actions.closeModal();
      actions.fetchData();
    } catch (error) {
      const message = error.response?.data?.message || error.message;

      if (error.response?.status === 409) {
        actions.fetchData();
        alert(message);
        return;
      }

      alert(`Error saving user: ${message}`);
    }
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50/20 to-slate-50">
        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="mb-8 sm:mb-12">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div>
                <div className="flex items-center space-x-3 mb-2 sm:mb-3">
                  <div className="w-8 sm:w-12 h-0.5 bg-gradient-to-r from-transparent to-amber-500"></div>
                  <span className="text-amber-600 text-xs font-semibold tracking-widest uppercase">
                    User Management
                  </span>
                  <div className="w-8 sm:w-12 h-0.5 bg-gradient-to-l from-transparent to-amber-500"></div>
                </div>

                <h1 className="text-3xl sm:text-5xl font-light text-slate-800 mb-1 sm:mb-2 tracking-tight">
                  Hotel{' '}
                  <span className="font-semibold text-amber-600">
                    Users & Staff
                  </span>
                </h1>

                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <p className="text-slate-500 text-sm tracking-wide">
                    Manage Hotel Personnel & Guest Accounts
                  </p>

                  <div className="inline-flex items-center w-fit px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
                    <Users className="w-3.5 h-3.5 mr-1.5" />
                    {onlineStaff.length} staff online
                  </div>
                </div>
              </div>

              <Button
                onClick={handleAddUser}
                className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-xl border-0 px-8 py-3.5 sm:py-3 rounded-xl font-semibold transition-all duration-300 flex justify-center items-center"
              >
                <Plus className="w-5 h-5 mr-2" /> Add User
              </Button>
            </div>
          </div>

          <GuestStats users={state.data} />

          <GuestFilterBar
            searchTerm={state.searchTerm}
            setSearchTerm={actions.setSearchTerm}
            roleFilter={roleFilter}
            setRoleFilter={setRoleFilter}
          />

          <GuestTable
            users={finalFilteredUsers}
            loading={state.loading}
            allUsers={state.data}
            activeEditsByKey={activeEditsByKey}
            currentSocketId={socket?.id}
            onEdit={handleEditWithPresence}
            onDelete={(user) => {
              actions.setDeleteTarget(user);
              actions.setShowDeleteModal(true);
            }}
            onAddUser={handleAddUser}
          />

          <GuestModals
            state={{
              ...state,
              editingWarningEditors,
            }}
            actions={{
              ...actions,
              closeModal: closeModalWithPresence,
            }}
            handleCustomSubmit={handleCustomSubmit}
          />
        </div>
      </div>
    </AdminLayout>
  );
}
