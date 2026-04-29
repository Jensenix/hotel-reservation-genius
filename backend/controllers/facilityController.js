const { Facility, RoomType } = require('../models');

class FacilityController {
  /**
   * Creates a new facility.
   * @param {Object} req - The Express request object.
   * @param {Object} res - The Express response object.
   * @returns {Promise<Object>} JSON response containing the new facility.
   */
  async createFacility(req, res) {
    try {
      const { facilityName, iconUrl } = req.body;

      if (!facilityName) {
        return res.status(400).json({
          success: false,
          message: 'facilityName is required'
        });
      }

      const facility = await Facility.create({
        facilityName,
        iconUrl
      });

      return res.status(201).json({
        success: true,
        message: 'Facility created successfully',
        data: facility
      });
    } catch (error) {
      console.error('Error creating facility:', error);
      return res.status(500).json({
        success: false,
        message: 'Error creating facility',
        error: error.message
      });
    }
  }

  /**
   * Retrieves all facilities.
   * @param {Object} req - The Express request object.
   * @param {Object} res - The Express response object.
   * @returns {Promise<Object>} JSON response containing an array of facilities.
   */
  async getAllFacilities(req, res) {
    try {
      const facilities = await Facility.findAll({
        order: [['createdAt', 'DESC']]
      });

      return res.status(200).json({
        success: true,
        message: 'Facilities retrieved successfully',
        data: facilities
      });
    } catch (error) {
      console.error('Error getting facilities:', error);
      return res.status(500).json({
        success: false,
        message: 'Error getting facilities',
        error: error.message
      });
    }
  }

  /**
   * Retrieves a specific facility by its ID, along with associated room types.
   * @param {Object} req - The Express request object.
   * @param {Object} res - The Express response object.
   * @returns {Promise<Object>} JSON response with facility data.
   */
  async getFacilityById(req, res) {
    try {
      const { id } = req.params;

      const facility = await Facility.findByPk(id, {
        include: [
          {
            model: RoomType,
            as: 'roomTypes'
          }
        ]
      });

      if (!facility) {
        return res.status(404).json({
          success: false,
          message: 'Facility not found'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Facility retrieved successfully',
        data: facility
      });
    } catch (error) {
      console.error('Error getting facility:', error);
      return res.status(500).json({
        success: false,
        message: 'Error getting facility',
        error: error.message
      });
    }
  }

  /**
   * Updates an existing facility.
   * @param {Object} req - The Express request object.
   * @param {Object} res - The Express response object.
   * @returns {Promise<Object>} JSON response with the updated facility data.
   */
  async updateFacility(req, res) {
    try {
      const { id } = req.params;
      const { facilityName, iconUrl } = req.body;

      const facility = await Facility.findByPk(id);

      if (!facility) {
        return res.status(404).json({
          success: false,
          message: 'Facility not found'
        });
      }

      await facility.update({
        facilityName: facilityName || facility.facilityName,
        iconUrl: iconUrl || facility.iconUrl
      });

      return res.status(200).json({
        success: true,
        message: 'Facility updated successfully',
        data: facility
      });
    } catch (error) {
      console.error('Error updating facility:', error);
      return res.status(500).json({
        success: false,
        message: 'Error updating facility',
        error: error.message
      });
    }
  }

  /**
   * Deletes a facility.
   * @param {Object} req - The Express request object.
   * @param {Object} res - The Express response object.
   * @returns {Promise<Object>} JSON response confirming deletion.
   */
  async deleteFacility(req, res) {
    try {
      const { id } = req.params;

      const facility = await Facility.findByPk(id);

      if (!facility) {
        return res.status(404).json({
          success: false,
          message: 'Facility not found'
        });
      }

      await facility.destroy();

      return res.status(200).json({
        success: true,
        message: 'Facility deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting facility:', error);
      return res.status(500).json({
        success: false,
        message: 'Error deleting facility',
        error: error.message
      });
    }
  }
}

module.exports = new FacilityController();