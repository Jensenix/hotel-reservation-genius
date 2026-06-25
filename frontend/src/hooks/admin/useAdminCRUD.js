import { useState, useEffect, useMemo, useCallback } from 'react';
import apiService from '@/services/api/apiService';

/**
 * A generic CRUD hook for Admin Management pages.
 * Replaces the legacy BaseAdminManagement class.
 * @param {string} endpoint - The key in apiService (e.g., 'facilities', 'extraServices')
 * @param {Function} mapApiResponse - Function to format raw API data
 * @param {Object} initialFormState - The empty state for the creation form
 */
export function useAdminCRUD({ endpoint, mapApiResponse, initialFormState }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [editingItem, setEditingItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [formData, setFormData] = useState(initialFormState);

  // Incrementing this key is what triggers a re-fetch from the effect below.
  const [refreshKey, setRefreshKey] = useState(0);

  const api = apiService[endpoint];

  // Public refresh trigger — called by event handlers and consumers, never from within an effect.
  // Calling setState here is safe: it is not inside an effect body.
  const fetchData = useCallback(() => {
    setLoading(true);
    setError(null);
    setRefreshKey((k) => k + 1);
  }, []);

  // The effect only starts the async operation. Every setState call lands inside a
  // .then / .catch / .finally callback, so nothing runs synchronously in the effect body.
  // The `cancelled` flag prevents stale state updates after unmount or dep changes.
  useEffect(() => {
    let cancelled = false;

    api
      .getAll()
      .then((response) => {
        if (cancelled) return;
        let dataToMap = response.data;
        if (response.data?.data && Array.isArray(response.data.data)) {
          dataToMap = response.data.data;
        }
        setData(mapApiResponse(dataToMap || []));
      })
      .catch((err) => {
        if (cancelled) return;
        console.error(`Error fetching ${endpoint}:`, err);
        setError(err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [api, mapApiResponse, endpoint, refreshKey]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await api.update(editingItem.id, formData);
      } else {
        await api.create(formData);
      }
      closeModal();
      fetchData();
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || 'Unknown error occurred';
      alert(`Error saving item: ${errorMessage}`);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(deleteTarget.id);
      closeDeleteModal();
      fetchData();
    } catch (err) {
      alert(
        `Error deleting item: ${err.response?.data?.message || err.message}`,
      );
    }
  };

  const handleEdit = (item, mappedFormData) => {
    setEditingItem(item);
    setFormData(mappedFormData);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
    setFormData(initialFormState);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setDeleteTarget(null);
  };

  // Safe universal filter logic supporting all specific database field names
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    const searchStr = searchTerm.toLowerCase();
    return data.filter(
      (item) =>
        item.name?.toLowerCase().includes(searchStr) ||
        item.methodName?.toLowerCase().includes(searchStr) ||
        item.facilityName?.toLowerCase().includes(searchStr) ||
        item.extraServiceName?.toLowerCase().includes(searchStr) ||
        item.description?.toLowerCase().includes(searchStr),
    );
  }, [data, searchTerm]);

  return {
    state: {
      data,
      filteredData,
      loading,
      error,
      searchTerm,
      showModal,
      showDeleteModal,
      editingItem,
      deleteTarget,
      formData,
    },
    actions: {
      setSearchTerm,
      setShowModal,
      setShowDeleteModal,
      setDeleteTarget,
      setFormData,
      handleEdit,
      handleDelete,
      handleSubmit,
      closeModal,
      closeDeleteModal,
      fetchData,
    },
  };
}
