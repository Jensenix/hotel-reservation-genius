import { useReviews } from '@/hooks/public/useReviews';
import ReviewFilters from '@/components/reviews/ReviewFilters';
import ReviewList from '@/components/reviews/ReviewList';
import ReviewModal from '@/components/reviews/ReviewModal';

/**
 * @returns {JSX.Element}
 */
const Reviews = () => {
  const {
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
  } = useReviews();

  return (
    <div className="bg-gradient-to-br from-slate-50 via-amber-50/20 to-slate-50 min-h-screen">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Guest Reviews
          </h1>
          <p className="text-slate-600">Read and share experiences</p>
        </div>

        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${activeTab === 'all' ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg' : 'bg-white text-slate-700 border-2 border-slate-200 hover:border-amber-300'}`}
          >
            All Reviews
          </button>
          {user && (
            <button
              onClick={() => setActiveTab('my')}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${activeTab === 'my' ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg' : 'bg-white text-slate-700 border-2 border-slate-200 hover:border-amber-300'}`}
            >
              My Reviews
            </button>
          )}
        </div>

        <ReviewFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          ratingFilter={ratingFilter}
          setRatingFilter={setRatingFilter}
        />

        <ReviewList
          loading={loading}
          filteredReviews={filteredReviews}
          activeTab={activeTab}
          user={user}
          handleOpenReviewModal={handleOpenReviewModal}
          handleDeleteReview={handleDeleteReview}
        />
      </div>

      <ReviewModal
        showReviewModal={showReviewModal}
        handleCloseReviewModal={handleCloseReviewModal}
        editingReview={editingReview}
        handleSubmitReview={handleSubmitReview}
        reviewFormData={reviewFormData}
        setReviewFormData={setReviewFormData}
      />
    </div>
  );
};

export default Reviews;
