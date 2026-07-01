import { useState, useEffect, useMemo, useCallback } from 'react';
import apiService from '@/services/api/apiService';
import { logger } from '@/config';

/**
 * Generic CRUD hook for admin management pages.
 *
 * @param {Object} config
 * @param {string} config.endpoint - The key in apiService.
 * @param {Function} config.mapApiResponse - Maps raw API data into UI-ready data.
 * @param {Object} config.initialFormState - Empty/default form state.
 * @returns {{
 *   state: Object,
 *   actions: Object
 * }}
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

  const [refreshKey, setRefreshKey] = useState(0);

  const api = apiService[endpoint];

  const fetchData = useCallback(() => {
    setLoading(true);
    setError(null);
    setRefreshKey((k) => k + 1);
  }, []);

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
        logger.error(`Error fetching ${endpoint}:`, err);
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

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    const searchStr = searchTerm.toLowerCase();
    return data.filter(
      (item) =>
        item.name?.toLowerCase().includes(searchStr) ||
        item.methodName?.toLowerCase().includes(searchStr) ||
        item.facilityName?.toLowerCase().includes(searchStr) ||
        item.extraServiceName?.toLowerCase().includes(searchStr) ||
        item.serviceName?.toLowerCase().includes(searchStr) ||
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
