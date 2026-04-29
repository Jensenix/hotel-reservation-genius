/**
 * A generic base service to handle common CRUD operations.
 */
class BaseService {
  /**
   * @param {Object} model - The Sequelize model.
   * @param {string} resourceName - The name of the resource (for error messages).
   */
  constructor(model, resourceName = 'Resource') {
    this.model = model;
    this.resourceName = resourceName;
  }

  /**
   * Retrieves all records, optionally with query filters and pagination.
   * @param {Object} [options] - Sequelize query options (where, include, order, etc.).
   * @returns {Promise<Array|Object>} List of records (or { rows, count } if paginated).
   */
  async getAll(options = {}) {
    // If limit/offset are provided, use findAndCountAll for pagination
    if (options.limit !== undefined && options.offset !== undefined) {
      return this.model.findAndCountAll(options);
    }
    return this.model.findAll(options);
  }

  /**
   * Retrieves a specific record by ID.
   * @param {string|number} id - The record ID.
   * @param {Object} [options] - Sequelize query options (include, attributes, etc.).
   * @returns {Promise<Object>} The record data.
   * @throws {Error} If the record is not found.
   */
  async getById(id, options = {}) {
    const record = await this.model.findByPk(id, options);
    if (!record) {
      const err = new Error(`${this.resourceName} not found`);
      err.statusCode = 404;
      throw err;
    }
    return record;
  }

  /**
   * Creates a new record.
   * @param {Object} data - The data to create the record.
   * @returns {Promise<Object>} The newly created record.
   */
  async create(data) {
    return this.model.create(data);
  }

  /**
   * Updates an existing record.
   * @param {string|number} id - The record ID.
   * @param {Object} data - The data to update.
   * @returns {Promise<Object>} The updated record.
   * @throws {Error} If the record is not found.
   */
  async update(id, data) {
    const record = await this.getById(id);
    return record.update(data);
  }

  /**
   * Deletes a record.
   * @param {string|number} id - The record ID.
   * @returns {Promise<void>}
   * @throws {Error} If the record is not found.
   */
  async delete(id) {
    const record = await this.getById(id);
    await record.destroy();
  }
}

module.exports = BaseService;