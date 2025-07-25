import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { Trip } from '@/modules/trips/entities/trip.entity';
import { TripExpense } from '@/modules/trips/entities/trip-expense.entity';
import { Driver } from '@/modules/drivers/entities/driver.entity';
import { Truck } from '@/modules/trucks/entities/truck.entity';
import { Client } from '@/modules/clients/entities/client.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([Trip, TripExpense, Driver, Truck, Client]),
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
  exports: [ReportsService],
})
export class ReportsModule {}