import { sendResponse } from '#utils/responseHandler.js';

class BaseController {
  /**
   * @param {Object} service - The domain service class (e.g., roomService)
   * @param {String} resourceName - Name used to construct readable responses
   */
  constructor(service, resourceName) {
    this.service = service;
    this.resourceName = resourceName;
  }

  // CREATE
  create = async (req, res, next) => {
    try {
      // Look for custom method on service, fallback to default 'create'
      const methodName = this.service.create ? 'create' : `create${this.resourceName.replace(/\s+/g, '')}`;
      const action = this.service[methodName] || this.service.create;
      
      const data = await action.call(this.service, req.body);
      return sendResponse(res, 201, `${this.resourceName} created successfully`, data);
    } catch (error) {
      next(error);
    }
  };

  // READ ALL (Guarantees naked arrays or paginated data are structured correctly for the frontend)
  getAll = async (req, res, next) => {
    try {
      const methodName = this.service.getAll ? 'getAll' : `getAll${this.resourceName.replace(/\s+/g, '')}s`;
      const action = this.service[methodName] || this.service.getAll;

      const data = await action.call(this.service, req.query);

      // Unpack object structure if backend pagination utility was used
      const records = data?.rows ? data.rows : (Array.isArray(data) ? data : []);
      const pagination = data?.pagination || null;

      return sendResponse(res, 200, `${this.resourceName}s retrieved successfully`, records, pagination);
    } catch (error) {
      next(error);
    }
  };

  // READ BY ID
  getById = async (req, res, next) => {
    try {
      const methodName = this.service.getById ? 'getById' : `get${this.replaceSpaces(this.resourceName)}ById`;
      const action = this.service[methodName] || this.service.getById;

      const data = await action.call(this.service, req.params.id);
      if (!data) {
        const error = new Error(`${this.resourceName} not found`);
        error.statusCode = 404;
        throw error;
      }
      return sendResponse(res, 200, `${this.resourceName} retrieved successfully`, data);
    } catch (error) {
      next(error);
    }
  };

  // UPDATE
  update = async (req, res, next) => {
    try {
      const methodName = this.service.update ? 'update' : `update${this.replaceSpaces(this.resourceName)}`;
      const action = this.service[methodName] || this.service.update;

      const data = await action.call(this.service, req.params.id, req.body);
      return sendResponse(res, 200, `${this.resourceName} updated successfully`, data);
    } catch (error) {
      next(error);
    }
  };

  // DELETE
  delete = async (req, res, next) => {
    try {
      const methodName = this.service.delete ? 'delete' : `delete${this.replaceSpaces(this.resourceName)}`;
      const action = this.service[methodName] || this.service.delete;

      await action.call(this.service, req.params.id);
      return sendResponse(res, 200, `${this.resourceName} deleted successfully`);
    } catch (error) {
      next(error);
    }
  };

  replaceSpaces(str) {
    return str.replace(/\s+/g, '');
  }
}

export default BaseController;