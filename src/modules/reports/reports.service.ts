import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Trip } from '@/modules/trips/entities/trip.entity';
import { TripExpense } from '@/modules/trips/entities/trip-expense.entity';
import { Driver } from '@/modules/drivers/entities/driver.entity';
import { Truck } from '@/modules/trucks/entities/truck.entity';
import { Client } from '@/modules/clients/entities/client.entity';
import { 
  ReportQueryDto, 
  DriverReportDto, 
  TruckReportDto, 
  ClientReportDto,
  ReportPeriod 
} from './dto/report.dto';
import { TripStatus } from '@/common/enums';

@Injectable()
export class ReportsService {
  constructor(
    @InjectModel(Trip)
    private tripsRepository: typeof Trip,
    @InjectModel(TripExpense)
    private tripExpensesRepository: typeof TripExpense,
    @InjectModel(Driver)
    private driversRepository: typeof Driver,
    @InjectModel(Truck)
    private trucksRepository: typeof Truck,
    @InjectModel(Client)
    private clientsRepository: typeof Client,
  ) {}

  private getDateRange(query: ReportQueryDto): { startDate: Date; endDate: Date } {
    const now = new Date();
    let startDate: Date;
    let endDate: Date;

    if (query.period === ReportPeriod.CUSTOM && query.startDate && query.endDate) {
      startDate = new Date(query.startDate);
      endDate = new Date(query.endDate);
    } else if (query.period === ReportPeriod.YEARLY || query.year) {
      const year = query.year || now.getFullYear();
      startDate = new Date(year, 0, 1);
      endDate = new Date(year, 11, 31, 23, 59, 59);
    } else if (query.period === ReportPeriod.MONTHLY || query.month) {
      const year = query.year || now.getFullYear();
      const month = query.month ? query.month - 1 : now.getMonth();
      startDate = new Date(year, month, 1);
      endDate = new Date(year, month + 1, 0, 23, 59, 59);
    } else {
      // Default to current month
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    }

    return { startDate, endDate };
  }

  async getDriverReports(query: ReportQueryDto): Promise<DriverReportDto[]> {
    const { startDate, endDate } = this.getDateRange(query);

    const drivers = await this.driversRepository.findAll({
      where: { isActive: true },
    });

    const reports: DriverReportDto[] = [];

    for (const driver of drivers) {
      const trips = await this.tripsRepository.findAll({
        where: {
          driverId: driver.id,
          status: TripStatus.COMPLETED,
          actualArrivalDate: {
            [Op.between]: [startDate, endDate],
          },
        },
        include: [{ model: TripExpense, as: 'expenses' }],
      });

      const totalTrips = trips.length;
      const totalRevenue = trips.reduce((sum, trip) => sum + Number(trip.revenue), 0);
      const totalExpenses = trips.reduce((sum, trip) => 
        sum + trip.expenses.reduce((expSum, exp) => expSum + Number(exp.amount), 0), 0
      );
      const totalDistance = trips.reduce((sum, trip) => sum + Number(trip.distance), 0);

      reports.push({
        driverId: driver.id,
        driverName: driver.fullName,
        driverEmail: driver.email,
        totalTrips,
        totalRevenue,
        totalExpenses,
        netProfit: totalRevenue - totalExpenses,
        totalDistance,
        averageRevenuePerTrip: totalTrips > 0 ? totalRevenue / totalTrips : 0,
      });
    }

    return reports.sort((a, b) => b.totalRevenue - a.totalRevenue);
  }

  async getTruckReports(query: ReportQueryDto): Promise<TruckReportDto[]> {
    const { startDate, endDate } = this.getDateRange(query);

    const trucks = await this.trucksRepository.findAll();

    const reports: TruckReportDto[] = [];

    for (const truck of trucks) {
      const trips = await this.tripsRepository.findAll({
        where: {
          truckId: truck.id,
          status: TripStatus.COMPLETED,
          actualArrivalDate: {
            [Op.between]: [startDate, endDate],
          },
        },
        include: [{ model: TripExpense, as: 'expenses' }],
      });

      const totalTrips = trips.length;
      const totalRevenue = trips.reduce((sum, trip) => sum + Number(trip.revenue), 0);
      const totalExpenses = trips.reduce((sum, trip) => 
        sum + trip.expenses.reduce((expSum, exp) => expSum + Number(exp.amount), 0), 0
      );
      const totalUsage = trips.reduce((sum, trip) => sum + Number(trip.distance), 0);

      // Calculate utilization rate (assuming 30 days in period and 8 hours per day)
      const periodDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      const maxPossibleHours = periodDays * 8;
      const actualHours = trips.reduce((sum, trip) => {
        if (trip.actualDepartureDate && trip.actualArrivalDate) {
          const duration = new Date(trip.actualArrivalDate).getTime() - new Date(trip.actualDepartureDate).getTime();
          return sum + (duration / (1000 * 60 * 60)); // Convert to hours
        }
        return sum;
      }, 0);
      const utilizationRate = maxPossibleHours > 0 ? (actualHours / maxPossibleHours) * 100 : 0;

      reports.push({
        truckId: truck.id,
        licensePlate: truck.licensePlate,
        makeModel: `${truck.make} ${truck.model}`,
        totalTrips,
        totalUsage,
        totalRevenue,
        totalExpenses,
        netProfit: totalRevenue - totalExpenses,
        utilizationRate: Math.min(utilizationRate, 100),
        averageRevenuePerTrip: totalTrips > 0 ? totalRevenue / totalTrips : 0,
      });
    }

    return reports.sort((a, b) => b.totalRevenue - a.totalRevenue);
  }

  async getClientReports(query: ReportQueryDto): Promise<ClientReportDto[]> {
    const { startDate, endDate } = this.getDateRange(query);

    const clients = await this.clientsRepository.findAll({
      where: { isActive: true },
    });

    const reports: ClientReportDto[] = [];

    for (const client of clients) {
      const trips = await this.tripsRepository.findAll({
        where: {
          clientId: client.id,
          status: TripStatus.COMPLETED,
          actualArrivalDate: {
            [Op.between]: [startDate, endDate],
          },
        },
        include: [{ model: TripExpense, as: 'expenses' }],
      });

      const totalTrips = trips.length;
      const totalRevenue = trips.reduce((sum, trip) => sum + Number(trip.revenue), 0);
      const totalExpenses = trips.reduce((sum, trip) => 
        sum + trip.expenses.reduce((expSum, exp) => expSum + Number(exp.amount), 0), 0
      );

      // Generate monthly breakdown if it's a yearly report
      let monthlyBreakdown: Array<{ month: string; trips: number; revenue: number; expenses: number }> | undefined;
      
      if (query.period === ReportPeriod.YEARLY || query.year) {
        monthlyBreakdown = [];
        for (let month = 0; month < 12; month++) {
          const monthStart = new Date(startDate.getFullYear(), month, 1);
          const monthEnd = new Date(startDate.getFullYear(), month + 1, 0, 23, 59, 59);
          
          const monthTrips = trips.filter(trip => {
            const tripDate = new Date(trip.actualArrivalDate);
            return tripDate >= monthStart && tripDate <= monthEnd;
          });

          const monthRevenue = monthTrips.reduce((sum, trip) => sum + Number(trip.revenue), 0);
          const monthExpenses = monthTrips.reduce((sum, trip) => 
            sum + trip.expenses.reduce((expSum, exp) => expSum + Number(exp.amount), 0), 0
          );

          monthlyBreakdown.push({
            month: monthStart.toLocaleString('default', { month: 'long' }),
            trips: monthTrips.length,
            revenue: monthRevenue,
            expenses: monthExpenses,
          });
        }
      }

      reports.push({
        clientId: client.id,
        clientName: client.companyName,
        clientEmail: client.email,
        totalTrips,
        totalRevenue,
        totalExpenses,
        netProfit: totalRevenue - totalExpenses,
        averageRevenuePerTrip: totalTrips > 0 ? totalRevenue / totalTrips : 0,
        monthlyBreakdown,
      });
    }

    return reports.sort((a, b) => b.totalRevenue - a.totalRevenue);
  }

  async getDashboardSummary(): Promise<any> {
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    // Get current month statistics
    const currentMonthTrips = await this.tripsRepository.findAll({
      where: {
        status: TripStatus.COMPLETED,
        actualArrivalDate: {
          [Op.between]: [currentMonthStart, currentMonthEnd],
        },
      },
      include: [{ model: TripExpense, as: 'expenses' }],
    });

    const totalRevenue = currentMonthTrips.reduce((sum, trip) => sum + Number(trip.revenue), 0);
    const totalExpenses = currentMonthTrips.reduce((sum, trip) => 
      sum + trip.expenses.reduce((expSum, exp) => expSum + Number(exp.amount), 0), 0
    );

    // Get active counts
    const [activeDrivers, activeTrucks, activeClients, totalTrips] = await Promise.all([
      this.driversRepository.count({ where: { isActive: true } }),
      this.trucksRepository.count({ where: { isAvailable: true } }),
      this.clientsRepository.count({ where: { isActive: true } }),
      this.tripsRepository.count(),
    ]);

    return {
      currentMonth: {
        totalTrips: currentMonthTrips.length,
        totalRevenue,
        totalExpenses,
        netProfit: totalRevenue - totalExpenses,
      },
      totals: {
        activeDrivers,
        activeTrucks,
        activeClients,
        totalTrips,
      },
    };
  }
}