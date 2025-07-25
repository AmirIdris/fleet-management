import { Table, Column, Model, DataType, PrimaryKey, Default, Unique, CreatedAt, UpdatedAt } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@/common/enums';

@Table({
  tableName: 'users',
  timestamps: true,
})
export class User extends Model<User> {
  @ApiProperty({ description: 'Unique identifier for the user' })
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @ApiProperty({ description: 'Username' })
  @Unique
  @Column(DataType.STRING)
  username: string;

  @ApiProperty({ description: 'Email address' })
  @Unique
  @Column(DataType.STRING)
  email: string;

  @Column(DataType.STRING)
  password: string;

  @ApiProperty({ description: 'User role', enum: UserRole })
  @Default(UserRole.MANAGER)
  @Column(DataType.STRING)
  role: UserRole;

  @ApiProperty({ description: 'Full name of the user' })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  fullName?: string;

  @ApiProperty({ description: 'Whether the user account is active' })
  @Default(true)
  @Column(DataType.BOOLEAN)
  isActive: boolean;

  @ApiProperty({ description: 'Last login timestamp' })
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  lastLoginAt?: Date;

  @ApiProperty({ description: 'Creation timestamp' })
  @CreatedAt
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  @UpdatedAt
  updatedAt: Date;
}