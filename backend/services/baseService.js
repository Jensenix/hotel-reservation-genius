class BaseService {
  constructor(model) {
    this.model = model;
  }

  async findAll(options = {}) {
    return await this.model.findAll(options);
  }

  async findByPk(id, options = {}) {
    return await this.model.findByPk(id, options);
  }

  async findOne(options = {}) {
    return await this.model.findOne(options);
  }

  async create(data) {
    return await this.model.create(data);
  }

  async update(id, data) {
    const [updatedCount] = await this.model.update(data, {
      where: { id }
    });
    if (updatedCount === 0) {
      throw new Error('Record not found');
    }
    return await this.findByPk(id);
  }

  async delete(id) {
    const deletedCount = await this.model.destroy({
      where: { id }
    });
    if (deletedCount === 0) {
      throw new Error('Record not found');
    }
    return true;
  }
}

module.exports = BaseService;
