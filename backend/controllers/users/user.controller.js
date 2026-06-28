import userService from '#services/users/user.service.js';
import BaseController from '../base/base.controller.js';

class UserController extends BaseController {
  constructor() {
    super(userService, 'User');
  }

  createUser = this.create;
  getAllUsers = this.getAll;
  getUserById = this.getById;
  updateUser = this.update;
  deleteUser = this.delete;
}

export default new UserController();