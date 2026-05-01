<div align="center">

  EN
</div>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-18-43853D?logo=node.js&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/Express-4-000000?logo=express&logoColor=white" alt="Express">
  <img src="https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white" alt="React">
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white" alt="PostgreSQL">
  <img src="https://img.shields.io/badge/Sequelize-52B0E7?logo=sequelize&logoColor=white" alt="Sequelize">
</p>

<p align="center" style="margin-top: -12px;">
  <img src="https://img.shields.io/badge/TailwindCSS-06B6D4?logo=tailwind-css&logoColor=white" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/License-MIT-22C55E?logo=opensourceinitiative&logoColor=white" alt="MIT">
</p>

<div align="center">

# ✨ Genius Society — Hotel Reservation System
### Modern, full-stack hotel booking platform with admin analytics and real-time availability
</div>

## 🚀 Why Genius Society

<div style="max-width: 720px;">

Genius Society is a modern hotel reservation system built for 5‑star properties. It pairs a polished, responsive React frontend with a robust Node/Express backend and PostgreSQL storage to deliver secure user flows, reliable booking orchestration, and actionable revenue analytics. The architecture handles real-world needs like concurrency, data integrity, and production deployment readiness.</div>

<br>

- ⚡ End-to-end booking flows with real-time availability checks  
- 🔐 JWT auth, password hashing, and standard security hygiene (COMING SOON)
- 📊 Built-in admin analytics and revenue reporting  
- 🎨 Luxury-themed responsive UI (Tailwind)  
- 🛠️ Open-source, modular, and easy to extend



## 🎯 Features

### A) Core Reservation Features

1. 👥 User Management — registration, authentication, profile management  
2. 🛏️ Room Browsing — view room types, descriptions, and facilities  
3. 📅 Booking Flow — check availability, create, update, and cancel reservations  
4. 🧾 Admin Dashboard — manage bookings, rooms, and view analytics  
5. 🔁 Room Availability — live availability tracking and management endpoints  
6. 💸 Revenue Analytics — revenue statistics and reporting endpoints  
7. 🧰 Facilities Management — list and manage hotel facilities  
8. 🎨 UI Theme — luxury amber-themed design with responsive layouts  
9. 📱 Responsive — mobile-friendly pages and layouts  
10. 🔒 Secure Defaults — input validation, sanitized filenames, and size checks

### B) Platform & System Capabilities

11. 🗄️ Relational Storage — PostgreSQL with Sequelize ORM  
12. 🔐 Authentication — JWT-based session handling and bcrypt hashing  
13. ⚙️ Migrations & Seeders — Sequelize-powered schema and sample data management  
14. 🧪 Test Scripts — basic test harness for backend and frontend  
15. 🔁 Hot Reloading — development-friendly live reload for both frontend and backend  
16. 🧩 Modular Structure — clear separation of controllers, services, and routes  
17. 📦 Production Build — frontend build artifacts and production server start scripts

## 🧠 Architecture Highlights

- Split frontend (React + Tailwind) and backend (Node + Express) for clear responsibilities  
- PostgreSQL manages transactional booking data; Sequelize provides a migration/seed workflow  
- Stateless API design with JWT authentication for scalable deployments  
- Admin analytics derived from aggregated revenue and booking records

## 💡 Design Considerations

- Bookings require strict availability checks to avoid double-booking  
- Migrations and seeders provide a reproducible dev database state  
- Environment variables are used for secrets and database configuration  
- Frontend and backend run independently during development for fast iteration

## 🔧 Processing Models

### 🔄 Server-Side Booking Flow (Transactional)
1. User selects room type and dates → request validated  
2. Backend checks availability against bookings + room inventory  
3. If available, booking record created within a transaction  
4. Confirmation returned to user; admin dashboards updated  
5. Cancellations release inventory and update analytics

### ⚡ Client-Side Interactions (Instant)
1. User navigates UI and previews room details  
2. Client performs lightweight validation and date selection UI updates  
3. Final booking submission calls the server API for transactional processing

## 🏗️ Architecture & Stack

<div style="max-width: 760px; line-height: 1.65;">

- **Frontend (React + Tailwind)** — UI, client routing, API integration, and responsive pages.  
  <br />
  <img src="https://skillicons.dev/icons?i=react,tailwind,vite" />

- **Backend (Node.js + Express)** — REST API, authentication, business logic, and migrations.  
  <br />
  <img src="https://skillicons.dev/icons?i=nodejs,express" />

- **Database (PostgreSQL + Sequelize)** — persistent storage, migrations, and seeders.  
  <br />
  <img src="https://skillicons.dev/icons?i=postgres" />

</div>

## ⚙️ Environment Variables

### Backend (root/backend .env)

```env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgres://postgres:password@localhost:5432/hotel_reservation_db
DB_HOST=localhost
DB_PORT=5432
DB_NAME=hotel_reservation_db
DB_USER=postgres
DB_PASS=your_password
JWT_SECRET=your_jwt_secret
```

## 🚀 Local Development

### 1. CLONE THE REPOSITORY
```bash
git clone https://github.com/<your-org>/hotel-reservation-genius.git
cd hotel-reservation-genius
```

### 2. RUN BACKEND
BEFORE RUNNING, ENSURE POSTGRESQL IS INSTALLED AND A DATABASE NAMED `hotel_reservation_db` IS CREATED. THEN, UPDATE THE `.env` FILE WITH YOUR DATABASE CREDENTIALS.

```bash
cd backend
npm install 
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
npm run dev
```

### 3. RUN FRONTEND
```bash
cd frontend
npm install
npm start
```
The frontend typically serves on http://localhost:3000 (or :3001 if 3000 is occupied). The backend API is available at http://localhost:3000/api.

## 🔒 Security Notes
- JWT authentication and bcrypt password hashing for credentials
- Input validation for booking and user endpoints
- Sanitize filenames and validate file sizes if uploads are introduced
- Use environment variables for secrets; never commit .env files

## 📚 API Endpoints

### 🔐 Authentication
- `POST /api/auth/login` - Login user
- `POST /api/auth/register` - Register new user

### 🏨 Room Management
- `GET /api/rooms` - Get all rooms
- `GET /api/rooms/with-room-type` - Get rooms with room type
- `GET /api/rooms/:id` - Get room details
- `POST /api/rooms` - Create new room
- `PUT /api/rooms/:id` - Update room
- `DELETE /api/rooms/:id` - Delete room

### 🏷️ Room Types
- `GET /api/room-types` - Get all room types
- `GET /api/room-types/with-facilities` - Get room types with facilities
- `GET /api/room-types/:id` - Get room type details
- `POST /api/room-types` - Create new room type
- `PUT /api/room-types/:id` - Update room type
- `DELETE /api/room-types/:id` - Delete room type

### 📋 Booking Management
- `POST /api/bookings` - Create new booking
- `GET /api/bookings` - Get all bookings
- `GET /api/bookings/check-availability` - Check room availability
- `GET /api/bookings/available-rooms` - Get available rooms
- `GET /api/bookings/user/:userId` - Get user bookings
- `GET /api/bookings/:id` - Get booking details
- `PUT /api/bookings/:id` - Update booking
- `DELETE /api/bookings/:id` - Delete booking

### 👨‍💼 Admin Booking Operations
- `GET /api/bookings/admin/all` - Get all bookings (admin)
- `PUT /api/bookings/admin/:id/confirm` - Confirm booking
- `PUT /api/bookings/admin/:id/check-in` - Check-in guest
- `PUT /api/bookings/admin/:id/check-out` - Check-out guest
- `PUT /api/bookings/admin/:id/cancel` - Cancel booking

### 🏢 Facilities
- `GET /api/facilities` - Get all facilities
- `GET /api/facilities/:id` - Get facility details
- `POST /api/facilities` - Create new facility
- `PUT /api/facilities/:id` - Update facility
- `DELETE /api/facilities/:id` - Delete facility

### 👥 User Management
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user details
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### 💰 Revenue Analytics
- `GET /api/revenue/stats` - Get revenue statistics

### 💳 Payment Management
- `GET /api/payments` - Get all payments
- `GET /api/payments/:id` - Get payment details
- `POST /api/payments` - Create new payment
- `PUT /api/payments/:id` - Update payment
- `DELETE /api/payments/:id` - Delete payment

## 🤝 Contributing
PRs and improvements are welcome. Suggested workflow:

1. Fork the repository
2. Create a feature branch (git checkout -b feature/awesome)
3. Commit your changes (git commit -m 'Add awesome feature')
4. Push to your branch (git push origin feature/awesome)
5. Open a Pull Request and describe the change

If you plan a larger change, open an issue first to align on scope.

## 📜 License
Licensed under the MIT License. See [LICENSE](./LICENSE) for details.


## 🙏 Acknowledgements
- Sequelize project and migration tooling
- Express and React communities
- Open-source contributors and libraries used

## 👤 Contributors

Made with ❤️ by the Genius Society team:

<table>
  <tr>
    <td align="center" width="180">
      <a href="https://github.com/Dendroculus">
        <img src="https://github.com/Dendroculus.png?size=96" width="96" alt="Dendroculus avatar"><br>
        <b>Dendroculus</b><br>
        <sub><b>Documenter and Maintainer</b></sub>
      </a>
    </td>
    <td align="center" width="180">
      <a href="https://github.com/Jensenix">
        <img src="https://github.com/Jensenix.png?size=96" width="96" alt="Jensenix avatar"><br>
        <b>Jensenix</b><br>
        <sub><b>Backend Dev & Project Owner</b></sub>
      </a>
    </td>
    <td align="center" width="180">
      <a href="https://github.com/Serthonss">
        <img src="https://github.com/Serthonss.png?size=96" width="96" alt="Serthonss avatar"><br>
        <b>Serthonss</b><br>
        <sub><b>Frontend Dev and Tester</b></sub>
      </a>
    </td>
    <td align="center" width="180">
      <a href="https://github.com/vincentlawi">
        <img src="https://github.com/vincentlawi.png?size=96" width="96" alt="vincentlawi avatar"><br>
        <b>vincentlawi</b><br>
        <sub><b>UI/UX Designer</b></sub>
      </a>
    </td>

  </tr>
</table>