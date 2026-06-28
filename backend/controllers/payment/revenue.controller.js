import BaseController from '#controllers/base/base.controller.js';
import revenueService from '#services/payment/revenue.service.js';

class RevenueController extends BaseController {
  getRevenueStats = this.asyncHandler(async (req, res) => {
    const { startDate, endDate } = req.query;
    const data = await revenueService.getRevenueStats(startDate, endDate);
    this.sendSuccess(res, 'Revenue data retrieved successfully', data);
  });
}

export default new RevenueController();