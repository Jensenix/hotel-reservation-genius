class Pagination {
  static getPagination(page, size) {
    const limit = size ? +size : 14;
    const offset = page ? (page - 1) * limit : 0;
    return { limit, offset };
  }

  static getPagingData(data, page, limit) {
    const totalItems = parseInt(data?.count || data?.rowCount || 0);
    const results = data?.rows || [];
    const currentPage = page ? parseInt(page) : 1;
    const safeLimit = limit && parseInt(limit) > 0 ? parseInt(limit) : 14;
    const totalPages = totalItems > 0 ? Math.ceil(totalItems / safeLimit) : 0;
    
    return { 
        totalItems, 
        results, 
        totalPages, 
        currentPage 
    };
  }
}

module.exports = Pagination;
