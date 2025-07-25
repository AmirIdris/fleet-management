import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Driver } from './entities/driver.entity';
import { CreateDriverDto, UpdateDriverDto } from './dto/driver.dto';
import { Op } from 'sequelize';

@Injectable()
export class DriversService {
  constructor(
    @InjectModel(Driver)
    private driversRepository: typeof Driver,
  ) {}

  async create(createDriverDto: CreateDriverDto): Promise<Driver> {
    const existingDriver = await this.driversRepository.findOne({
      where: {
        [Op.or]: [
          { licenseNumber: createDriverDto.licenseNumber },
          { email: createDriverDto.email },
          { phoneNumber: createDriverDto.phoneNumber },
        ],
      },
    });

    if (existingDriver) {
      throw new ConflictException('Driver with this license number, email, or phone already exists');
    }

    return this.driversRepository.create(createDriverDto);
  }

  async findAll(): Promise<Driver[]> {
    return this.driversRepository.findAll({
      include: ['trips'],
      order: [['createdAt', 'DESC']],
    });
  }

  async findActive(): Promise<Driver[]> {
    return this.driversRepository.findAll({
      where: { isActive: true },
      order: [['fullName', 'ASC']],
    });
  }

  async findById(id: string): Promise<Driver> {
    const driver = await this.driversRepository.findByPk(id, {
      include: ['trips'],
    });

    if (!driver) {
      throw new NotFoundException('Driver not found');
    }

    return driver;
  }

  async update(id: string, updateDriverDto: UpdateDriverDto): Promise<Driver> {
    const driver = await this.findById(id);

    // Check for unique constraints
    if (updateDriverDto.licenseNumber && updateDriverDto.licenseNumber !== driver.licenseNumber) {
      const existingDriver = await this.driversRepository.findOne({
        where: { licenseNumber: updateDriverDto.licenseNumber },
      });
      if (existingDriver) {
        throw new ConflictException('Driver with this license number already exists');
      }
    }

    if (updateDriverDto.email && updateDriverDto.email !== driver.email) {
      const existingDriver = await this.driversRepository.findOne({
        where: { email: updateDriverDto.email },
      });
      if (existingDriver) {
        throw new ConflictException('Driver with this email already exists');
      }
    }

    if (updateDriverDto.phoneNumber && updateDriverDto.phoneNumber !== driver.phoneNumber) {
      const existingDriver = await this.driversRepository.findOne({
        where: { phoneNumber: updateDriverDto.phoneNumber },
      });
      if (existingDriver) {
        throw new ConflictException('Driver with this phone number already exists');
      }
    }

    await driver.update(updateDriverDto);
    return driver;
  }

  async remove(id: string): Promise<void> {
    const driver = await this.findById(id);
    await driver.destroy();
  }

  async deactivate(id: string): Promise<Driver> {
    return this.update(id, { isActive: false });
  }

  async activate(id: string): Promise<Driver> {
    return this.update(id, { isActive: true });
  }

  async updateEarnings(id: string, amount: number): Promise<Driver> {
    const driver = await this.findById(id);
    driver.totalEarnings = Number(driver.totalEarnings) + amount;
    await driver.save();
    return driver;
  }
}