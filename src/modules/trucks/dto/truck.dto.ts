import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsDateString, IsEnum, IsBoolean, Min, Max } from 'class-validator';
import { TruckStatus } from '@/common/enums';

export class CreateTruckDto {
  @ApiProperty({ description: 'License plate number', example: 'ABC-123' })
  @IsString()
  licensePlate: string;

  @ApiProperty({ description: 'Truck manufacturer', example: 'Volvo' })
  @IsString()
  make: string;

  @ApiProperty({ description: 'Truck model', example: 'VNL 860' })
  @IsString()
  model: string;

  @ApiProperty({ description: 'Manufacturing year', example: 2022 })
  @IsNumber()
  @Min(1900)
  @Max(new Date().getFullYear() + 1)
  year: number;

  @ApiProperty({ description: 'Vehicle Identification Number', example: '1FUJGHDV8NLBX1234' })
  @IsString()
  vin: string;

  @ApiProperty({ description: 'Fuel capacity in liters', example: 300 })
  @IsNumber()
  @Min(0)
  fuelCapacity: number;

  @ApiProperty({ description: 'Load capacity in kilograms', example: 40000 })
  @IsNumber()
  @Min(0)
  loadCapacity: number;

  @ApiProperty({ description: 'Current mileage', example: 50000, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  currentMileage?: number;

  @ApiProperty({ description: 'Last maintenance date (YYYY-MM-DD)', example: '2024-01-15', required: false })
  @IsOptional()
  @IsDateString()
  lastMaintenanceDate?: string;

  @ApiProperty({ description: 'Next scheduled maintenance date (YYYY-MM-DD)', example: '2024-07-15', required: false })
  @IsOptional()
  @IsDateString()
  nextMaintenanceDate?: string;

  @ApiProperty({ description: 'Additional notes about the truck', required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateTruckDto extends PartialType(CreateTruckDto) {
  @ApiProperty({ description: 'Current status of the truck', enum: TruckStatus, required: false })
  @IsOptional()
  @IsEnum(TruckStatus)
  status?: TruckStatus;

  @ApiProperty({ description: 'Whether the truck is available for trips', required: false })
  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;
}