import BaseController from '#controllers/base/base.controller.js';
import guestService from '#services/users/guest.service.js';

class GuestController extends BaseController {
  getGuests = this.asyncHandler(async (req, res) => {
    const { page, limit, search, role } = req.query;
    const guestData = await guestService.getGuests(page, limit, search, role);
    res.status(200).json(guestData); 
  });

  getGuestDetails = this.asyncHandler(async (req, res) => {
    const guestDetails = await guestService.getGuestDetails(req.params.id);
    this.sendSuccess(res, 'Guest details retrieved successfully', guestDetails);
  });
}

export default new GuestController();