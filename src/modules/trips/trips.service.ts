import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Trip } from './entities/trip.entity';
import { TripExpense } from './entities/trip-expense.entity';
import { CreateTripDto, UpdateTripDto, AddTripExpenseDto } from './dto/trip.dto';
import { TrucksService } from '@/modules/trucks/trucks.service';
import { DriversService } from '@/modules/drivers/drivers.service';
import { ClientsService } from '@/modules/clients/clients.service';
import { TripStatus } from '@/common/enums';

@Injectable()
export class TripsService {
  constructor(
    @InjectModel(Trip)
    private tripsRepository: typeof Trip,
    @InjectModel(TripExpense)
    private tripExpensesRepository: typeof TripExpense,
    private trucksService: TrucksService,
    private driversService: DriversService,
    private clientsService: ClientsService,
  ) {}

  async create(createTripDto: CreateTripDto): Promise<Trip> {
    // Check if trip number already exists
    const existingTrip = await this.tripsRepository.findOne({
      where: { tripNumber: createTripDto.tripNumber },
    });

    if (existingTrip) {
      throw new ConflictException('Trip with this trip number already exists');
    }

    // Validate truck exists and is available
    const truck = await this.trucksService.findById(createTripDto.truckId);
    if (!truck.isAvailable) {
      throw new BadRequestException('Selected truck is not available');
    }

    // Validate driver exists and is active
    const driver = await this.driversService.findById(createTripDto.driverId);
    if (!driver.isActive) {
      throw new BadRequestException('Selected driver is not active');
    }

    // Validate client exists and is active
    const client = await this.clientsService.findById(createTripDto.clientId);
    if (!client.isActive) {
      throw new BadRequestException('Selected client is not active');
    }

    const { expenses, ...tripData } = createTripDto;
    const trip = await this.tripsRepository.create(tripData);

    // Create expenses if provided
    if (expenses && expenses.length > 0) {
      const tripExpenses = expenses.map(expense => ({
        ...expense,
        tripId: trip.id,
      }));
      await this.tripExpensesRepository.bulkCreate(tripExpenses);
    }

    return this.findById(trip.id);
  }

  async findAll(): Promise<Trip[]> {
    return this.tripsRepository.findAll({
      include: ['truck', 'driver', 'client', 'expenses'],
      order: [['createdAt', 'DESC']],
    });
  }

  async findById(id: string): Promise<Trip> {
    const trip = await this.tripsRepository.findByPk(id, {
      include: ['truck', 'driver', 'client', 'expenses'],
    });

    if (!trip) {
      throw new NotFoundException('Trip not found');
    }

    return trip;
  }

  async update(id: string, updateTripDto: UpdateTripDto): Promise<Trip> {
    const trip = await this.findById(id);

    if (updateTripDto.tripNumber && updateTripDto.tripNumber !== trip.tripNumber) {
      const existingTrip = await this.tripsRepository.findOne({
        where: { tripNumber: updateTripDto.tripNumber },
      });
      if (existingTrip) {
        throw new ConflictException('Trip with this trip number already exists');
      }
    }

    // Validate truck if being changed
    if (updateTripDto.truckId && updateTripDto.truckId !== trip.truckId) {
      const truck = await this.trucksService.findById(updateTripDto.truckId);
      if (!truck.isAvailable) {
        throw new BadRequestException('Selected truck is not available');
      }
    }

    // Validate driver if being changed
    if (updateTripDto.driverId && updateTripDto.driverId !== trip.driverId) {
      const driver = await this.driversService.findById(updateTripDto.driverId);
      if (!driver.isActive) {
        throw new BadRequestException('Selected driver is not active');
      }
    }

    // Validate client if being changed
    if (updateTripDto.clientId && updateTripDto.clientId !== trip.clientId) {
      const client = await this.clientsService.findById(updateTripDto.clientId);
      if (!client.isActive) {
        throw new BadRequestException('Selected client is not active');
      }
    }

    await trip.update(updateTripDto);
    return this.findById(id);
  }

  async remove(id: string): Promise<void> {
    const trip = await this.findById(id);
    await trip.destroy();
  }

  async startTrip(id: string): Promise<Trip> {
    const trip = await this.findById(id);
    
    if (trip.status !== TripStatus.PLANNED) {
      throw new BadRequestException('Trip can only be started from planned status');
    }

    return this.update(id, {
      status: TripStatus.IN_PROGRESS,
      actualStartDate: new Date().toISOString(),
    });
  }

  async completeTrip(id: string): Promise<Trip> {
    const trip = await this.findById(id);
    
    if (trip.status !== TripStatus.IN_PROGRESS) {
      throw new BadRequestException('Trip can only be completed from in-progress status');
    }

    const completedTrip = await this.update(id, {
      status: TripStatus.COMPLETED,
      actualEndDate: new Date().toISOString(),
    });

    // Update truck mileage
    await this.trucksService.updateMileage(trip.truckId, Number(trip.distance));

    // Update driver earnings (assuming 10% of revenue)
    const driverEarnings = Number(trip.revenue) * 0.1;
    await this.driversService.updateEarnings(trip.driverId, driverEarnings);

    // Update client revenue
    await this.clientsService.updateRevenue(trip.clientId, Number(trip.revenue));

    return completedTrip;
  }

  async cancelTrip(id: string): Promise<Trip> {
    return this.update(id, { status: TripStatus.CANCELLED });
  }

  async addExpense(tripId: string, addTripExpenseDto: AddTripExpenseDto): Promise<TripExpense> {
    const trip = await this.findById(tripId);
    
    return this.tripExpensesRepository.create({
      ...addTripExpenseDto,
      tripId: trip.id,
    });
  }

  async removeExpense(tripId: string, expenseId: string): Promise<void> {
    const expense = await this.tripExpensesRepository.findOne({
      where: { id: expenseId, tripId },
    });

    if (!expense) {
      throw new NotFoundException('Expense not found');
    }

    await expense.destroy();
  }
}