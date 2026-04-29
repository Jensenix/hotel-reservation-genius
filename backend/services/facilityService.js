const { Facility, RoomType } = require('../models');

class FacilityService {
  /**
   * Creates a new facility.
   * @param {Object} data - Facility data.
   * @returns {Promise<Object>} Created facility.
   */
  async createFacility({ facilityName, iconUrl }) {
    if (!facilityName) {
      const err = new Error('facilityName is required'); err.statusCode = 400; throw err;
    }
    return Facility.create({ facilityName, iconUrl });
  }

  /**
   * Retrieves all facilities.
   * @returns {Promise<Array>} List of facilities.
   */
  async getAllFacilities() {
    return Facility.findAll({ order: [['createdAt', 'DESC']] });
  }

  /**
   * Retrieves a specific facility by ID.
   * @param {string|number} id - Facility ID.
   * @returns {Promise<Object>} Facility data.
   */
  async getFacilityById(id) {
    const facility = await Facility.findByPk(id, { include: [{ model: RoomType, as: 'roomTypes' }] });
    if (!facility) {
      const err = new Error('Facility not found'); err.statusCode = 404; throw err;
    }
    return facility;
  }

  /**
   * Updates an existing facility.
   * @param {string|number} id - Facility ID.
   * @param {Object} data - Update data.
   * @returns {Promise<Object>} Updated facility.
   */
  async updateFacility(id, data) {
    const facility = await Facility.findByPk(id);
    if (!facility) {
      const err = new Error('Facility not found'); err.statusCode = 404; throw err;
    }
    return facility.update(data);
  }

  /**
   * Deletes a facility.
   * @param {string|number} id - Facility ID.
   * @returns {Promise<void>}
   */
  async deleteFacility(id) {
    const facility = await Facility.findByPk(id);
    if (!facility) {
      const err = new Error('Facility not found'); err.statusCode = 404; throw err;
    }
    await facility.destroy();
  }
}

module.exports = new FacilityService();