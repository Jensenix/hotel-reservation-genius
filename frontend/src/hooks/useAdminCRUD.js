import { useState, useEffect, useMemo } from 'react';
import apiService from '@/services/apiService';

/**
 * A generic CRUD hook for Admin Management pages.
 * Replaces the legacy BaseAdminManagement class.
 * * @param {string} endpoint - The key in apiService (e.g., 'facilities', 'extraServices')
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

  const api = apiService[endpoint];

  useEffect(() => {
    fetchData();
  }, [endpoint]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await api.getAll();
      
      let dataToMap = response.data;
      if (response.data?.data && Array.isArray(response.data.data)) {
        dataToMap = response.data.data;
      }

      setData(mapApiResponse(dataToMap || []));
    } catch (err) {
      console.error(`Error fetching ${endpoint}:`, err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await api.update(editingItem.id, formData);
      } else {
        await api.create(formData);
      }
      closeModal();
      await fetchData();
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Unknown error occurred';
      alert(`Error saving item: ${errorMessage}`);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(deleteTarget.id);
      closeDeleteModal();
      await fetchData();
    } catch (err) {
      alert(`Error deleting item: ${err.response?.data?.message || err.message}`);
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

  // Filter logic
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    return data.filter(item => 
      item.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  return {
    state: { data, filteredData, loading, error, searchTerm, showModal, showDeleteModal, editingItem, deleteTarget, formData },
    actions: { 
      setSearchTerm, setShowModal, setShowDeleteModal, setDeleteTarget, 
      setFormData, handleEdit, handleDelete, handleSubmit, closeModal, closeDeleteModal 
    }
  };
}