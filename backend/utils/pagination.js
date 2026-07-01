/**
 * @module Pagination
 * Utility class for handling pagination values and paginated response metadata.
 *
 * Responsibilities:
 * - Convert page/size query parameters into Sequelize limit/offset values
 * - Normalize Sequelize paginated query results
 * - Return consistent pagination metadata for API responses
 */

/**
 * Pagination helper class.
 *
 * Designed for Sequelize queries that return data in this shape:
 * {
 *   count: number,
 *   rows: array
 * }
 */
class Pagination {
  /**
   * Converts page and size values into database pagination options.
   *
   * Example:
   * page = 2, size = 10
   *
   * Result:
   * limit = 10
   * offset = 10
   *
   * @param {number|string} page Current page number
   * @param {number|string} size Number of records per page
   *
   * @returns {{ limit: number, offset: number }}
   */
  static getPagination(page, size) {
    const limit = size ? +size : 10;
    const offset = page ? (page - 1) * limit : 0;

    return { limit, offset };
  }

  /**
   * Formats paginated database results into a consistent response object.
   *
   * Supports Sequelize-style results:
   * {
   *   count: number,
   *   rows: array
   * }
   *
   * Also supports rowCount as a fallback for other query result formats.
   *
   * @param {object} data Paginated database result
   * @param {number|string} page Current page number
   * @param {number|string} limit Records per page
   *
   * @returns {{
   *   totalItems: number,
   *   results: Array,
   *   totalPages: number,
   *   currentPage: number
   * }}
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
