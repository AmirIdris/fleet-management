import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { TripsService } from './trips.service';
import { TripsController } from './trips.controller';
import { Trip } from './entities/trip.entity';
import { TripExpense } from './entities/trip-expense.entity';
import { TrucksModule } from '@/modules/trucks/trucks.module';
import { DriversModule } from '@/modules/drivers/drivers.module';
import { ClientsModule } from '@/modules/clients/clients.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Trip, TripExpense]),
    TrucksModule,
    DriversModule,
    ClientsModule,
  ],
  controllers: [TripsController],
  providers: [TripsService],
  exports: [TripsService],
})
export class TripsModule {}