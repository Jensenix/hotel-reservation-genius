import db from '#models/index.js';

const { BookingExtraService, Booking, ExtraService } = db;

import BaseService from '../base/base.service.js';

class BookingExtraServiceService extends BaseService {
  constructor() {
    super(BookingExtraService, 'Booking extra service');
  }

  /**
   * Assigns an extra service to a booking.
   *
   * @param {Object} data The assignment data
   * @param {string|number} data.bookingId Booking ID
   * @param {string|number} data.extraServiceId Extra service ID
   * @param {number} data.quantity Quantity requested
   * @param {number} data.subtotal Calculated subtotal
   *
   * @returns {Promise<Object>} Created booking extra service record
   */
  async createBookingExtraService({
    bookingId,
    extraServiceId,
    quantity,
    subtotal,
  }) {
    const booking = await Booking.findByPk(bookingId);

    if (!booking) {
      const err = new Error('Booking not found');
      err.statusCode = 404;
      throw err;
    }

    const extraService = await ExtraService.findByPk(extraServiceId);

    if (!extraService) {
      const err = new Error('Extra service not found');
      err.statusCode = 404;
      throw err;
    }

    return super.create({
      bookingId,
      extraServiceId,
      quantity,
      subtotal,
    });
  }

  /**
   * Retrieves all extra services associated with a specific booking ID.
   *
   * @param {string|number} bookingId Booking ID
   *
   * @returns {Promise<Array>} List of booking extra services
   */
  async getBookingExtraServicesByBookingId(bookingId) {
    return super.getAll({
      where: {
        bookingId,
      },
      include: [
        {
          model: ExtraService,
          as: 'extraService',
        },
      ],
    });
  }

  /**
   * Deletes an extra service tied to a booking.
   *
   * @param {string|number} id Booking extra service row ID
   *
   * @returns {Promise<void>}
   */
  async deleteBookingExtraService(id) {
    return super.delete(id);
  }

  /**
   * Applies selected extra services to a booking and updates totalPrice.
   *
   * Existing extra-service rows for the booking are replaced.
   * This is used by booking create/update flows.
   *
   * @param {Object} booking Booking Sequelize instance
   * @param {Array} extraServicesPayload Selected extra services
   * @param {number} baseTotal Room-only/base booking total
   *
   * @returns {Promise<number>} New total price including extra services
   */
  async applyExtraServices(booking, extraServicesPayload, baseTotal) {
    const items = (extraServicesPayload || []).filter(
      (item) => item && item.extraServiceId && Number(item.quantity) > 0,
    );

    const catalog = items.length
      ? await ExtraService.findAll({
          where: {
            id: items.map((item) => item.extraServiceId),
          },
        })
      : [];

    const priceById = new Map(
      catalog.map((service) => [service.id, Number(service.price)]),
    );

    await BookingExtraService.destroy({
      where: {
        bookingId: booking.id,
      },
    });

    let extrasTotal = 0;
    const rows = [];

    for (const item of items) {
      const unitPrice = priceById.get(item.extraServiceId);

      if (unitPrice == null) continue;

      const quantity = Number(item.quantity);
      const subtotal = unitPrice * quantity;

      extrasTotal += subtotal;

      rows.push({
        bookingId: booking.id,
        extraServiceId: item.extraServiceId,
        quantity,
        subtotal,
      });
    }

    if (rows.length > 0) {
      await BookingExtraService.bulkCreate(rows);
    }

    const newTotal = Number(baseTotal) + extrasTotal;

    if (Number(booking.totalPrice) !== newTotal) {
      await booking.update({
        totalPrice: newTotal,
      });
    }

    return newTotal;
  }

  /**
   * Loads selected extra services for booking detail/edit responses.
   *
   * @param {string|number} bookingId Booking ID
   *
   * @returns {Promise<Array<{id: number, quantity: number, subtotal: number}>>}
   */
  async getSelectedExtraServices(bookingId) {
    try {
      const rows = await BookingExtraService.findAll({
        where: {
          bookingId,
        },
      });

      return rows.map((row) => ({
        id: row.extraServiceId,
        quantity: row.quantity,
        subtotal: row.subtotal,
      }));
    } catch (err) {
      console.error(
        '[BookingExtraServiceService] Failed to load selected extra services for booking',
        bookingId,
        err.message,
      );

      return [];
    }
  }
}

export default new BookingExtraServiceService();
