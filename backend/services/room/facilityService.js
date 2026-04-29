const { Facility, RoomType } = require('../../models');
const BaseService = require('../base/baseService');

class FacilityService extends BaseService {
  constructor() {
    super(Facility, 'Facility');
  }

  /**
   * Overrides the default getById to include associated RoomTypes.
   * @param {string|number} id - Facility ID.
   * @returns {Promise<Object>} Facility data with RoomTypes.
   */
  async getById(id) {
    return super.getById(id, {
      include: [{ model: RoomType, as: 'roomTypes' }]
    });
  }

  /**
   * Overrides the default getAll to sort by creation date.
   * @returns {Promise<Array>} List of facilities.
   */
  async getAll() {
    return super.getAll({
      order: [['createdAt', 'DESC']]
    });
  }
}

module.exports = new FacilityService();