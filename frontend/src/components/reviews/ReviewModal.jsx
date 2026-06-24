import Modal from '@/components/ui/Modal';
import { Star } from 'lucide-react';
import PropTypes from 'prop-types';

const ReviewModal = ({
  showReviewModal,
  handleCloseReviewModal,
  editingReview,
  handleSubmitReview,
  reviewFormData,
  setReviewFormData,
}) => {
  return (
    <Modal
      isOpen={showReviewModal}
      onClose={handleCloseReviewModal}
      title={editingReview ? 'Edit Review' : 'Write a Review'}
    >
      <form onSubmit={handleSubmitReview} className="space-y-6">
        <div>
          {/* ACCESSIBILITY FIX: Replaced <label> with semantic <span> and radiogroup */}
          <span
            id="rating-group-label"
            className="block text-sm font-medium text-slate-700 mb-2"
          >
            Rating
          </span>
          <div
            role="radiogroup"
            aria-labelledby="rating-group-label"
            className="flex items-center gap-2"
          >
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                role="radio"
                aria-checked={reviewFormData.rating === star}
                onClick={() =>
                  setReviewFormData({ ...reviewFormData, rating: star })
                }
                className="transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-amber-500 rounded-full"
              >
                <Star
                  className={`w-8 h-8 ${star <= reviewFormData.rating ? 'fill-amber-500 text-amber-500' : 'text-slate-300'}`}
                />
              </button>
            ))}
            <span className="ml-2 text-sm text-slate-600" aria-live="polite">
              {reviewFormData.rating} stars
            </span>
          </div>
        </div>

        <div>
          <label
            htmlFor="reviewComment"
            className="block text-sm font-medium text-slate-700 mb-2"
          >
            Comment
          </label>
          <textarea
            id="reviewComment"
            required
            value={reviewFormData.comment}
            onChange={(e) =>
              setReviewFormData({ ...reviewFormData, comment: e.target.value })
            }
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
  );
};

ReviewModal.propTypes = {
  showReviewModal: PropTypes.bool.isRequired,
  handleCloseReviewModal: PropTypes.func.isRequired,
  editingReview: PropTypes.object,
  handleSubmitReview: PropTypes.func.isRequired,
  reviewFormData: PropTypes.object.isRequired,
  setReviewFormData: PropTypes.func.isRequired,
};

export default ReviewModal;
