const { ExtraService } = require('../models');

class ExtraServiceService {
  /**
   * Creates a new extra service.
   * @param {Object} data - Service data.
   * @returns {Promise<Object>} Created extra service.
   */
  async createExtraService({ serviceName, price }) {
    if (!serviceName || !price) {
      const err = new Error('serviceName and price are required'); err.statusCode = 400; throw err;
    }
    return ExtraService.create({ serviceName, price });
  }

  /**
   * Retrieves all available extra services.
   * @returns {Promise<Array>} List of extra services.
   */
  async getAllExtraServices() {
    return ExtraService.findAll({ order: [['createdAt', 'DESC']] });
  }

  /**
   * Retrieves a specific extra service by ID.
   * @param {string|number} id - Service ID.
   * @returns {Promise<Object>} Extra service data.
   */
  async getExtraServiceById(id) {
    const extraService = await ExtraService.findByPk(id);
    if (!extraService) {
      const err = new Error('Extra service not found'); err.statusCode = 404; throw err;
    }
    return extraService;
  }

  /**
   * Updates an existing extra service.
   * @param {string|number} id - Service ID.
   * @param {Object} data - Update data.
   * @returns {Promise<Object>} Updated extra service.
   */
  async updateExtraService(id, data) {
    const extraService = await ExtraService.findByPk(id);
    if (!extraService) {
      const err = new Error('Extra service not found'); err.statusCode = 404; throw err;
    }
    return extraService.update(data);
  }

  /**
   * Deletes an extra service.
   * @param {string|number} id - Service ID.
   * @returns {Promise<void>}
   */
  async deleteExtraService(id) {
    const extraService = await ExtraService.findByPk(id);
    if (!extraService) {
      const err = new Error('Extra service not found'); err.statusCode = 404; throw err;
    }
    await extraService.destroy();
  }
}

module.exports = new ExtraServiceService();