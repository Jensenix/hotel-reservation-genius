import userService from '../../services/users/userService.js';

class UserController {
  createUser = async (req, res) => {
    try {
      const data = await userService.createUser(req.body);
      res
        .status(201)
        .json({ success: true, message: 'User created successfully', data });
    } catch (error) {
      res
        .status(error.statusCode || 500)
        .json({ success: false, message: error.message });
    }
  };

  getAllUsers = async (req, res) => {
    try {
      const data = await userService.getAllUsers(req.query);
      res.status(200).json({
        success: true,
        message: 'Users retrieved successfully',
        data: data.rows,
        pagination: data.pagination,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error getting users',
        error: error.message,
      });
    }
  };

  getUserById = async (req, res) => {
    try {
      const data = await userService.getUserById(req.params.id);
      res
        .status(200)
        .json({ success: true, message: 'User retrieved successfully', data });
    } catch (error) {
      res
        .status(error.statusCode || 500)
        .json({ success: false, message: error.message });
    }
  };

  updateUser = async (req, res) => {
    try {
      const data = await userService.updateUser(req.params.id, req.body);
      res
        .status(200)
        .json({ success: true, message: 'User updated successfully', data });
    } catch (error) {
      res
        .status(error.statusCode || 500)
        .json({ success: false, message: error.message });
    }
  };

  deleteUser = async (req, res) => {
    try {
      await userService.deleteUser(req.params.id);
      res
        .status(200)
        .json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
      res
        .status(error.statusCode || 500)
        .json({ success: false, message: error.message });
    }
  };
}

export default new UserController();
