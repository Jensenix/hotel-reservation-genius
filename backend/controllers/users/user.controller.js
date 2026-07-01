import BaseController from '#controllers/base/base.controller.js';
import userService from '#services/users/user.service.js';

class UserController extends BaseController {
  /**
   * Creates a new system user.
   */
  createUser = this.asyncHandler(async (req, res) => {
    const data = await userService.createUser(req.body, req.user);
    this.sendCreated(res, 'User created successfully', data);
  });

  /**
   * Retrieves a list of users (paginated).
   */
  getAllUsers = this.asyncHandler(async (req, res) => {
    const data = await userService.getAllUsers(req.query);
    this.sendPaginated(res, 'Users retrieved successfully', data.rows, data.pagination);
  });

  /**
   * Retrieves a user profile by ID.
   */
  getUserById = this.asyncHandler(async (req, res) => {
    const data = await userService.getUserById(req.params.id);
    this.sendSuccess(res, 'User retrieved successfully', data);
  });

  /**
   * Updates user information.
   */
  updateUser = this.asyncHandler(async (req, res) => {
    const data = await userService.updateUser(req.params.id, req.body, req.user);
    this.sendSuccess(res, 'User updated successfully', data);
  });

  /**
   * Deletes a user account.
   */
  deleteUser = this.asyncHandler(async (req, res) => {
    await userService.deleteUser(req.params.id, req.user);
    this.sendSuccess(res, 'User deleted successfully');
  });
}

export default new UserController();