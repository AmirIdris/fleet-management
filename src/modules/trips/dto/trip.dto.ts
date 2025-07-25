import { IsString, IsNotEmpty, IsUUID, IsDateString, IsNumber, IsEnum, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { TripStatus, ExpenseType } from '@/common/enums';

export class CreateTripExpenseDto {
  @ApiProperty({ enum: ExpenseType })
  @IsEnum(ExpenseType)
  type: ExpenseType;

  @ApiProperty({ example: 150.50 })
  @IsNumber()
  @Type(() => Number)
  amount: number;

  @ApiPropertyOptional({ example: 'Fuel for trip to Chicago' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: 'https://example.com/receipt.jpg' })
  @IsString()
  @IsOptional()
  receiptUrl?: string;

  @ApiProperty({ example: '2023-12-01' })
  @IsDateString()
  expenseDate: string;
}

export class CreateTripDto {
  @ApiProperty({ example: 'TRIP-001' })
  @IsString()
  @IsNotEmpty()
  tripNumber: string;

  @ApiProperty({ example: 'New York, NY' })
  @IsString()
  @IsNotEmpty()
  origin: string;

  @ApiProperty({ example: 'Chicago, IL' })
  @IsString()
  @IsNotEmpty()
  destination: string;

  @ApiProperty({ example: '2023-12-01T08:00:00Z' })
  @IsDateString()
  plannedDepartureDate: string;

  @ApiProperty({ example: '2023-12-03T18:00:00Z' })
  @IsDateString()
  plannedArrivalDate: string;

  @ApiProperty({ example: 800.5 })
  @IsNumber()
  @Type(() => Number)
  distance: number;

  @ApiProperty({ example: 1500.75 })
  @IsNumber()
  @Type(() => Number)
  cargoWeight: number;

  @ApiProperty({ example: 'Electronics and computer equipment' })
  @IsString()
  @IsNotEmpty()
  cargoDescription: string;

  @ApiProperty({ example: 2500.00 })
  @IsNumber()
  @Type(() => Number)
  revenue: number;

  @ApiProperty({ example: 'uuid-truck-id' })
  @IsUUID()
  truckId: string;

  @ApiProperty({ example: 'uuid-driver-id' })
  @IsUUID()
  driverId: string;

  @ApiProperty({ example: 'uuid-client-id' })
  @IsUUID()
  clientId: string;

  @ApiPropertyOptional({ example: 'Special handling required' })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional({ type: [CreateTripExpenseDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTripExpenseDto)
  @IsOptional()
  expenses?: CreateTripExpenseDto[];
}

export class UpdateTripDto {
  @ApiPropertyOptional({ example: 'TRIP-001' })
  @IsString()
  @IsOptional()
  tripNumber?: string;

  @ApiPropertyOptional({ example: 'New York, NY' })
  @IsString()
  @IsOptional()
  origin?: string;

  @ApiPropertyOptional({ example: 'Chicago, IL' })
  @IsString()
  @IsOptional()
  destination?: string;

  @ApiPropertyOptional({ example: '2023-12-01T08:00:00Z' })
  @IsDateString()
  @IsOptional()
  plannedDepartureDate?: string;

  @ApiPropertyOptional({ example: '2023-12-01T09:00:00Z' })
  @IsDateString()
  @IsOptional()
  actualDepartureDate?: string;

  @ApiPropertyOptional({ example: '2023-12-03T18:00:00Z' })
  @IsDateString()
  @IsOptional()
  plannedArrivalDate?: string;

  @ApiPropertyOptional({ example: '2023-12-03T17:30:00Z' })
  @IsDateString()
  @IsOptional()
  actualArrivalDate?: string;

  @ApiPropertyOptional({ example: 800.5 })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  distance?: number;

  @ApiPropertyOptional({ example: 1500.75 })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  cargoWeight?: number;

  @ApiPropertyOptional({ example: 'Electronics and computer equipment' })
  @IsString()
  @IsOptional()
  cargoDescription?: string;

  @ApiPropertyOptional({ example: 2500.00 })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  revenue?: number;

  @ApiPropertyOptional({ example: 250.00 })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  driverEarnings?: number;

  @ApiPropertyOptional({ enum: TripStatus })
  @IsEnum(TripStatus)
  @IsOptional()
  status?: TripStatus;

  @ApiPropertyOptional({ example: 'uuid-truck-id' })
  @IsUUID()
  @IsOptional()
  truckId?: string;

  @ApiPropertyOptional({ example: 'uuid-driver-id' })
  @IsUUID()
  @IsOptional()
  driverId?: string;

  @ApiPropertyOptional({ example: 'uuid-client-id' })
  @IsUUID()
  @IsOptional()
  clientId?: string;

  @ApiPropertyOptional({ example: 'Special handling required' })
  @IsString()
  @IsOptional()
  notes?: string;
}

export class AddTripExpenseDto {
  @ApiProperty({ enum: ExpenseType })
  @IsEnum(ExpenseType)
  type: ExpenseType;

  @ApiProperty({ example: 150.50 })
  @IsNumber()
  @Type(() => Number)
  amount: number;

  @ApiPropertyOptional({ example: 'Fuel for trip to Chicago' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: 'https://example.com/receipt.jpg' })
  @IsString()
  @IsOptional()
  receiptUrl?: string;

  @ApiProperty({ example: '2023-12-01' })
  @IsDateString()
  expenseDate: string;
}