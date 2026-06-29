import BaseController from '#controllers/base/base.controller.js';
import guestService from '#services/users/guest.service.js';

class GuestController extends BaseController {
  /**
   * Retrieves a list of guests.
   * @param {Object} req - Contains query params (page, limit, search, role)
   */
  getGuests = this.asyncHandler(async (req, res) => {
    const { page, limit, search, role } = req.query;
    const guestData = await guestService.getGuests(page, limit, search, role);
    res.status(200).json(guestData); 
  });

  /**
   * Retrieves specific details for a guest profile.
   */
  getGuestDetails = this.asyncHandler(async (req, res) => {
    const guestDetails = await guestService.getGuestDetails(req.params.id);
    this.sendSuccess(res, 'Guest details retrieved successfully', guestDetails);
  });
}

export default new GuestController();