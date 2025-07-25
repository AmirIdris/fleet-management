import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { ReportQueryDto, DriverReportDto, TruckReportDto, ClientReportDto } from './dto/report.dto';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/modules/auth/guards/roles.guard';
import { Roles } from '@/modules/auth/decorators/roles.decorator';
import { UserRole } from '@/common/enums';

@ApiTags('Reports')
@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('drivers')
  @Roles(UserRole.ADMIN, UserRole.STAFF, UserRole.VIEWER)
  @ApiOperation({ 
    summary: 'Get driver-wise reports',
    description: 'Generate reports showing trips, revenue, and expenses for each driver'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Driver reports retrieved successfully',
    type: [DriverReportDto]
  })
  getDriverReports(@Query() query: ReportQueryDto): Promise<DriverReportDto[]> {
    return this.reportsService.getDriverReports(query);
  }

  @Get('trucks')
  @Roles(UserRole.ADMIN, UserRole.STAFF, UserRole.VIEWER)
  @ApiOperation({ 
    summary: 'Get truck-wise reports',
    description: 'Generate reports showing trips, usage, revenue, and expenses for each truck'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Truck reports retrieved successfully',
    type: [TruckReportDto]
  })
  getTruckReports(@Query() query: ReportQueryDto): Promise<TruckReportDto[]> {
    return this.reportsService.getTruckReports(query);
  }

  @Get('clients')
  @Roles(UserRole.ADMIN, UserRole.STAFF, UserRole.VIEWER)
  @ApiOperation({ 
    summary: 'Get client-wise reports',
    description: 'Generate reports showing trips and revenue for each client with monthly/yearly breakdown'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Client reports retrieved successfully',
    type: [ClientReportDto]
  })
  getClientReports(@Query() query: ReportQueryDto): Promise<ClientReportDto[]> {
    return this.reportsService.getClientReports(query);
  }

  @Get('dashboard')
  @Roles(UserRole.ADMIN, UserRole.STAFF, UserRole.VIEWER)
  @ApiOperation({ 
    summary: 'Get dashboard summary',
    description: 'Get overall statistics and current month summary for dashboard'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Dashboard summary retrieved successfully'
  })
  getDashboardSummary() {
    return this.reportsService.getDashboardSummary();
  }
}