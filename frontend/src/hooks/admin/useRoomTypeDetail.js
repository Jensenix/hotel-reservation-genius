import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import apiService from '@/services/api/apiService';
import { logger } from '@/config';

export const useRoomTypeDetail = () => {
  const { roomTypeId } = useParams();
  const [roomType, setRoomType] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showRoomModal, setShowRoomModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [roomFormData, setRoomFormData] = useState({
    roomNumber: '',
    roomTypeId: roomTypeId,
    floor: '',
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingRoom, setDeletingRoom] = useState(null);

  const fetchRoomTypeDetail = useCallback(async () => {
    try {
      const response = await apiService.roomTypes.getById(roomTypeId);
      setRoomType(response.data.data);
    } catch (error) {
      logger.error('Error fetching room type:', error);
    }
  }, [roomTypeId]);

  const fetchRooms = useCallback(async () => {
    try {
      const response = await apiService.rooms.getAll();
      const allRooms = response.data.data || [];
      const typeRooms = allRooms.filter(
        (room) => room.roomTypeId === parseInt(roomTypeId, 10),
      );
      setRooms(typeRooms);
    } catch (error) {
      logger.error('Error fetching rooms:', error);
      setRooms([]);
    } finally {
      setLoading(false);
    }
  }, [roomTypeId]);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      if (isMounted) {
        await Promise.all([fetchRoomTypeDetail(), fetchRooms()]);
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [fetchRoomTypeDetail, fetchRooms]);

  const handleOpenRoomModal = (room = null) => {
    if (room) {
      setEditingRoom(room);
      setRoomFormData({
        roomNumber: room.roomNumber,
        roomTypeId: room.roomTypeId,
        floor: room.floor,
      });
    } else {
      setEditingRoom(null);
      setRoomFormData({
        roomNumber: '',
        roomTypeId: roomTypeId,
        floor: '',
      });
    }
    setShowRoomModal(true);
  };

  const handleCloseRoomModal = () => {
    setShowRoomModal(false);
    setEditingRoom(null);
    setRoomFormData({
      roomNumber: '',
      roomTypeId: roomTypeId,
      floor: '',
    });
  };

  const handleSubmitRoom = async (e) => {
    e.preventDefault();
    try {
      if (editingRoom) {
        await apiService.rooms.update(editingRoom.id, roomFormData);
      } else {
        await apiService.rooms.create(roomFormData);
      }
      handleCloseRoomModal();
      fetchRooms();
    } catch (error) {
      logger.error('Error saving room:', error);
      alert(
        'Error saving room: ' +
          (error.response?.data?.message || error.message),
      );
    }
  };

  const handleDelete = async () => {
    try {
      await apiService.rooms.delete(deletingRoom.id);
      setShowDeleteModal(false);
      setDeletingRoom(null);
      fetchRooms();
    } catch (error) {
      logger.error('Error deleting room:', error);
      alert(
        'Error deleting room: ' +
          (error.response?.data?.message || error.message),
      );
    }
  };

  return {
    roomType,
    rooms,
    setRooms,
    loading,
    showRoomModal,
    editingRoom,
    roomFormData,
    setRoomFormData,
    showDeleteModal,
    deletingRoom,
    setDeletingRoom,
    setShowDeleteModal,
    handleOpenRoomModal,
    handleCloseRoomModal,
    handleSubmitRoom,
    handleDelete,
  };
};