import db from '#models/index.js';
const { ExtraService } = db;
import BaseService from '../base/base.service.js';

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

  // Alias methods for controller compatibility
  async createExtraService(data) {
    return this.create(data);
  }

  async getAllExtraServices() {
    return this.getAll();
  }

  async getExtraServiceById(id) {
    return this.getById(id);
  }

  async updateExtraService(id, data) {
    return this.update(id, data);
  }

  async deleteExtraService(id) {
    return this.delete(id);
  }
}

export default new ExtraServiceService();
