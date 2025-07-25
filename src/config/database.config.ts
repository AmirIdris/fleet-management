import { SequelizeModuleOptions } from '@nestjs/sequelize';
import { ConfigService } from '@nestjs/config';
import { User } from '@/modules/users/entities/user.entity';
import { Truck } from '@/modules/trucks/entities/truck.entity';
import { Driver } from '@/modules/drivers/entities/driver.entity';
import { Client } from '@/modules/clients/entities/client.entity';
import { Trip } from '@/modules/trips/entities/trip.entity';
import { TripExpense } from '@/modules/trips/entities/trip-expense.entity';

export const getSequelizeConfig = (configService: ConfigService): SequelizeModuleOptions => {
  const nodeEnv = configService.get<string>('NODE_ENV', 'development');
  
  if (nodeEnv === 'development') {
    // Use SQLite for development
    return {
      dialect: 'sqlite',
      storage: 'fleet_management.db',
      models: [User, Truck, Driver, Client, Trip, TripExpense],
      autoLoadModels: true,
      synchronize: true,
      logging: false,
    };
  }
  
  // Use PostgreSQL for production
  return {
    dialect: 'postgres',
    host: configService.get<string>('DB_HOST', 'localhost'),
    port: configService.get<number>('DB_PORT', 5432),
    username: configService.get<string>('DB_USERNAME', 'postgres'),
    password: configService.get<string>('DB_PASSWORD', 'rumirumi'),
    database: configService.get<string>('DB_DATABASE', 'fleet_management'),
    models: [User, Truck, Driver, Client, Trip, TripExpense],
    autoLoadModels: true,
    synchronize: configService.get<boolean>('DB_SYNCHRONIZE', true),
    logging: configService.get<boolean>('DB_LOGGING', false),
    dialectOptions: {
      ssl: configService.get<boolean>('DB_SSL', false),
    },
  };
};