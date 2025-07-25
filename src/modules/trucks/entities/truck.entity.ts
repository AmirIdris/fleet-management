import { Table, Column, Model, DataType, PrimaryKey, Default, Unique, CreatedAt, UpdatedAt, HasMany } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { TruckStatus } from '@/common/enums';
import { Trip } from '@/modules/trips/entities/trip.entity';

@Table({
  tableName: 'trucks',
  timestamps: true,
})
export class Truck extends Model<Truck> {
  @ApiProperty({ description: 'Unique identifier for the truck' })
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @ApiProperty({ description: 'License plate number' })
  @Unique
  @Column(DataType.STRING)
  licensePlate: string;

  @ApiProperty({ description: 'Truck manufacturer' })
  @Column(DataType.STRING)
  make: string;

  @ApiProperty({ description: 'Truck model' })
  @Column(DataType.STRING)
  model: string;

  @ApiProperty({ description: 'Manufacturing year' })
  @Column(DataType.INTEGER)
  year: number;

  @ApiProperty({ description: 'Vehicle Identification Number' })
  @Unique
  @Column(DataType.STRING)
  vin: string;

  @ApiProperty({ description: 'Fuel capacity in liters' })
  @Column(DataType.DECIMAL(10, 2))
  fuelCapacity: number;

  @ApiProperty({ description: 'Load capacity in kilograms' })
  @Column(DataType.DECIMAL(10, 2))
  loadCapacity: number;

  @ApiProperty({ description: 'Current mileage' })
  @Default(0)
  @Column(DataType.DECIMAL(10, 2))
  currentMileage: number;

  @ApiProperty({ description: 'Last maintenance date' })
  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
  })
  lastMaintenanceDate?: string;

  @ApiProperty({ description: 'Next scheduled maintenance date' })
  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
  })
  nextMaintenanceDate?: string;

  @ApiProperty({ description: 'Current status of the truck', enum: TruckStatus })
  @Default(TruckStatus.AVAILABLE)
  @Column(DataType.STRING)
  status: TruckStatus;

  @ApiProperty({ description: 'Whether the truck is available for trips' })
  @Default(true)
  @Column(DataType.BOOLEAN)
  isAvailable: boolean;

  @ApiProperty({ description: 'Additional notes about the truck' })
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

  // Relationships
  @HasMany(() => Trip)
  trips: Trip[];
}