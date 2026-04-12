const { Facility, RoomType } = require('../models');
const pagination = require('../utils/pagination');

class FacilityController {
  // Create new facility
  async createFacility(req, res) {
    try {
      const { facilityName, iconUrl } = req.body;

      // Manual validation
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

  // Get all facilities with pagination
  async getAllFacilities(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;

      const { offset, limit: parsedLimit } = pagination.getPagination(page, limit);

      const { count, rows } = await Facility.findAndCountAll({
        offset,
        limit: parsedLimit,
        order: [['createdAt', 'DESC']]
      });

      return res.status(200).json({
        success: true,
        message: 'Facilities retrieved successfully',
        data: rows,
        pagination: pagination.getPagingData(count, page, parsedLimit)
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

  // Get facility by ID
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

  // Update facility
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

  // Delete facility
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
