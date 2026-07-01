import Card from '@/components/ui/Card';
import { Search } from 'lucide-react';
import PropTypes from 'prop-types';

const ReviewFilters = ({
  searchTerm,
  setSearchTerm,
  ratingFilter,
  setRatingFilter,
}) => {
  return (
    <Card className="bg-white border-2 border-slate-200 shadow-xl mb-8">
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label
              htmlFor="searchReviews"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              Search Reviews
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />

              <input
                id="searchReviewsMobile"
                type="text"
                placeholder="Search reviews..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all sm:hidden"
              />

              <input
                id="searchReviews"
                type="text"
                placeholder="Search by comment, user, or room type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="hidden sm:block w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="filterRating"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              Filter by Rating
            </label>
            <select
              id="filterRating"
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
  );
};

ReviewFilters.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  setSearchTerm: PropTypes.func.isRequired,
  ratingFilter: PropTypes.string.isRequired,
  setRatingFilter: PropTypes.func.isRequired,
};

export default ReviewFilters;
