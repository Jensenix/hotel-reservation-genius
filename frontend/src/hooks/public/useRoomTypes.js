import { useState, useEffect, useMemo } from 'react';
import apiService from '@/services/api/apiService';
import { logger } from '@/config';

/**
 * @returns {{
 *   roomTypes: Array<Object>,
 *   filteredRoomTypes: Array<Object>,
 *   loading: boolean,
 *   searchTerm: string,
 *   setSearchTerm: Function,
 *   showRoomTypeModal: boolean,
 *   editingRoomType: Object|null,
 *   roomTypeFormData: Object,
 *   setRoomTypeFormData: Function,
 *   handleOpenRoomTypeModal: Function,
 *   handleCloseRoomTypeModal: Function,
 *   handleSubmitRoomType: Function,
 *   showDeleteModal: boolean,
 *   setShowDeleteModal: Function,
 *   deleteTarget: Object|null,
 *   setDeleteTarget: Function,
 *   handleDelete: Function
 * }}
 */
export const useRoomTypes = () => {
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const [showRoomTypeModal, setShowRoomTypeModal] = useState(false);
  const [editingRoomType, setEditingRoomType] = useState(null);
  const [roomTypeFormData, setRoomTypeFormData] = useState({
    name: '',
    description: '',
    basePrice: '',
    maxCapacity: '',
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    let ignore = false;

    const initialFetch = async () => {
      try {
        const response = await apiService.roomTypes.getAll();
        if (!ignore) {
          setRoomTypes(response.data.data || []);
        }
      } catch (error) {
        if (!ignore) logger.error('Error fetching room types:', error);
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    initialFetch();

    return () => {
      ignore = true;
    };
  }, []);

  const refetchRoomTypes = async () => {
    setLoading(true);
    try {
      const response = await apiService.roomTypes.getAll();
      setRoomTypes(response.data.data || []);
    } catch (error) {
      logger.error('Error refetching room types:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenRoomTypeModal = (roomType = null) => {
    if (roomType) {
      setEditingRoomType(roomType);
      setRoomTypeFormData({
        name: roomType.name,
        description: roomType.description || '',
        basePrice: roomType.basePrice,
        maxCapacity: roomType.maxCapacity,
      });
    } else {
      setEditingRoomType(null);
      setRoomTypeFormData({
        name: '',
        description: '',
        basePrice: '',
        maxCapacity: '',
      });
    }
    setShowRoomTypeModal(true);
  };

  const handleCloseRoomTypeModal = () => {
    setShowRoomTypeModal(false);
    setEditingRoomType(null);
    setRoomTypeFormData({
      name: '',
      description: '',
      basePrice: '',
      maxCapacity: '',
    });
  };

  const handleSubmitRoomType = async (e) => {
    e.preventDefault();
    try {
      if (editingRoomType) {
        await apiService.roomTypes.update(editingRoomType.id, roomTypeFormData);
      } else {
        await apiService.roomTypes.create(roomTypeFormData);
      }
      handleCloseRoomTypeModal();
      refetchRoomTypes();
    } catch (error) {
      logger.error('Error saving room type:', error);
      alert(
        'Error saving room type: ' +
          (error.response?.data?.message || error.message),
      );
    }
  };

  const handleDelete = async () => {
    try {
      await apiService.roomTypes.delete(deleteTarget.id);
      setShowDeleteModal(false);
      setDeleteTarget(null);
      refetchRoomTypes();
    } catch (error) {
      logger.error('Error deleting room type:', error);
      alert(
        'Error deleting room type: ' +
          (error.response?.data?.message || error.message),
      );
    }
  };

  const filteredRoomTypes = useMemo(
    () =>
      roomTypes.filter((rt) =>
        rt.name.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    [roomTypes, searchTerm],
  );

  return {
    roomTypes,
    filteredRoomTypes,
    loading,
    searchTerm,
    setSearchTerm,
    showRoomTypeModal,
    editingRoomType,
    roomTypeFormData,
    setRoomTypeFormData,
    handleOpenRoomTypeModal,
    handleCloseRoomTypeModal,
    handleSubmitRoomType,
    showDeleteModal,
    setShowDeleteModal,
    deleteTarget,
    setDeleteTarget,
    handleDelete,
  };
};
