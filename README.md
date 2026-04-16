# Genius Society Hotel Reservation System

A modern hotel reservation system built with Node.js, Express, React, and PostgreSQL. Features a 5-star luxury hotel design with comprehensive booking management, room availability tracking, and revenue analytics.

## Features

- **User Management**: User registration, authentication, and profile management
- **Room Booking**: Browse room types, check availability, and make reservations
- **Admin Dashboard**: Complete admin panel for booking management and analytics
- **Room Availability**: Real-time room availability tracking and management
- **Revenue Analytics**: Comprehensive revenue statistics and reporting
- **Facilities Management**: Hotel facilities display and management
- **Modern UI**: 5-star luxury hotel design with amber theme
- **Responsive Design**: Mobile-friendly interface

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **PostgreSQL** - Database
- **Sequelize** - ORM for database operations
- **JWT** - Authentication
- **bcrypt** - Password hashing

### Frontend
- **React** - UI framework
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Axios** - HTTP client

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** (v8 or higher) or **yarn** (v1.22 or higher)
- **PostgreSQL** (v12 or higher)
- **Git** for version control

## Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd hotel-reservation-genius
```

### 2. Database Setup

#### Create PostgreSQL Database

```sql
-- Connect to PostgreSQL
psql -U postgres

-- Create database
CREATE DATABASE hotel_reservation;

-- Create user (optional)
CREATE USER hotel_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE hotel_reservation TO hotel_user;
```

#### Update Database Configuration

Navigate to the backend directory and update the database configuration:

```bash
cd backend
```

Edit the database configuration in your environment or config file:

```javascript
// In your database config or .env file
const config = {
  development: {
    username: 'postgres', // or your database user
    password: 'your_password', // your database password
    database: 'hotel_reservation',
    host: 'localhost',
    dialect: 'postgres',
    logging: console.log
  }
};
```

### 3. Backend Setup

#### Install Dependencies

```bash
cd backend
npm install
```

#### Run Database Migrations

```bash
# Run all migrations
npm run migrate

# Or run manually
npx sequelize-cli db:migrate
```

#### Seed Database (Optional)

```bash
# Seed with sample data
npm run seed

# Or run manually
npx sequelize-cli db:seed:all
```

#### Start Backend Server

```bash
# Development mode
npm run dev

# Production mode
npm start
```

The backend server will run on `http://localhost:3000`

### 4. Frontend Setup

#### Install Dependencies

```bash
cd ../frontend
npm install
```

#### Start Frontend Development Server

```bash
npm start
```

The frontend application will run on `http://localhost:3000` or `http://localhost:3001` (if port 3000 is occupied)

## Project Structure

```
hotel-reservation-genius/
|
+-- backend/
|   +-- config/           # Database and app configuration
|   +-- controllers/       # Route controllers
|   +-- models/           # Sequelize models
|   +-- routes/           # API routes
|   +-- migrations/       # Database migrations
|   +-- seeders/          # Database seeders
|   +-- middleware/       # Custom middleware
|   +-- services/         # Business logic services
|   +-- app.js            # Express app setup
|   +-- package.json
|   +-- server.js         # Server entry point
|
+-- frontend/
|   +-- public/           # Static files
|   +-- src/
|   |   +-- components/    # React components
|   |   +-- context/       # React context
|   |   +-- layouts/       # Layout components
|   |   +-- pages/         # Page components
|   |   +-- services/      # API services
|   |   +-- utils/         # Utility functions
|   |   +-- App.js         # Main App component
|   |   +-- index.js       # React entry point
|   +-- package.json
|
+-- README.md
```

## Available Scripts

### Backend Scripts

```bash
# Start server in development mode
npm run dev

# Start server in production mode
npm start

# Run database migrations
npm run migrate

# Undo last migration
npm run migrate:undo

# Seed database
npm run seed

# Run tests
npm test
```

### Frontend Scripts

```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Eject (one-way operation)
npm run eject
```

## Default Users

After seeding the database, you can use these default accounts:

### Admin User
- **Email**: admin@geniussocietyhotel.com
- **Password**: admin123

### Regular User
- **Email**: john.doe@example.com
- **Password**: password123

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Room Types
- `GET /api/room-types` - Get all room types
- `GET /api/room-types/:id` - Get room type by ID
- `GET /api/room-types/with-facilities` - Get room types with facilities

### Bookings
- `GET /api/bookings` - Get all bookings (admin)
- `GET /api/bookings/user/:userId` - Get user bookings
- `POST /api/bookings` - Create new booking
- `PUT /api/bookings/:id` - Update booking
- `DELETE /api/bookings/:id` - Cancel booking

### Facilities
- `GET /api/facilities` - Get all facilities

### Revenue
- `GET /api/revenue/stats` - Get revenue statistics

### Availability
- `GET /api/availability/stats` - Get room availability stats

## Troubleshooting

### Common Issues

#### Database Connection Error
```bash
# Check if PostgreSQL is running
pg_isready

# Check database exists
psql -l

# Verify connection string
psql -h localhost -U postgres -d hotel_reservation
```

#### Port Already in Use
```bash
# Find process using port
netstat -ano | findstr :3000

# Kill process on Windows
taskkill /PID <PID> /F

# Kill process on macOS/Linux
kill -9 <PID>
```

#### Migration Issues
```bash
# Reset database (WARNING: This will delete all data)
npx sequelize-cli db:migrate:undo:all
npx sequelize-cli db:migrate

# Check migration status
npx sequelize-cli db:migrate:status
```

#### Frontend Build Issues
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear npm cache
npm cache clean --force
```

### Development Tips

1. **Hot Reloading**: Both frontend and backend support hot reloading during development
2. **Database Logging**: Enable database query logging in development mode
3. **Environment Variables**: Use `.env` files for environment-specific configuration
4. **API Testing**: Use tools like Postman or Insomnia to test API endpoints

## Production Deployment

### Environment Setup

1. Set environment variables:
```bash
NODE_ENV=production
DB_HOST=your-production-db-host
DB_NAME=hotel_reservation
DB_USER=your-production-user
DB_PASS=your-production-password
JWT_SECRET=your-jwt-secret
PORT=3000
```

2. Build frontend:
```bash
cd frontend
npm run build
```

3. Start backend server:
```bash
cd backend
npm start
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please contact the development team or create an issue in the repository.

---

**Happy Coding!** Enjoy building and using the Genius Society Hotel Reservation System!
