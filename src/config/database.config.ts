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
  const databaseUrl = configService.get<string>('DATABASE_URL');
  
  // Use SQLite if DATABASE_URL is a file path or in development
  if (nodeEnv === 'development' || (databaseUrl && databaseUrl.startsWith('file:'))) {
    const storage = databaseUrl ? databaseUrl.replace('file:', '') : 'fleet_management.db';
    return {
      dialect: 'sqlite',
      storage,
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