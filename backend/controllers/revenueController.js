const { Booking, Payment, Room, RoomType } = require('../models');

class RevenueController {
  // Get revenue statistics
  static async getRevenueStats(req, res) {
    try {
      const { startDate, endDate } = req.query;
      
      const Op = require('sequelize').Op;

      // Build payment date filter
      const paymentDateFilter = {};
      if (startDate && endDate) {
        // Set startDate to beginning of day (00:00:00)
        const startDateTime = new Date(startDate);
        startDateTime.setHours(0, 0, 0, 0);

        // Set endDate to end of day (23:59:59) to include entire day
        const endDateTime = new Date(endDate);
        endDateTime.setHours(23, 59, 59, 999);

        paymentDateFilter.createdAt = {
          [Op.between]: [startDateTime, endDateTime]
        };
      }

      // Total revenue from payments
      const totalRevenueResult = await Payment.sum('amount', {
        where: {
          paymentStatus: 'paid',
          ...paymentDateFilter
        }
      });

      // Total bookings
      const totalBookings = await Booking.count();

      // Revenue by month (from payments)
      const revenueByMonth = await Payment.findAll({
        attributes: [
          [require('sequelize').fn('DATE_TRUNC', 'month', require('sequelize').col('Payment.createdAt')), 'month'],
          [require('sequelize').fn('SUM', require('sequelize').col('Payment.amount')), 'revenue']
        ],
        where: {
          paymentStatus: 'paid',
          ...paymentDateFilter
        },
        group: [require('sequelize').fn('DATE_TRUNC', 'month', require('sequelize').col('Payment.createdAt'))],
        order: [[require('sequelize').fn('DATE_TRUNC', 'month', require('sequelize').col('Payment.createdAt')), 'ASC']]
      });

      // Revenue by room type
      const revenueByRoomType = await Booking.findAll({
        attributes: [
          [require('sequelize').fn('SUM', require('sequelize').col('Booking.totalPrice')), 'revenue'],
          [require('sequelize').fn('COUNT', require('sequelize').col('Booking.id')), 'bookings'],
          [require('sequelize').col('room.roomType.name'), 'roomTypeName']
        ],
        include: [
          {
            model: Room,
            as: 'room',
            attributes: [],
            include: [
              {
                model: RoomType,
                as: 'roomType',
                attributes: []
              }
            ],
            required: true
          },
          {
            model: Payment,
            as: 'payment',
            attributes: [],
            where: {
              paymentStatus: 'paid',
              ...paymentDateFilter
            },
            required: true
          }
        ],
        group: ['room.roomType.id', 'room.roomType.name'],
        order: [[require('sequelize').literal('revenue'), 'DESC']]
      });

      // Get all room types to include those with no revenue
      const allRoomTypes = await RoomType.findAll({
        attributes: ['id', 'name']
      });

      // Merge with all room types, filling missing ones with 0 revenue
      const allRoomTypeNames = allRoomTypes.map(rt => rt.name);
      const revenueByRoomTypeMap = new Map(
        revenueByRoomType.map(item => [item.dataValues.roomTypeName, {
          revenue: parseFloat(item.dataValues.revenue) || 0,
          bookings: parseInt(item.dataValues.bookings) || 0
        }])
      );

      const completeRevenueByRoomType = allRoomTypes.map(rt => ({
        type: rt.name,
        revenue: revenueByRoomTypeMap.get(rt.name)?.revenue || 0,
        bookings: revenueByRoomTypeMap.get(rt.name)?.bookings || 0
      })).sort((a, b) => b.revenue - a.revenue);

      // Recent transactions (from bookings with payments) - always show latest 10 without date filter
      const recentTransactions = await Booking.findAll({
        include: [
          {
            model: require('../models').User,
            as: 'user',
            attributes: ['fullName']
          },
          {
            model: Payment,
            as: 'payment',
            where: {
              paymentStatus: 'paid'
            }
          },
          {
            model: Room,
            as: 'room',
            include: [
              {
                model: RoomType,
                as: 'roomType',
                attributes: ['name']
              }
            ]
          }
        ],
        order: [[{ model: Payment, as: 'payment' }, 'createdAt', 'DESC']],
        limit: 10
      });

      // Format response
      const formattedRevenueByMonth = revenueByMonth.map(item => ({
        month: new Date(item.dataValues.month).toLocaleDateString('en-US', { month: 'short' }),
        revenue: parseFloat(item.dataValues.revenue) || 0
      }));

      console.log('Raw revenueByRoomType:', JSON.stringify(revenueByRoomType, null, 2));

      const formattedRevenueByRoomType = completeRevenueByRoomType;

      const formattedTransactions = recentTransactions.map(booking => ({
        id: booking.id,
        bookingId: booking.id,
        amount: booking.payment?.amount || booking.totalPrice,
        status: booking.payment?.paymentStatus || 'pending',
        date: booking.payment?.createdAt || booking.createdAt,
        guest: booking.user?.fullName || 'Unknown',
        roomType: booking.room?.roomType?.name || booking.room?.roomNumber || 'Unknown'
      }));

      res.json({
        success: true,
        message: 'Revenue data retrieved successfully',
        data: {
          totalRevenue: parseFloat(totalRevenueResult) || 0,
          totalBookings,
          revenueByMonth: formattedRevenueByMonth,
          revenueByRoomType: formattedRevenueByRoomType,
          recentTransactions: formattedTransactions
        }
      });
    } catch (error) {
      console.error('Error fetching revenue data:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching revenue data',
        error: error.message
      });
    }
  }
}

module.exports = RevenueController;
