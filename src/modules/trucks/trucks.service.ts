import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Truck } from './entities/truck.entity';
import { CreateTruckDto, UpdateTruckDto } from './dto/truck.dto';
import { TruckStatus } from '@/common/enums';

@Injectable()
export class TrucksService {
  constructor(
    @InjectModel(Truck)
    private trucksRepository: typeof Truck,
  ) {}

  async create(createTruckDto: CreateTruckDto): Promise<Truck> {
    // Check if license plate already exists
    const existingLicensePlate = await this.trucksRepository.findOne({
      where: { licensePlate: createTruckDto.licensePlate },
    });

    if (existingLicensePlate) {
      throw new ConflictException('Truck with this license plate already exists');
    }

    // Check if VIN already exists
    const existingVin = await this.trucksRepository.findOne({
      where: { vin: createTruckDto.vin },
    });

    if (existingVin) {
      throw new ConflictException('Truck with this VIN already exists');
    }

    return this.trucksRepository.create(createTruckDto);
  }

  async findAll(): Promise<Truck[]> {
    return this.trucksRepository.findAll({
      order: [['createdAt', 'DESC']],
    });
  }

  async findAvailable(): Promise<Truck[]> {
    return this.trucksRepository.findAll({
      where: { 
        isAvailable: true,
        status: TruckStatus.AVAILABLE 
      },
      order: [['createdAt', 'DESC']],
    });
  }

  async findById(id: string): Promise<Truck> {
    const truck = await this.trucksRepository.findByPk(id);

    if (!truck) {
      throw new NotFoundException('Truck not found');
    }

    return truck;
  }

  async update(id: string, updateTruckDto: UpdateTruckDto): Promise<Truck> {
    const truck = await this.findById(id);

    // Check if license plate is being changed and if it already exists
    if (updateTruckDto.licensePlate && updateTruckDto.licensePlate !== truck.licensePlate) {
      const existingLicensePlate = await this.trucksRepository.findOne({
        where: { licensePlate: updateTruckDto.licensePlate },
      });
      if (existingLicensePlate) {
        throw new ConflictException('Truck with this license plate already exists');
      }
    }

    // Check if VIN is being changed and if it already exists
    if (updateTruckDto.vin && updateTruckDto.vin !== truck.vin) {
      const existingVin = await this.trucksRepository.findOne({
        where: { vin: updateTruckDto.vin },
      });
      if (existingVin) {
        throw new ConflictException('Truck with this VIN already exists');
      }
    }

    await truck.update(updateTruckDto);
    return truck;
  }

  async remove(id: string): Promise<void> {
    const truck = await this.findById(id);
    await truck.destroy();
  }

  async deactivate(id: string): Promise<Truck> {
    return this.update(id, { 
      isAvailable: false,
      status: TruckStatus.OUT_OF_SERVICE 
    });
  }

  async activate(id: string): Promise<Truck> {
    return this.update(id, { 
      isAvailable: true,
      status: TruckStatus.AVAILABLE 
    });
  }

  async setMaintenanceStatus(id: string): Promise<Truck> {
    return this.update(id, { 
      isAvailable: false,
      status: TruckStatus.MAINTENANCE 
    });
  }

  async updateMileage(id: string, additionalMileage: number): Promise<Truck> {
    const truck = await this.findById(id);
    const newMileage = Number(truck.currentMileage) + additionalMileage;
    return this.update(id, { currentMileage: newMileage });
  }
}