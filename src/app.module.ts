import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { getSequelizeConfig } from '@/config/database.config';
import { AuthModule } from '@/modules/auth/auth.module';
import { UsersModule } from '@/modules/users/users.module';
import { TrucksModule } from '@/modules/trucks/trucks.module';
import { DriversModule } from '@/modules/drivers/drivers.module';
import { ClientsModule } from '@/modules/clients/clients.module';
import { TripsModule } from '@/modules/trips/trips.module';
import { ReportsModule } from '@/modules/reports/reports.module';
import { HealthController } from '@/health/health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getSequelizeConfig,
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    TrucksModule,
    DriversModule,
    ClientsModule,
    TripsModule,
    ReportsModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}