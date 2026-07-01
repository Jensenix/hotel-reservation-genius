import Button from '@/components/ui/Button';
import PropTypes from 'prop-types';

export default function BookingsPagination({
  pagination,
  filters,
  handleFilterChange,
}) {
  if (!pagination || pagination.totalPages <= 0) return null;

  return (
    <div className="mt-6 flex flex-col lg:flex-row justify-between items-center gap-6">
      
      {/* Left side info & dropdown */}
      <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left w-full lg:w-auto justify-between sm:justify-start">
        <div className="text-sm text-gray-700">
          Showing {(pagination.currentPage - 1) * pagination.itemsPerPage + 1}{' '}
          to{' '}
          {Math.min(
            pagination.currentPage * pagination.itemsPerPage,
            pagination.totalItems,
          )}{' '}
          of {pagination.totalItems} results
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Show:</span>
          <select
            value={filters.limit}
            onChange={(e) =>
              handleFilterChange('limit', parseInt(e.target.value))
            }
            className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={30}>30</option>
            <option value={50}>50</option>
          </select>
          <span className="text-sm text-gray-600">per page</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2 w-full lg:w-auto">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleFilterChange('page', pagination.currentPage - 1)}
          disabled={pagination.currentPage === 1}
        >
          Prev
        </Button>

        <div className="flex flex-wrap items-center justify-center gap-1">
          {Array.from(
            { length: Math.min(5, pagination.totalPages) },
            (_, i) => {
              let pageNum;
              if (pagination.totalPages <= 5) pageNum = i + 1;
              else if (pagination.currentPage <= 3) pageNum = i + 1;
              else if (pagination.currentPage >= pagination.totalPages - 2)
                pageNum = pagination.totalPages - 4 + i;
              else pageNum = pagination.currentPage - 2 + i;

              return (
                <Button
                  key={pageNum}
                  variant={
                    pagination.currentPage === pageNum ? 'primary' : 'outline'
                  }
                  size="sm"
                  onClick={() => handleFilterChange('page', pageNum)}
                  className="min-w-[36px] sm:min-w-[40px] px-2"
                >
                  {pageNum}
                </Button>
              );
            },
          )}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => handleFilterChange('page', pagination.currentPage + 1)}
          disabled={pagination.currentPage === pagination.totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

BookingsPagination.propTypes = {
  pagination: PropTypes.shape({
    currentPage: PropTypes.number.isRequired,
    itemsPerPage: PropTypes.number.isRequired,
    totalItems: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired,
  }),
  filters: PropTypes.shape({
    limit: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]).isRequired,
  }).isRequired,
  handleFilterChange: PropTypes.func.isRequired,
};