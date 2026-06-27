import revenueService from '../services/revenueService.js';

class RevenueController {
  /**
   * Handles requests for aggregated revenue statistics.
   * @param {Object} req - The Express request object.
   * @param {Object} res - The Express response object.
   * @returns {Promise<Object>} JSON response with the calculated revenue statistics.
   */
  getRevenueStats = async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      const stats = await revenueService.getRevenueStats(startDate, endDate);

      return res.status(200).json({
        success: true,
        message: 'Revenue data retrieved successfully',
        data: stats,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Error fetching revenue data',
        error: error.message,
      });
    }
  }
}

export default new RevenueController();
