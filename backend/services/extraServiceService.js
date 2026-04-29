const { ExtraService } = require('../models');
const BaseService = require('./base/baseService');

class ExtraServiceService extends BaseService {
  constructor() {
    super(ExtraService, 'Extra service');
  }

  /**
   * Overrides the default getAll to apply specific sorting.
   */
  async getAll() {
    return super.getAll({ order: [['createdAt', 'DESC']] });
  }
}

module.exports = new ExtraServiceService();