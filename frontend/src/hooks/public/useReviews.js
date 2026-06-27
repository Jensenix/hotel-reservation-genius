import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/auth/useAuth';
import apiService from '@/services/api/apiService';

export const useReviews = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const [activeTab, setActiveTab] = useState(() =>
    location.state?.bookingId ? 'my' : searchParams.get('tab') || 'all',
  );
  const [searchTerm, setSearchTerm] = useState(
    () => searchParams.get('search') || '',
  );
  const [ratingFilter, setRatingFilter] = useState(
    () => searchParams.get('rating') || '',
  );

  const [showReviewModal, setShowReviewModal] = useState(
    () => !!location.state?.bookingId,
  );
  const [reviewFormData, setReviewFormData] = useState(() => ({
    bookingId: location.state?.bookingId || null,
    rating: 5,
    comment: '',
  }));

  const [allReviews, setAllReviews] = useState([]);
  const [myReviews, setMyReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingReview, setEditingReview] = useState(null);

  useEffect(() => {
    if (location.state?.bookingId) {
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate, location.pathname]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);

    if (activeTab !== 'all') params.set('tab', activeTab);
    else params.delete('tab');

    if (searchTerm) params.set('search', searchTerm);
    else params.delete('search');

    if (ratingFilter) params.set('rating', ratingFilter);
    else params.delete('rating');

    setSearchParams(params, { replace: true });
  }, [activeTab, searchTerm, ratingFilter, setSearchParams, searchParams]);

  useEffect(() => {
    let ignore = false;

    const initialFetch = async () => {
      try {
        const [allResponse, myResponse] = await Promise.all([
          apiService.reviews.getAll(),
          user
            ? apiService.reviews.getUserReviews(user.id)
            : Promise.resolve({ data: { data: [] } }),
        ]);
        if (!ignore) {
          setAllReviews(allResponse.data.data || []);
          setMyReviews(myResponse.data.data || []);
        }
      } catch (error) {
        if (!ignore) console.error('Error fetching reviews:', error);
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    initialFetch();

    return () => {
      ignore = true;
    };
  }, [user]);

  const refetchReviews = async () => {
    setLoading(true);
    try {
      const [allResponse, myResponse] = await Promise.all([
        apiService.reviews.getAll(),
        user
          ? apiService.reviews.getUserReviews(user.id)
          : Promise.resolve({ data: { data: [] } }),
      ]);
      setAllReviews(allResponse.data.data || []);
      setMyReviews(myResponse.data.data || []);
    } catch (error) {
      console.error('Error refetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenReviewModal = (review = null, bookingId = null) => {
    if (review) {
      setEditingReview(review);
      setReviewFormData({
        bookingId: review.bookingId,
        rating: review.rating,
        comment: review.comment,
      });
    } else {
      setEditingReview(null);
      setReviewFormData({ bookingId, rating: 5, comment: '' });
    }
    setShowReviewModal(true);
  };

  const handleCloseReviewModal = () => {
    setShowReviewModal(false);
    setEditingReview(null);
    setReviewFormData({ bookingId: null, rating: 5, comment: '' });
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      if (editingReview) {
        await apiService.reviews.update(editingReview.id, {
          rating: reviewFormData.rating,
          comment: reviewFormData.comment,
        });
      } else {
        await apiService.reviews.create({
          bookingId: reviewFormData.bookingId,
          userId: user.id,
          rating: reviewFormData.rating,
          comment: reviewFormData.comment,
        });
      }
      handleCloseReviewModal();
      refetchReviews();
    } catch (error) {
      console.error('Error saving review:', error);
      alert(
        'Error saving review: ' +
          (error.response?.data?.message || error.message),
      );
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await apiService.reviews.delete(reviewId);
        refetchReviews();
      } catch (error) {
        console.error('Error deleting review:', error);
        alert(
          'Error deleting review: ' +
            (error.response?.data?.message || error.message),
        );
      }
    }
  };

  const filteredReviews = useMemo(() => {
    const source = activeTab === 'all' ? allReviews : myReviews;
    return source.filter((review) => {
      const matchesSearch =
        review.comment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.user?.fullName
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        review.booking?.room?.roomType?.name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());
      const matchesRating =
        !ratingFilter || review.rating.toString() === ratingFilter;
      return matchesSearch && matchesRating;
    });
  }, [activeTab, allReviews, myReviews, searchTerm, ratingFilter]);

  return {
    user,
    activeTab,
    setActiveTab,
    loading,
    searchTerm,
    setSearchTerm,
    ratingFilter,
    setRatingFilter,
    filteredReviews,
    showReviewModal,
    editingReview,
    reviewFormData,
    setReviewFormData,
    handleOpenReviewModal,
    handleCloseReviewModal,
    handleSubmitReview,
    handleDeleteReview,
  };
};
