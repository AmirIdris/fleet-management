import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsDateString, IsEnum } from 'class-validator';

export enum ReportPeriod {
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
  CUSTOM = 'custom',
}

export class ReportQueryDto {
  @ApiProperty({ 
    description: 'Report period',
    enum: ReportPeriod,
    example: ReportPeriod.MONTHLY,
    required: false,
  })
  @IsOptional()
  @IsEnum(ReportPeriod)
  period?: ReportPeriod;

  @ApiProperty({ 
    description: 'Start date for custom period (ISO string)',
    example: '2024-01-01T00:00:00.000Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({ 
    description: 'End date for custom period (ISO string)',
    example: '2024-12-31T23:59:59.999Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiProperty({ 
    description: 'Year for yearly reports',
    example: 2024,
    required: false,
  })
  @IsOptional()
  year?: number;

  @ApiProperty({ 
    description: 'Month for monthly reports (1-12)',
    example: 1,
    required: false,
  })
  @IsOptional()
  month?: number;
}

export class DriverReportDto {
  @ApiProperty({ description: 'Driver ID' })
  driverId: string;

  @ApiProperty({ description: 'Driver name' })
  driverName: string;

  @ApiProperty({ description: 'Driver email' })
  driverEmail: string;

  @ApiProperty({ description: 'Total number of trips' })
  totalTrips: number;

  @ApiProperty({ description: 'Total revenue generated' })
  totalRevenue: number;

  @ApiProperty({ description: 'Total expenses incurred' })
  totalExpenses: number;

  @ApiProperty({ description: 'Net profit' })
  netProfit: number;

  @ApiProperty({ description: 'Total distance covered' })
  totalDistance: number;

  @ApiProperty({ description: 'Average revenue per trip' })
  averageRevenuePerTrip: number;
}

export class TruckReportDto {
  @ApiProperty({ description: 'Truck ID' })
  truckId: string;

  @ApiProperty({ description: 'Truck license plate' })
  licensePlate: string;

  @ApiProperty({ description: 'Truck make and model' })
  makeModel: string;

  @ApiProperty({ description: 'Total number of trips' })
  totalTrips: number;

  @ApiProperty({ description: 'Total usage in kilometers' })
  totalUsage: number;

  @ApiProperty({ description: 'Total revenue generated' })
  totalRevenue: number;

  @ApiProperty({ description: 'Total expenses incurred' })
  totalExpenses: number;

  @ApiProperty({ description: 'Net profit' })
  netProfit: number;

  @ApiProperty({ description: 'Utilization rate percentage' })
  utilizationRate: number;

  @ApiProperty({ description: 'Average revenue per trip' })
  averageRevenuePerTrip: number;
}

export class ClientReportDto {
  @ApiProperty({ description: 'Client ID' })
  clientId: string;

  @ApiProperty({ description: 'Client name' })
  clientName: string;

  @ApiProperty({ description: 'Client email' })
  clientEmail: string;

  @ApiProperty({ description: 'Total number of trips' })
  totalTrips: number;

  @ApiProperty({ description: 'Total revenue generated' })
  totalRevenue: number;

  @ApiProperty({ description: 'Total expenses incurred' })
  totalExpenses: number;

  @ApiProperty({ description: 'Net profit' })
  netProfit: number;

  @ApiProperty({ description: 'Average revenue per trip' })
  averageRevenuePerTrip: number;

  @ApiProperty({ description: 'Monthly breakdown', type: [Object] })
  monthlyBreakdown?: Array<{
    month: string;
    trips: number;
    revenue: number;
    expenses: number;
  }>;
}