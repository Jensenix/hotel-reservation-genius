import db from '../../models/index.js';
const { Booking, Payment, Room, RoomType } = db;
import { Op, fn, col, literal } from 'sequelize';

class RevenueService {
  /**
   * Aggregates revenue statistics including totals, monthly trends, and room type breakdowns.
   * @param {string} [startDate] - The start date for filtering revenue.
   * @param {string} [endDate] - The end date for filtering revenue.
   * @returns {Promise<Object>} Aggregated revenue statistics.
   */
  async getRevenueStats(startDate, endDate) {
    const paymentDateFilter = {};
    if (startDate && endDate) {
      const startDateTime = new Date(startDate);
      startDateTime.setHours(0, 0, 0, 0);

      const endDateTime = new Date(endDate);
      endDateTime.setHours(23, 59, 59, 999);

      paymentDateFilter.createdAt = {
        [Op.between]: [startDateTime, endDateTime],
      };
    }

    const totalRevenueResult = await Payment.sum('amount', {
      where: { paymentStatus: 'paid', ...paymentDateFilter },
    });

    const totalBookings = await Booking.count();

    const revenueByMonth = await Payment.findAll({
      attributes: [
        [fn('DATE_TRUNC', 'month', col('Payment.createdAt')), 'month'],
        [fn('SUM', col('Payment.amount')), 'revenue'],
      ],
      where: { paymentStatus: 'paid', ...paymentDateFilter },
      group: [fn('DATE_TRUNC', 'month', col('Payment.createdAt'))],
      order: [[fn('DATE_TRUNC', 'month', col('Payment.createdAt')), 'ASC']],
    });

    const revenueByRoomType = await Booking.findAll({
      attributes: [
        [fn('SUM', col('Booking.totalPrice')), 'revenue'],
        [fn('COUNT', col('Booking.id')), 'bookings'],
        [col('room.roomType.name'), 'roomTypeName'],
      ],
      include: [
        {
          model: Room,
          as: 'room',
          attributes: [],
          include: [{ model: RoomType, as: 'roomType', attributes: [] }],
          required: true,
        },
        {
          model: Payment,
          as: 'payment',
          attributes: [],
          where: { paymentStatus: 'paid', ...paymentDateFilter },
          required: true,
        },
      ],
      group: ['room.roomType.id', 'room.roomType.name'],
      order: [[literal('revenue'), 'DESC']],
    });

    const allRoomTypes = await RoomType.findAll({ attributes: ['id', 'name'] });
    const revenueByRoomTypeMap = new Map(
      revenueByRoomType.map((item) => [
        item.dataValues.roomTypeName,
        {
          revenue: parseFloat(item.dataValues.revenue) || 0,
          bookings: parseInt(item.dataValues.bookings) || 0,
        },
      ]),
    );

    const completeRevenueByRoomType = allRoomTypes
      .map((rt) => ({
        type: rt.name,
        revenue: revenueByRoomTypeMap.get(rt.name)?.revenue || 0,
        bookings: revenueByRoomTypeMap.get(rt.name)?.bookings || 0,
      }))
      .sort((a, b) => b.revenue - a.revenue);

    const recentTransactions = await Booking.findAll({
      include: [
        {
          model: require('../../models/index.js').User,
          as: 'user',
          attributes: ['fullName'],
        },
        { model: Payment, as: 'payment', where: { paymentStatus: 'paid' } },
        {
          model: Room,
          as: 'room',
          include: [{ model: RoomType, as: 'roomType', attributes: ['name'] }],
        },
      ],
      order: [[{ model: Payment, as: 'payment' }, 'createdAt', 'DESC']],
      limit: 10,
    });

    return {
      totalRevenue: parseFloat(totalRevenueResult) || 0,
      totalBookings,
      revenueByMonth: revenueByMonth.map((item) => ({
        month: new Date(item.dataValues.month).toLocaleDateString('en-US', {
          month: 'short',
        }),
        revenue: parseFloat(item.dataValues.revenue) || 0,
      })),
      revenueByRoomType: completeRevenueByRoomType,
      recentTransactions: recentTransactions.map((booking) => ({
        id: booking.id,
        bookingId: booking.id,
        amount: booking.payment?.amount || booking.totalPrice,
        status: booking.payment?.paymentStatus || 'pending',
        date: booking.payment?.createdAt || booking.createdAt,
        guest: booking.user?.fullName || 'Unknown',
        roomType:
          booking.room?.roomType?.name || booking.room?.roomNumber || 'Unknown',
      })),
    };
  }
}

export default new RevenueService();
