import { Table, Column, Model, DataType, PrimaryKey, Default, Unique, CreatedAt, UpdatedAt, BelongsTo, HasMany, ForeignKey } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { TripStatus } from '@/common/enums';
import { Truck } from '@/modules/trucks/entities/truck.entity';
import { Driver } from '@/modules/drivers/entities/driver.entity';
import { Client } from '@/modules/clients/entities/client.entity';
import { TripExpense } from './trip-expense.entity';

@Table({
  tableName: 'trips',
  timestamps: true,
})
export class Trip extends Model<Trip> {
  @ApiProperty({ description: 'Unique identifier for the trip' })
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @ApiProperty({ description: 'Unique trip number' })
  @Unique
  @Column(DataType.STRING)
  tripNumber: string;

  @ApiProperty({ description: 'Origin location' })
  @Column(DataType.STRING)
  origin: string;

  @ApiProperty({ description: 'Destination location' })
  @Column(DataType.STRING)
  destination: string;

  @ApiProperty({ description: 'Planned departure date and time' })
  @Column(DataType.DATE)
  plannedDepartureDate: Date;

  @ApiProperty({ description: 'Planned arrival date and time' })
  @Column(DataType.DATE)
  plannedArrivalDate: Date;

  @ApiProperty({ description: 'Actual departure date and time' })
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  actualDepartureDate?: Date;

  @ApiProperty({ description: 'Actual arrival date and time' })
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  actualArrivalDate?: Date;

  @ApiProperty({ description: 'Distance in kilometers' })
  @Column(DataType.DECIMAL(10, 2))
  distance: number;

  @ApiProperty({ description: 'Cargo weight in kilograms' })
  @Column(DataType.DECIMAL(10, 2))
  cargoWeight: number;

  @ApiProperty({ description: 'Cargo description' })
  @Column(DataType.TEXT)
  cargoDescription: string;

  @ApiProperty({ description: 'Trip revenue' })
  @Column(DataType.DECIMAL(10, 2))
  revenue: number;

  @ApiProperty({ description: 'Driver earnings for this trip' })
  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: true,
  })
  driverEarnings?: number;

  @ApiProperty({ description: 'Current status of the trip', enum: TripStatus })
  @Default(TripStatus.PLANNED)
  @Column(DataType.STRING)
  status: TripStatus;

  @ApiProperty({ description: 'Additional notes about the trip' })
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  notes?: string;

  @ApiProperty({ description: 'Creation timestamp' })
  @CreatedAt
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  @UpdatedAt
  updatedAt: Date;

  // Foreign Keys
  @ForeignKey(() => Truck)
  @Column(DataType.UUID)
  truckId: string;

  @ForeignKey(() => Driver)
  @Column(DataType.UUID)
  driverId: string;

  @ForeignKey(() => Client)
  @Column(DataType.UUID)
  clientId: string;

  // Relationships
  @BelongsTo(() => Truck)
  truck: Truck;

  @BelongsTo(() => Driver)
  driver: Driver;

  @BelongsTo(() => Client)
  client: Client;

  @HasMany(() => TripExpense)
  expenses: TripExpense[];
}