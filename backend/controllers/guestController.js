import guestService from '../services/users/guestService.js';

class GuestController {
  /**
   * Handles requests to fetch a paginated list of guests.
   * @param {Object} req - The Express request object.
   * @param {Object} res - The Express response object.
   * @returns {Promise<void>} JSON response with guest data.
   */
  getGuests = async (req, res) => {
    try {
      const { page, limit, search, role } = req.query;
      const guestData = await guestService.getGuests(page, limit, search, role);
      res.status(200).json(guestData);
    } catch (error) {
      res.status(500).json({
        message: 'Error fetching guests',
        error: error.message,
      });
    }
  }

  /**
   * Handles requests to fetch detailed information for a specific guest.
   * @param {Object} req - The Express request object.
   * @param {Object} res - The Express response object.
   * @returns {Promise<void>} JSON response with detailed guest data.
   */
  getGuestDetails = async (req, res) => {
    try {
      const { id } = req.params;
      const guestDetails = await guestService.getGuestDetails(id);
      res.status(200).json(guestDetails);
    } catch (error) {
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({
        message: error.statusCode
          ? error.message
          : 'Error fetching guest details',
        error: error.message,
      });
    }
  }
}

export default new GuestController();
