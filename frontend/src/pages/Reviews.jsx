import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import apiService from '../services/apiService';
import Card from '../components/ui/Card';
import Modal from '../components/common/Modal';
import { Star, MessageSquare, Calendar, Clock, Edit, Search } from 'lucide-react';

const Reviews = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const [activeTab, setActiveTab] = useState('all'); // 'all' or 'my'
  const [allReviews, setAllReviews] = useState([]);
  const [myReviews, setMyReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');

  // Review Modal
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [reviewFormData, setReviewFormData] = useState({
    bookingId: null,
    rating: 5,
    comment: ''
  });

  useEffect(() => {
    fetchReviews();
  }, []);

  // Parse query params on mount
  useEffect(() => {
    const tab = searchParams.get('tab') || 'all';
    const search = searchParams.get('search') || '';
    const rating = searchParams.get('rating') || '';

    setActiveTab(tab);
    setSearchTerm(search);
    setRatingFilter(rating);
  }, [searchParams]);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (activeTab !== 'all') params.set('tab', activeTab);
    if (searchTerm) params.set('search', searchTerm);
    if (ratingFilter) params.set('rating', ratingFilter);

    setSearchParams(params, { replace: true });
  }, [activeTab, searchTerm, ratingFilter, setSearchParams]);

  // Check if navigated from MyBookings with bookingId
  useEffect(() => {
    if (location.state?.bookingId) {
      setActiveTab('my');
      setReviewFormData({
        bookingId: location.state.bookingId,
        rating: 5,
        comment: ''
      });
      setShowReviewModal(true);
      // Clear the state to avoid re-opening modal on refresh
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const [allResponse, myResponse] = await Promise.all([
        apiService.reviews.getAll(),
        user ? apiService.reviews.getUserReviews(user.id) : Promise.resolve({ data: { data: [] } })
      ]);
      setAllReviews(allResponse.data.data || []);
      setMyReviews(myResponse.data.data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
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
        comment: review.comment
      });
    } else {
      setEditingReview(null);
      setReviewFormData({
        bookingId: bookingId,
        rating: 5,
        comment: ''
      });
    }
    setShowReviewModal(true);
  };

  const handleCloseReviewModal = () => {
    setShowReviewModal(false);
    setEditingReview(null);
    setReviewFormData({
      bookingId: null,
      rating: 5,
      comment: ''
    });
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      if (editingReview) {
        await apiService.reviews.update(editingReview.id, {
          rating: reviewFormData.rating,
          comment: reviewFormData.comment
        });
      } else {
        await apiService.reviews.create({
          bookingId: reviewFormData.bookingId,
          userId: user.id,
          rating: reviewFormData.rating,
          comment: reviewFormData.comment
        });
      }
      handleCloseReviewModal();
      fetchReviews();
    } catch (error) {
      console.error('Error saving review:', error);
      alert('Error saving review: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await apiService.reviews.delete(reviewId);
        fetchReviews();
      } catch (error) {
        console.error('Error deleting review:', error);
        alert('Error deleting review: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getRatingStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'fill-amber-500 text-amber-500' : 'text-slate-300'}`}
      />
    ));
  };

  const getRatingColor = (rating) => {
    if (rating >= 4) return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    if (rating >= 3) return 'bg-amber-100 text-amber-700 border-amber-200';
    return 'bg-red-100 text-red-700 border-red-200';
  };

  const filteredReviews = (activeTab === 'all' ? allReviews : myReviews).filter(review => {
    const matchesSearch =
      review.comment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.user?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.booking?.room?.roomType?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRating = !ratingFilter || review.rating.toString() === ratingFilter;
    return matchesSearch && matchesRating;
  });

  return (
      <div className="bg-gradient-to-br from-slate-50 via-amber-50/20 to-slate-50">
        <div className="container mx-auto px-6 py-8">
          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-slate-900 mb-2">
              Guest Reviews
            </h1>
            <p className="text-slate-600">
              Read and share experiences
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-8">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                activeTab === 'all'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg'
                  : 'bg-white text-slate-700 border-2 border-slate-200 hover:border-amber-300'
              }`}
            >
              All Reviews
            </button>
            {user && (
              <button
                onClick={() => setActiveTab('my')}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  activeTab === 'my'
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg'
                    : 'bg-white text-slate-700 border-2 border-slate-200 hover:border-amber-300'
                }`}
              >
                My Reviews
              </button>
            )}
          </div>

          {/* Search & Filter */}
          <Card className="bg-white border-2 border-slate-200 shadow-xl mb-8">
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Search Reviews</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search by comment, user, or room type..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Filter by Rating</label>
                  <select
                    value={ratingFilter}
                    onChange={(e) => setRatingFilter(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                  >
                    <option value="">All Ratings</option>
                    <option value="5">5 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="2">2 Stars</option>
                    <option value="1">1 Star</option>
                  </select>
                </div>
              </div>
            </div>
          </Card>

          {/* Reviews List */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
            </div>
          ) : filteredReviews.length === 0 ? (
            <Card className="bg-white border-2 border-slate-200 shadow-xl">
              <div className="text-center py-12">
                <MessageSquare className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 text-lg">No reviews found</p>
                {activeTab === 'my' && (
                  <p className="text-slate-400 text-sm mt-2">Complete a booking to leave a review</p>
                )}
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredReviews.map((review) => (
                <Card key={review.id} className="bg-white border-2 border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="p-5">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {review.user?.fullName?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900 text-sm">
                            {review.user?.fullName || 'Anonymous'}
                          </h3>
                          <div className="flex items-center gap-1 mt-0.5">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            <span className="text-xs text-slate-500">
                              {formatDate(review.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider border ${getRatingColor(review.rating)}`}>
                        <Star className="w-3 h-3 mr-0.5 fill-current" />
                        {review.rating}.0
                      </div>
                    </div>

                    {/* Room Info */}
                    <div className="bg-slate-50 rounded-lg p-3 mb-3">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-500">Room:</span>
                          <span className="text-xs font-medium text-slate-900">
                            {review.booking?.room?.roomType?.name || 'N/A'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span className="text-xs text-slate-500">
                            {formatDate(review.booking?.checkInDate)} - {formatDate(review.booking?.checkOutDate)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Rating Stars */}
                    <div className="flex items-center gap-0.5 mb-3">
                      {getRatingStars(review.rating)}
                    </div>

                    {/* Comment */}
                    <p className="text-slate-700 text-sm leading-relaxed mb-3 line-clamp-3">
                      {review.comment || 'No comment provided.'}
                    </p>

                    {/* Actions (only for own reviews) */}
                    {user && review.userId === user.id && (
                      <div className="flex items-center gap-2 pt-3 border-t border-slate-200">
                        <button
                          onClick={() => handleOpenReviewModal(review)}
                          className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-3 py-2 text-xs font-semibold rounded-lg shadow-md transition-all duration-300 flex items-center justify-center"
                        >
                          <Edit className="w-3 h-3 mr-1" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteReview(review.id)}
                          className="flex-1 bg-white hover:bg-red-50 text-red-600 border-2 border-red-200 hover:border-red-300 px-3 py-2 text-xs font-semibold rounded-lg shadow-sm transition-all duration-300 flex items-center justify-center"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Review Modal */}
        <Modal
          isOpen={showReviewModal}
          onClose={handleCloseReviewModal}
          title={editingReview ? 'Edit Review' : 'Write a Review'}
        >
          <form onSubmit={handleSubmitReview} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Rating</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewFormData({ ...reviewFormData, rating: star })}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-8 h-8 ${star <= reviewFormData.rating ? 'fill-amber-500 text-amber-500' : 'text-slate-300'}`}
                    />
                  </button>
                ))}
                <span className="ml-2 text-sm text-slate-600">{reviewFormData.rating} stars</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Comment</label>
              <textarea
                required
                value={reviewFormData.comment}
                onChange={(e) => setReviewFormData({ ...reviewFormData, comment: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all resize-none"
                placeholder="Share your experience..."
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={handleCloseReviewModal}
                className="flex-1 bg-white hover:bg-slate-50 text-slate-700 border-2 border-slate-200 hover:border-slate-300 px-6 py-3 rounded-xl font-semibold transition-all duration-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg px-6 py-3 rounded-xl font-semibold transition-all duration-300"
              >
                {editingReview ? 'Update Review' : 'Submit Review'}
              </button>
            </div>
          </form>
        </Modal>
      </div>
  );
};

export default Reviews;
