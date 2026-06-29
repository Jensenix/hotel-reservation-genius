/**
 * Pagination Utility Class
 *
 * Provides helper methods for:
 * - Calculating database query pagination values (limit and offset)
 * - Formatting paginated query results into a consistent response structure
 *
 * Designed to work with Sequelize pagination queries that return:
 * {
 *   count: number,
 *   rows: array
 * }
 */
class Pagination {
  
  /**
   * Calculate pagination values for database queries.
   *
   * Converts page and size query parameters into:
   * - limit: number of records per page
   * - offset: number of records to skip
   *
   * @param {number|string} page - Current page number
   * @param {number|string} size - Number of records per page
   *
   * @returns {Object} Pagination query options
   * @returns {number} limit - Maximum records to return
   * @returns {number} offset - Records to skip before fetching data
   *
   * @example
   * Pagination.getPagination(2, 10)
   * // Returns:
   * {
   *   limit: 10,
   *   offset: 10
   * }
   */
  static getPagination(page, size) {
    const limit = size ? +size : 10;
    const offset = page ? (page - 1) * limit : 0;

    return { limit, offset };
  }


  /**
   * Format paginated database results.
   *
   * Extracts total items and rows from Sequelize pagination response
   * and returns a standardized pagination object.
   *
   * Supports Sequelize result formats:
   * {
   *   count: number,
   *   rows: []
   * }
   *
   * @param {Object} data - Database query result
   * @param {number|string} page - Current page number
   * @param {number|string} limit - Records per page
   *
   * @returns {Object} Formatted pagination response
   * @returns {number} totalItems - Total number of records
   * @returns {Array} results - Records for current page
   * @returns {number} totalPages - Total available pages
   * @returns {number} currentPage - Current page number
   *
   * @example
   * Pagination.getPagingData(
   *   {
   *     count: 25,
   *     rows: [...]
   *   },
   *   1,
   *   10
   * )
   *
   * // Returns:
   * {
   *   totalItems: 25,
   *   results: [...],
   *   totalPages: 3,
   *   currentPage: 1
   * }
   */
  static getPagingData(data, page, limit) {
    const totalItems = parseInt(data?.count || data?.rowCount || 0);
    const results = data?.rows || [];
    const currentPage = page ? parseInt(page) : 1;
    const safeLimit = limit && parseInt(limit) > 0 ? parseInt(limit) : 10;
    const totalPages = totalItems > 0 ? Math.ceil(totalItems / safeLimit) : 0;

    return {
      totalItems,
      results,
      totalPages,
      currentPage,
    };
  }
}

export default Pagination;