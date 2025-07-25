import { Table, Column, Model, DataType, PrimaryKey, Default, CreatedAt, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { ExpenseType } from '@/common/enums';
import { Trip } from './trip.entity';

@Table({
  tableName: 'trip_expenses',
  timestamps: true,
  updatedAt: false,
})
export class TripExpense extends Model<TripExpense> {
  @ApiProperty({ description: 'Unique identifier for the expense' })
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @ApiProperty({ description: 'Type of expense', enum: ExpenseType })
  @Column(DataType.STRING)
  type: ExpenseType;

  @ApiProperty({ description: 'Expense amount' })
  @Column(DataType.DECIMAL(10, 2))
  amount: number;

  @ApiProperty({ description: 'Description of the expense' })
  @Column(DataType.TEXT)
  description: string;

  @ApiProperty({ description: 'Date when the expense occurred' })
  @Column(DataType.DATEONLY)
  expenseDate: string;

  @ApiProperty({ description: 'Receipt number or reference' })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  receiptNumber?: string;

  @ApiProperty({ description: 'Creation timestamp' })
  @CreatedAt
  createdAt: Date;

  // Foreign Key
  @ForeignKey(() => Trip)
  @Column(DataType.UUID)
  tripId: string;

  // Relationships
  @BelongsTo(() => Trip)
  trip: Trip;
}