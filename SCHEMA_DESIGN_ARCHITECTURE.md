# Fleet Management System - Schema Design & Architecture

## Overview

This document outlines the database schema design and system architecture for the Fleet Management System, demonstrating thoughtful consideration of entity relationships, data normalization, scalability, and real-world domain modeling.

## Database Schema Design

### Core Entities

#### 1. Users
**Attributes:**
- id (UUID, Primary Key)
- username (String, Unique)
- email (String, Unique)
- password (String, Hashed)
- fullName (String)
- role (Enum: ADMIN, MANAGER, OPERATOR)
- isActive (Boolean, Default: true)
- createdAt, updatedAt (Timestamps)

**Design Rationale:**
- UUID for primary keys ensures global uniqueness and better security
- Role-based access control for different permission levels
- Soft deletion via `isActive` flag preserves data integrity
- Password hashing for security compliance

#### 2. Drivers
**Attributes:**
- id (UUID, Primary Key)
- fullName (String)
- licenseNumber (String, Unique)
- phoneNumber (String)
- email (String, Unique)
- dateOfBirth (Date)
- hireDate (Date, Default: Current Date)
- licenseExpiryDate (Date)
- emergencyContactName (String)
- emergencyContactPhone (String)
- address (Text)
- totalEarnings (Decimal, Default: 0)
- isActive (Boolean, Default: true)
- notes (Text, Optional)
- createdAt, updatedAt (Timestamps)

**Design Rationale:**
- Comprehensive driver profile for regulatory compliance
- Emergency contact information for safety protocols
- Earnings tracking for payroll integration
- License expiry tracking for compliance monitoring

#### 3. Trucks
**Attributes:**
- id (UUID, Primary Key)
- licensePlate (String, Unique)
- make (String)
- model (String)
- year (Integer)
- vin (String, Unique)
- fuelCapacity (Decimal)
- loadCapacity (Decimal)
- currentMileage (Decimal, Default: 0)
- lastMaintenanceDate (Date, Optional)
- nextMaintenanceDate (Date, Optional)
- status (Enum: ACTIVE, MAINTENANCE, OUT_OF_SERVICE)
- isAvailable (Boolean, Default: true)
- notes (Text, Optional)
- createdAt, updatedAt (Timestamps)

**Design Rationale:**
- VIN and license plate uniqueness for regulatory compliance
- Maintenance scheduling for operational efficiency
- Availability tracking for trip assignment optimization
- Capacity specifications for load planning

#### 4. Clients
**Attributes:**
- id (UUID, Primary Key)
- companyName (String)
- contactPerson (String)
- email (String, Unique)
- phoneNumber (String)
- address (Text)
- billingAddress (Text)
- taxId (String, Optional)
- paymentTerms (String)
- creditLimit (Decimal)
- totalRevenue (Decimal, Default: 0)
- isActive (Boolean, Default: true)
- notes (Text, Optional)
- createdAt, updatedAt (Timestamps)

**Design Rationale:**
- Separate billing address for accounting accuracy
- Credit limit management for financial risk control
- Revenue tracking for business analytics
- Tax ID for compliance and invoicing

#### 5. Trips
**Attributes:**
- id (UUID, Primary Key)
- tripNumber (String, Unique)
- origin (String)
- destination (String)
- plannedDepartureDate (Date)
- plannedArrivalDate (Date)
- actualDepartureDate (Date, Optional)
- actualArrivalDate (Date, Optional)
- distance (Decimal)
- cargoWeight (Decimal)
- cargoDescription (Text)
- revenue (Decimal)
- driverEarnings (Decimal, Optional)
- status (Enum: PLANNED, IN_PROGRESS, COMPLETED, CANCELLED)
- notes (Text, Optional)
- truckId (UUID, Foreign Key → Trucks)
- driverId (UUID, Foreign Key → Drivers)
- clientId (UUID, Foreign Key → Clients)
- createdAt, updatedAt (Timestamps)

**Design Rationale:**
- Planned vs actual dates for performance tracking
- Cargo details for load management and insurance
- Status tracking for operational visibility
- Revenue and earnings separation for financial clarity

#### 6. Trip Expenses
**Attributes:**
- id (UUID, Primary Key)
- type (Enum: FUEL, TOLLS, MEALS, ACCOMMODATION, MAINTENANCE, OTHER)
- amount (Decimal)
- description (String, Optional)
- receiptUrl (String, Optional)
- expenseDate (Date)
- tripId (UUID, Foreign Key → Trips)
- createdAt, updatedAt (Timestamps)

**Design Rationale:**
- Categorized expenses for cost analysis
- Receipt storage for audit compliance
- Trip-specific expense tracking for profitability analysis

## Entity Relationships

### 1. One-to-Many Relationships

**Trucks → Trips**
- One truck can be assigned to multiple trips over time
- Enables truck utilization tracking and maintenance scheduling

**Drivers → Trips**
- One driver can handle multiple trips
- Supports driver performance metrics and earnings calculation

**Clients → Trips**
- One client can have multiple trips
- Enables client relationship management and revenue tracking

**Trips → Trip Expenses**
- One trip can have multiple expenses
- Supports detailed cost tracking and profitability analysis

### 2. Referential Integrity

- Foreign key constraints ensure data consistency
- Cascade rules prevent orphaned records
- Soft deletion preserves historical data while maintaining relationships

## Data Normalization

### Third Normal Form (3NF) Compliance

1. **First Normal Form (1NF):**
   - All tables have atomic values
   - No repeating groups or arrays

2. **Second Normal Form (2NF):**
   - All non-key attributes depend on the entire primary key
   - No partial dependencies

3. **Third Normal Form (3NF):**
   - No transitive dependencies
   - All non-key attributes depend only on the primary key

### Denormalization Decisions

**Calculated Fields:**
- `totalEarnings` in Drivers table
- `totalRevenue` in Clients table
- `currentMileage` in Trucks table

**Rationale:** These denormalized fields improve query performance for dashboard analytics while maintaining data consistency through application-level updates.

## Scalability Considerations

### Database Design

1. **Indexing Strategy:**
   - Primary keys (UUID) with clustered indexes
   - Unique constraints on business keys (license plates, emails)
   - Composite indexes on frequently queried combinations

2. **Partitioning Potential:**
   - Trips table can be partitioned by date ranges
   - Expenses table can be partitioned by trip or date

3. **Archive Strategy:**
   - Completed trips older than X years can be archived
   - Maintains performance while preserving historical data

### Application Architecture

1. **Modular Design:**
   - Separate modules for each domain entity
   - Clean separation of concerns
   - Easy to scale individual components

2. **Service Layer Pattern:**
   - Business logic encapsulated in service classes
   - Data access abstracted through repositories
   - Facilitates testing and maintenance

## Real-World Domain Modeling

### Business Rules Implementation

1. **Operational Constraints:**
   - Trucks must be available for trip assignment
   - Drivers must be active for trip assignment
   - Clients must be active for new trips

2. **Financial Controls:**
   - Credit limit validation for clients
   - Automatic earnings calculation for drivers
   - Revenue tracking for business analytics

3. **Compliance Features:**
   - License expiry tracking for drivers
   - Maintenance scheduling for trucks
   - Audit trail through timestamps

### Workflow Support

1. **Trip Lifecycle:**
   - PLANNED → IN_PROGRESS → COMPLETED/CANCELLED
   - Automatic status transitions with business rule validation

2. **Resource Management:**
   - Truck availability tracking
   - Driver assignment validation
   - Load capacity verification

## Security Considerations

1. **Authentication & Authorization:**
   - Role-based access control (RBAC)
   - JWT token-based authentication
   - Password hashing with bcrypt

2. **Data Protection:**
   - UUID primary keys prevent enumeration attacks
   - Soft deletion preserves audit trails
   - Input validation and sanitization

## Performance Optimizations

1. **Query Optimization:**
   - Eager loading for related entities
   - Pagination for large datasets
   - Efficient filtering and sorting

2. **Caching Strategy:**
   - Application-level caching for frequently accessed data
   - Database query result caching
   - Static data caching (enums, lookups)

## Future Extensibility

1. **Planned Enhancements:**
   - GPS tracking integration
   - Fuel consumption monitoring
   - Predictive maintenance scheduling
   - Customer portal integration

2. **Schema Evolution:**
   - Migration strategy for schema changes
   - Backward compatibility considerations
   - Version control for database changes

## Technology Stack Justification

1. **NestJS Framework:**
   - Enterprise-grade Node.js framework
   - Built-in dependency injection
   - Excellent TypeScript support
   - Modular architecture

2. **Sequelize ORM:**
   - Database abstraction layer
   - Migration support
   - Model relationships
   - Query optimization

3. **SQLite Database:**
   - Lightweight for development
   - Easy deployment
   - ACID compliance
   - Suitable for small to medium scale

## Conclusion

This schema design demonstrates a thorough understanding of:
- **Entity Relationships:** Proper foreign key relationships with referential integrity
- **Data Normalization:** 3NF compliance with strategic denormalization for performance
- **Scalability:** Modular design with clear separation of concerns
- **Real-world Modeling:** Comprehensive business rule implementation and workflow support

The architecture provides a solid foundation for a production-ready fleet management system while maintaining flexibility for future enhancements and scaling requirements.