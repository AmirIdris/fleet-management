import { Table, Column, Model, DataType, PrimaryKey, Default, Unique, CreatedAt, UpdatedAt, HasMany } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { Trip } from '@/modules/trips/entities/trip.entity';

@Table({
  tableName: 'drivers',
  timestamps: true,
})
export class Driver extends Model<Driver> {
  @ApiProperty({ description: 'Unique identifier for the driver' })
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @ApiProperty({ description: 'Driver full name' })
  @Column(DataType.STRING)
  fullName: string;

  @ApiProperty({ description: 'Driver license number' })
  @Unique
  @Column(DataType.STRING)
  licenseNumber: string;

  @ApiProperty({ description: 'Phone number' })
  @Column(DataType.STRING)
  phoneNumber: string;

  @ApiProperty({ description: 'Email address' })
  @Unique
  @Column(DataType.STRING)
  email: string;

  @ApiProperty({ description: 'Date of birth' })
  @Column(DataType.DATEONLY)
  dateOfBirth: string;

  @ApiProperty({ description: 'Hire date' })
  @Column(DataType.DATEONLY)
  hireDate: string;

  @ApiProperty({ description: 'License expiry date' })
  @Column(DataType.DATEONLY)
  licenseExpiryDate: string;

  @ApiProperty({ description: 'Emergency contact name' })
  @Column(DataType.STRING)
  emergencyContactName: string;

  @ApiProperty({ description: 'Emergency contact phone' })
  @Column(DataType.STRING)
  emergencyContactPhone: string;

  @ApiProperty({ description: 'Home address' })
  @Column(DataType.TEXT)
  address: string;

  @ApiProperty({ description: 'Total earnings from completed trips' })
  @Default(0)
  @Column(DataType.DECIMAL(10, 2))
  totalEarnings: number;

  @ApiProperty({ description: 'Whether the driver is currently active' })
  @Default(true)
  @Column(DataType.BOOLEAN)
  isActive: boolean;

  @ApiProperty({ description: 'Additional notes about the driver' })
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