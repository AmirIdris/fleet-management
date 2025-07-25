import { Table, Column, Model, DataType, PrimaryKey, Default, Unique, CreatedAt, UpdatedAt, HasMany } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { Trip } from '@/modules/trips/entities/trip.entity';

@Table({
  tableName: 'clients',
  timestamps: true,
})
export class Client extends Model<Client> {
  @ApiProperty({ description: 'Unique identifier for the client' })
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @ApiProperty({ description: 'Company name' })
  @Column(DataType.STRING)
  companyName: string;

  @ApiProperty({ description: 'Contact person name' })
  @Column(DataType.STRING)
  contactPerson: string;

  @ApiProperty({ description: 'Email address' })
  @Unique
  @Column(DataType.STRING)
  email: string;

  @ApiProperty({ description: 'Phone number' })
  @Column(DataType.STRING)
  phoneNumber: string;

  @ApiProperty({ description: 'Company address' })
  @Column(DataType.TEXT)
  address: string;

  @ApiProperty({ description: 'Billing address' })
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  billingAddress?: string;

  @ApiProperty({ description: 'Tax identification number' })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  taxId?: string;

  @ApiProperty({ description: 'Payment terms in days' })
  @Default(30)
  @Column(DataType.INTEGER)
  paymentTerms: number;

  @ApiProperty({ description: 'Credit limit' })
  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: true,
  })
  creditLimit?: number;

  @ApiProperty({ description: 'Total revenue generated from this client' })
  @Default(0)
  @Column(DataType.DECIMAL(10, 2))
  totalRevenue: number;

  @ApiProperty({ description: 'Whether the client is currently active' })
  @Default(true)
  @Column(DataType.BOOLEAN)
  isActive: boolean;

  @ApiProperty({ description: 'Additional notes about the client' })
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