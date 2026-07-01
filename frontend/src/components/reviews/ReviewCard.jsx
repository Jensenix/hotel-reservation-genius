import Card from '@/components/ui/Card';
import { Star, Calendar, Clock, Edit } from 'lucide-react';
import PropTypes from 'prop-types';

/**
 * @param {string} dateString
 * @returns {string}
 */
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * @param {number} rating
 * @returns {string}
 */
const getRatingColor = (rating) => {
  if (rating >= 4) return 'bg-emerald-100 text-emerald-700 border-emerald-200';
  if (rating >= 3) return 'bg-amber-100 text-amber-700 border-amber-200';
  return 'bg-red-100 text-red-700 border-red-200';
};

/**
 * @param {Object} props
 * @param {Object} props.review
 * @param {Object|null} [props.user]
 * @param {Function} props.handleOpenReviewModal
 * @param {Function} props.handleDeleteReview
 * @returns {JSX.Element}
 */
const ReviewCard = ({
  review,
  user,
  handleOpenReviewModal,
  handleDeleteReview,
}) => {
  return (
    <Card className="bg-white border-2 border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300">
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
          <div
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider border ${getRatingColor(review.rating)}`}
          >
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
                {formatDate(review.booking?.checkInDate)} -{' '}
                {formatDate(review.booking?.checkOutDate)}
              </span>
            </div>
          </div>
        </div>

        {/* Rating Stars */}
        <div className="flex items-center gap-0.5 mb-3">
          {Array.from({ length: 5 }, (_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${i < review.rating ? 'fill-amber-500 text-amber-500' : 'text-slate-300'}`}
            />
          ))}
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
  );
};

ReviewCard.propTypes = {
  review: PropTypes.object.isRequired,
  user: PropTypes.object,
  handleOpenReviewModal: PropTypes.func.isRequired,
  handleDeleteReview: PropTypes.func.isRequired,
};

export default ReviewCard;
