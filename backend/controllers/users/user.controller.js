import BaseController from '#controllers/base/base.controller.js';
import userService from '#services/users/user.service.js';

class UserController extends BaseController {
  createUser = this.asyncHandler(async (req, res) => {
    const data = await userService.createUser(req.body);
    this.sendCreated(res, 'User created successfully', data);
  });

  getAllUsers = this.asyncHandler(async (req, res) => {
    const data = await userService.getAllUsers(req.query);
    this.sendPaginated(res, 'Users retrieved successfully', data.rows, data.pagination);
  });

  getUserById = this.asyncHandler(async (req, res) => {
    const data = await userService.getUserById(req.params.id);
    this.sendSuccess(res, 'User retrieved successfully', data);
  });

  updateUser = this.asyncHandler(async (req, res) => {
    const data = await userService.updateUser(req.params.id, req.body);
    this.sendSuccess(res, 'User updated successfully', data);
  });

  deleteUser = this.asyncHandler(async (req, res) => {
    await userService.deleteUser(req.params.id);
    this.sendSuccess(res, 'User deleted successfully');
  });
}

export default new UserController();