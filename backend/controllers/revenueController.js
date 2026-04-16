const { Booking, Payment, Room, RoomType } = require('../models');

class RevenueController {
  // Get revenue statistics
  static async getRevenueStats(req, res) {
    try {
      const { startDate, endDate } = req.query;
      
      const Op = require('sequelize').Op;
      
      // Build date filter
      let dateFilter = {};
      if (startDate && endDate) {
        dateFilter = {
          createdAt: {
            [Op.between]: [
              new Date(startDate),
              new Date(endDate)
            ]
          }
        };
      }

      // Total revenue from payments
      const totalRevenueResult = await Payment.sum('amount', {
        where: {
          paymentStatus: 'paid',
          ...dateFilter
        }
      });

      // Total bookings
      const totalBookings = await Booking.count();

      // Calculate occupancy rate
      const totalRooms = await Room.count();
      const occupiedRooms = await Room.count({
        where: {
          status: 'occupied'
        }
      });
      const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

      // Revenue by month (from payments)
      const revenueByMonth = await Payment.findAll({
        attributes: [
          [require('sequelize').fn('DATE_TRUNC', 'month', require('sequelize').col('Payment.createdAt')), 'month'],
          [require('sequelize').fn('SUM', require('sequelize').col('Payment.amount')), 'revenue']
        ],
        where: {
          paymentStatus: 'paid',
          ...dateFilter
        },
        group: [require('sequelize').fn('DATE_TRUNC', 'month', require('sequelize').col('Payment.createdAt'))],
        order: [[require('sequelize').fn('DATE_TRUNC', 'month', require('sequelize').col('Payment.createdAt')), 'ASC']]
      });

      // Revenue by room type
      const revenueByRoomType = await Booking.findAll({
        attributes: [
          [require('sequelize').fn('SUM', require('sequelize').col('Booking.totalPrice')), 'revenue'],
          [require('sequelize').fn('COUNT', require('sequelize').col('Booking.id')), 'bookings']
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
                attributes: ['name']
              }
            ],
            required: true
          },
          {
            model: Payment,
            as: 'payment',
            attributes: [],
            where: {
              paymentStatus: 'paid'
            },
            required: true
          }
        ],
        group: ['room.roomType.id', 'room.roomType.name'],
        order: [[require('sequelize').literal('revenue'), 'DESC']]
      });

      // Recent transactions (from bookings with payments)
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
        order: [['createdAt', 'DESC']],
        limit: 10
      });

      // Format response
      const formattedRevenueByMonth = revenueByMonth.map(item => ({
        month: new Date(item.dataValues.month).toLocaleDateString('en-US', { month: 'short' }),
        revenue: parseFloat(item.dataValues.revenue) || 0
      }));

      const formattedRevenueByRoomType = revenueByRoomType.map(item => ({
        type: item.dataValues.room?.roomType?.name || 'Unknown',
        revenue: parseFloat(item.dataValues.revenue) || 0,
        bookings: parseInt(item.dataValues.bookings) || 0
      }));

      const formattedTransactions = recentTransactions.map(booking => ({
        id: booking.id,
        bookingId: booking.id,
        amount: booking.payment?.amount || booking.totalPrice,
        status: booking.payment?.paymentStatus || 'pending',
        date: booking.createdAt,
        guest: booking.user?.fullName || 'Unknown',
        roomType: booking.room?.roomType?.name || booking.room?.roomNumber || 'Unknown'
      }));

      res.json({
        success: true,
        message: 'Revenue data retrieved successfully',
        data: {
          totalRevenue: parseFloat(totalRevenueResult) || 0,
          totalBookings,
          occupancyRate,
          totalRooms,
          occupiedRooms,
          monthlyRevenue: formattedRevenueByMonth.reduce((sum, item) => sum + item.revenue, 0),
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
