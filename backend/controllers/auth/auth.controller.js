import BaseController from '#controllers/base/base.controller.js';
import authService from '#services/auth/auth.service.js';

class AuthController extends BaseController {
  /**
   * Authenticates a user and returns a token/data.
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  login = this.asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const data = await authService.login(email, password);
    this.sendSuccess(res, 'Login successful', data);
  });

  /**
   * Registers a new user.
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  register = this.asyncHandler(async (req, res) => {
    const data = await authService.register(req.body);
    this.sendCreated(res, 'Registration successful', data);
  });
}

export default new AuthController();