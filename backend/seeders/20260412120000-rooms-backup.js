'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const rooms = [
      // Standard Rooms (Type 1) - 10 rooms
      { roomNumber: 'A101', roomTypeId: 1, floor: 1, status: 'available', createdAt: new Date(), updatedAt: new Date() },
      { roomNumber: 'A102', roomTypeId: 1, floor: 1, status: 'available', createdAt: new Date(), updatedAt: new Date() },
      { roomNumber: 'A103', roomTypeId: 1, floor: 1, status: 'available', createdAt: new Date(), updatedAt: new Date() },
      { roomNumber: 'A104', roomTypeId: 1, floor: 1, status: 'available', createdAt: new Date(), updatedAt: new Date() },
      { roomNumber: 'A105', roomTypeId: 1, floor: 1, status: 'available', createdAt: new Date(), updatedAt: new Date() },
      { roomNumber: 'A201', roomTypeId: 1, floor: 2, status: 'available', createdAt: new Date(), updatedAt: new Date() },
      { roomNumber: 'A202', roomTypeId: 1, floor: 2, status: 'available', createdAt: new Date(), updatedAt: new Date() },
      { roomNumber: 'A203', roomTypeId: 1, floor: 2, status: 'available', createdAt: new Date(), updatedAt: new Date() },
      { roomNumber: 'A204', roomTypeId: 1, floor: 2, status: 'available', createdAt: new Date(), updatedAt: new Date() },
      { roomNumber: 'A205', roomTypeId: 1, floor: 2, status: 'available', createdAt: new Date(), updatedAt: new Date() },
      
      // Deluxe Rooms (Type 2) - 8 rooms
      { roomNumber: 'B101', roomTypeId: 2, floor: 1, status: 'available', createdAt: new Date(), updatedAt: new Date() },
      { roomNumber: 'B102', roomTypeId: 2, floor: 1, status: 'available', createdAt: new Date(), updatedAt: new Date() },
      { roomNumber: 'B103', roomTypeId: 2, floor: 1, status: 'available', createdAt: new Date(), updatedAt: new Date() },
      { roomNumber: 'B104', roomTypeId: 2, floor: 1, status: 'available', createdAt: new Date(), updatedAt: new Date() },
      { roomNumber: 'B201', roomTypeId: 2, floor: 2, status: 'available', createdAt: new Date(), updatedAt: new Date() },
      { roomNumber: 'B202', roomTypeId: 2, floor: 2, status: 'available', createdAt: new Date(), updatedAt: new Date() },
      { roomNumber: 'B203', roomTypeId: 2, floor: 2, status: 'available', createdAt: new Date(), updatedAt: new Date() },
      { roomNumber: 'B204', roomTypeId: 2, floor: 2, status: 'available', createdAt: new Date(), updatedAt: new Date() },
      
      // Executive Suites (Type 3) - 6 rooms
      { roomNumber: 'C301', roomTypeId: 3, floor: 3, status: 'available', createdAt: new Date(), updatedAt: new Date() },
      { roomNumber: 'C302', roomTypeId: 3, floor: 3, status: 'available', createdAt: new Date(), updatedAt: new Date() },
      { roomNumber: 'C303', roomTypeId: 3, floor: 3, status: 'available', createdAt: new Date(), updatedAt: new Date() },
      { roomNumber: 'C304', roomTypeId: 3, floor: 3, status: 'available', createdAt: new Date(), updatedAt: new Date() },
      { roomNumber: 'C305', roomTypeId: 3, floor: 3, status: 'available', createdAt: new Date(), updatedAt: new Date() },
      { roomNumber: 'C306', roomTypeId: 3, floor: 3, status: 'available', createdAt: new Date(), updatedAt: new Date() },
      
      // Presidential Suites (Type 4) - 4 rooms
      { roomNumber: 'D401', roomTypeId: 4, floor: 4, status: 'available', createdAt: new Date(), updatedAt: new Date() },
      { roomNumber: 'D402', roomTypeId: 4, floor: 4, status: 'available', createdAt: new Date(), updatedAt: new Date() },
      { roomNumber: 'D403', roomTypeId: 4, floor: 4, status: 'available', createdAt: new Date(), updatedAt: new Date() },
      { roomNumber: 'D404', roomTypeId: 4, floor: 4, status: 'available', createdAt: new Date(), updatedAt: new Date() },
      
      // Family Rooms (Type 5) - 6 rooms
      { roomNumber: 'E501', roomTypeId: 5, floor: 5, status: 'available', createdAt: new Date(), updatedAt: new Date() },
      { roomNumber: 'E502', roomTypeId: 5, floor: 5, status: 'available', createdAt: new Date(), updatedAt: new Date() },
      { roomNumber: 'E503', roomTypeId: 5, floor: 5, status: 'available', createdAt: new Date(), updatedAt: new Date() },
      { roomNumber: 'E504', roomTypeId: 5, floor: 5, status: 'available', createdAt: new Date(), updatedAt: new Date() },
      { roomNumber: 'E505', roomTypeId: 5, floor: 5, status: 'available', createdAt: new Date(), updatedAt: new Date() },
      { roomNumber: 'E506', roomTypeId: 5, floor: 5, status: 'available', createdAt: new Date(), updatedAt: new Date() },
      
      // Ocean View Suites (Type 6) - 4 rooms
      { roomNumber: 'F601', roomTypeId: 6, floor: 6, status: 'available', createdAt: new Date(), updatedAt: new Date() },
      { roomNumber: 'F602', roomTypeId: 6, floor: 6, status: 'available', createdAt: new Date(), updatedAt: new Date() },
      { roomNumber: 'F603', roomTypeId: 6, floor: 6, status: 'available', createdAt: new Date(), updatedAt: new Date() },
      { roomNumber: 'F604', roomTypeId: 6, floor: 6, status: 'available', createdAt: new Date(), updatedAt: new Date() },
      
      // Mountain View Villas (Type 7) - 4 rooms
      { roomNumber: 'G601', roomTypeId: 7, floor: 6, status: 'available', createdAt: new Date(), updatedAt: new Date() },
      { roomNumber: 'G602', roomTypeId: 7, floor: 6, status: 'available', createdAt: new Date(), updatedAt: new Date() },
      { roomNumber: 'G603', roomTypeId: 7, floor: 6, status: 'available', createdAt: new Date(), updatedAt: new Date() },
      { roomNumber: 'G604', roomTypeId: 7, floor: 6, status: 'available', createdAt: new Date(), updatedAt: new Date() },
      
      // Garden Cottages (Type 8) - 3 rooms
      { roomNumber: 'H101', roomTypeId: 8, floor: 1, status: 'available', createdAt: new Date(), updatedAt: new Date() },
      { roomNumber: 'H102', roomTypeId: 8, floor: 1, status: 'available', createdAt: new Date(), updatedAt: new Date() },
      { roomNumber: 'H103', roomTypeId: 8, floor: 1, status: 'available', createdAt: new Date(), updatedAt: new Date() },
      
      // Penthouse Apartments (Type 9) - 2 rooms
      { roomNumber: 'PENTHOUSE01', roomTypeId: 9, floor: 6, status: 'available', createdAt: new Date(), updatedAt: new Date() },
      { roomNumber: 'PENTHOUSE02', roomTypeId: 9, floor: 6, status: 'available', createdAt: new Date(), updatedAt: new Date() },
      
      // Beach Bungalows (Type 10) - 3 rooms
      { roomNumber: 'BEACH01', roomTypeId: 10, floor: 1, status: 'available', createdAt: new Date(), updatedAt: new Date() },
      { roomNumber: 'BEACH02', roomTypeId: 10, floor: 1, status: 'available', createdAt: new Date(), updatedAt: new Date() },
      { roomNumber: 'BEACH03', roomTypeId: 10, floor: 1, status: 'available', createdAt: new Date(), updatedAt: new Date() },
      
      // Forest Lodges (Type 11) - 3 rooms
      { roomNumber: 'FOREST01', roomTypeId: 11, floor: 2, status: 'available', createdAt: new Date(), updatedAt: new Date() },
      { roomNumber: 'FOREST02', roomTypeId: 11, floor: 2, status: 'available', createdAt: new Date(), updatedAt: new Date() },
      { roomNumber: 'FOREST03', roomTypeId: 11, floor: 2, status: 'available', createdAt: new Date(), updatedAt: new Date() },
      
      // City Lofts (Type 12) - 3 rooms
      { roomNumber: 'CITY01', roomTypeId: 12, floor: 3, status: 'available', createdAt: new Date(), updatedAt: new Date() },
      { roomNumber: 'CITY02', roomTypeId: 12, floor: 3, status: 'available', createdAt: new Date(), updatedAt: new Date() },
      { roomNumber: 'CITY03', roomTypeId: 12, floor: 3, status: 'available', createdAt: new Date(), updatedAt: new Date() }
    ];

    await queryInterface.bulkInsert('Rooms', rooms, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Rooms', null, {});
  }
};
