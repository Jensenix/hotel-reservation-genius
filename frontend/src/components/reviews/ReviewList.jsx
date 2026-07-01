import Card from '@/components/ui/Card';
import { MessageSquare } from 'lucide-react';
import ReviewCard from './ReviewCard';
import PropTypes from 'prop-types';

/**
 * @param {Object} props
 * @param {boolean} props.loading
 * @param {Array<Object>} props.filteredReviews
 * @param {string} props.activeTab
 * @param {Object|null} [props.user]
 * @param {Function} props.handleOpenReviewModal
 * @param {Function} props.handleDeleteReview
 * @returns {JSX.Element}
 */
const ReviewList = ({
  loading,
  filteredReviews,
  activeTab,
  user,
  handleOpenReviewModal,
  handleDeleteReview,
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  if (filteredReviews.length === 0) {
    return (
      <Card className="bg-white border-2 border-slate-200 shadow-xl">
        <div className="text-center py-12">
          <MessageSquare className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 text-lg">No reviews found</p>
          {activeTab === 'my' && (
            <p className="text-slate-400 text-sm mt-2">
              Complete a booking to leave a review
            </p>
          )}
        </div>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredReviews.map((review) => (
        <ReviewCard
          key={review.id}
          review={review}
          user={user}
          handleOpenReviewModal={handleOpenReviewModal}
          handleDeleteReview={handleDeleteReview}
        />
      ))}
    </div>
  );
};

ReviewList.propTypes = {
  loading: PropTypes.bool.isRequired,
  filteredReviews: PropTypes.array.isRequired,
  activeTab: PropTypes.string.isRequired,
  user: PropTypes.object,
  handleOpenReviewModal: PropTypes.func.isRequired,
  handleDeleteReview: PropTypes.func.isRequired,
};

export default ReviewList;
