import guestService from '#services/users/guest.service.js';
import { sendResponse } from '#utils/responseHandler.js';

class GuestController {
  getGuests = async (req, res, next) => {
    try {
      const { page, limit, search, role } = req.query;
      const data = await guestService.getGuests(page, limit, search, role);
      
      const records = data?.rows ? data.rows : (Array.isArray(data) ? data : []);
      const pagination = data?.pagination || null;

      return sendResponse(res, 200, 'Guests retrieved successfully', records, pagination);
    } catch (error) {
      next(error);
    }
  };

  getGuestDetails = async (req, res, next) => {
    try {
      const { id } = req.params;
      const guestDetails = await guestService.getGuestDetails(id);
      return sendResponse(res, 200, 'Guest details retrieved successfully', guestDetails);
    } catch (error) {
      next(error);
    }
  };
}

export default new GuestController();