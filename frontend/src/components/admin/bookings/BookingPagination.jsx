import Button from '@/components/ui/Button';

export default function BookingsPagination({
  pagination,
  filters,
  handleFilterChange,
}) {
  if (!pagination || pagination.totalPages <= 0) return null;

  return (
    <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
      <div className="flex items-center gap-4">
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
            className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={30}>30</option>
            <option value={50}>50</option>
          </select>
          <span className="text-sm text-gray-600">per page</span>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleFilterChange('page', pagination.currentPage - 1)}
          disabled={pagination.currentPage === 1}
        >
          Previous
        </Button>

        <div className="flex space-x-1">
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
                  className="min-w-[40px]"
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
