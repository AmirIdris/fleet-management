# Fleet Management System

A comprehensive backend system for managing a fleet of trucks, tracking trips and drivers, and generating detailed reports for a trucking company. Built with NestJS and PostgreSQL.

## Features

### 🚛 Truck Management
- Add, edit, and deactivate trucks
- Track usage and availability
- Monitor maintenance schedules
- Real-time status updates

### 👨‍💼 Driver Management
- Add and edit driver profiles
- Dynamic driver assignment to trips
- Track driver performance and earnings
- License and certification management

### 🗺️ Trip Management
- Create and update trip records
- Associate trips with trucks, drivers, and clients
- Record revenue and track various expenses
- Trip lifecycle management (planned → in-progress → completed)

### 🏢 Client Management
- Add and edit client information
- View comprehensive trip history
- Track client revenue and relationships

### 📊 Advanced Reporting
- **Driver Reports**: Trips, revenue, expenses, and performance metrics
- **Truck Reports**: Usage statistics, revenue, expenses, and utilization rates
- **Client Reports**: Monthly and yearly revenue breakdowns
- **Dashboard**: Real-time overview and key metrics

### 🔐 Security & Authentication
- JWT-based authentication
- Role-based access control (Admin/Staff/Viewer)
- Secure API endpoints
- Password encryption with bcrypt

## Technology Stack

- **Framework**: NestJS (Node.js)
- **Database**: PostgreSQL with Sequelize
- **Authentication**: JWT with Passport
- **Documentation**: Swagger/OpenAPI
- **Validation**: class-validator
- **Language**: TypeScript

## Architecture Overview

### Database Schema
The system uses a well-normalized PostgreSQL database with the following key entities:

- **Users**: System users with role-based permissions
- **Trucks**: Fleet vehicles with maintenance tracking
- **Drivers**: Driver profiles with license information
- **Clients**: Customer information and relationships
- **Trips**: Trip records linking trucks, drivers, and clients
- **Trip Expenses**: Detailed expense tracking per trip

### Entity Relationships
- One-to-Many: Client → Trips, Truck → Trips, Driver → Trips
- Many-to-One: Trip → Client/Truck/Driver
- One-to-Many: Trip → Trip Expenses
- Computed Properties: Total expenses, net profit, trip duration

## Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### 1. Clone and Install
```bash
git clone <repository-url>
cd fleet-management-system
npm install
```

### 2. Database Setup
```bash
# Create PostgreSQL database
createdb fleet_management

# Copy environment configuration
cp .env.example .env

# Update .env with your database credentials
```

### 3. Environment Configuration
Update `.env` file with your settings:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=fleet_management
JWT_SECRET=your-super-secret-jwt-key
```

### 4. Run the Application
```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

## API Documentation

Once the application is running, access the interactive API documentation at:
- **Swagger UI**: `http://localhost:3000/api/docs`

### Key API Endpoints

#### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/profile` - Get current user profile

#### Truck Management
- `GET /api/trucks` - List all trucks
- `POST /api/trucks` - Create new truck
- `GET /api/trucks/available` - Get available trucks
- `PATCH /api/trucks/:id/maintenance` - Set maintenance status

#### Driver Management
- `GET /api/drivers` - List all drivers
- `POST /api/drivers` - Create new driver
- `GET /api/drivers/active` - Get active drivers
- `PATCH /api/drivers/:id/activate` - Activate/deactivate driver

#### Trip Management
- `GET /api/trips` - List all trips
- `POST /api/trips` - Create new trip
- `PATCH /api/trips/:id/start` - Start trip
- `PATCH /api/trips/:id/complete` - Complete trip
- `POST /api/trips/:id/expenses` - Add trip expense

#### Reports
- `GET /api/reports/drivers` - Driver performance reports
- `GET /api/reports/trucks` - Truck utilization reports
- `GET /api/reports/clients` - Client revenue reports
- `GET /api/reports/dashboard` - Dashboard summary

## Usage Examples

### Creating a Trip
```bash
curl -X POST http://localhost:3000/api/trips \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "tripNumber": "TRP-001",
    "origin": "New York",
    "destination": "Los Angeles",
    "plannedStartDate": "2024-01-15T08:00:00Z",
    "plannedEndDate": "2024-01-18T18:00:00Z",
    "distance": 2800,
    "revenue": 5000,
    "truckId": "truck-uuid",
    "driverId": "driver-uuid",
    "clientId": "client-uuid"
  }'
```

### Generating Reports
```bash
# Get monthly driver reports
curl -X GET "http://localhost:3000/api/reports/drivers?period=monthly&month=1&year=2024" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Get yearly client reports
curl -X GET "http://localhost:3000/api/reports/clients?period=yearly&year=2024" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## System Design Decisions

### 1. Entity Relationships
- **Normalized Design**: Separate entities for trucks, drivers, clients, and trips to avoid data duplication
- **Flexible Associations**: Many-to-one relationships allow multiple trips per truck/driver/client
- **Audit Trail**: Created/updated timestamps and user tracking for all entities

### 2. Business Logic
- **Trip Lifecycle**: Clear state management (planned → in-progress → completed/cancelled)
- **Automatic Updates**: Completing trips automatically updates truck mileage, driver earnings, and client revenue
- **Validation**: Comprehensive validation ensures data integrity and business rule compliance

### 3. Security Architecture
- **JWT Authentication**: Stateless authentication suitable for API-first architecture
- **Role-Based Access**: Three-tier permission system (Admin/Staff/Viewer)
- **Route Protection**: All endpoints secured with appropriate permission levels

### 4. Reporting Engine
- **Flexible Queries**: Support for monthly, yearly, and custom date ranges
- **Performance Metrics**: Comprehensive KPIs including utilization rates, profit margins, and efficiency metrics
- **Real-time Data**: Reports reflect current database state with computed properties

## License

This project is licensed under the MIT License.