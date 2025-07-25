import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { TrucksService } from './trucks.service';
import { CreateTruckDto, UpdateTruckDto } from './dto/truck.dto';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/modules/auth/guards/roles.guard';
import { Roles } from '@/modules/auth/decorators/roles.decorator';
import { UserRole } from '@/common/enums';

@ApiTags('Trucks')
@Controller('trucks')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class TrucksController {
  constructor(private readonly trucksService: TrucksService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @ApiOperation({ summary: 'Create a new truck' })
  @ApiResponse({ status: 201, description: 'Truck created successfully' })
  @ApiResponse({ status: 409, description: 'Truck with license plate or VIN already exists' })
  create(@Body() createTruckDto: CreateTruckDto) {
    return this.trucksService.create(createTruckDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.STAFF, UserRole.VIEWER)
  @ApiOperation({ summary: 'Get all trucks' })
  @ApiResponse({ status: 200, description: 'Trucks retrieved successfully' })
  findAll() {
    return this.trucksService.findAll();
  }

  @Get('available')
  @Roles(UserRole.ADMIN, UserRole.STAFF, UserRole.VIEWER)
  @ApiOperation({ summary: 'Get available trucks' })
  @ApiResponse({ status: 200, description: 'Available trucks retrieved successfully' })
  findAvailable() {
    return this.trucksService.findAvailable();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.STAFF, UserRole.VIEWER)
  @ApiOperation({ summary: 'Get truck by ID' })
  @ApiResponse({ status: 200, description: 'Truck retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Truck not found' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.trucksService.findById(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @ApiOperation({ summary: 'Update truck' })
  @ApiResponse({ status: 200, description: 'Truck updated successfully' })
  @ApiResponse({ status: 404, description: 'Truck not found' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateTruckDto: UpdateTruckDto) {
    return this.trucksService.update(id, updateTruckDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete truck' })
  @ApiResponse({ status: 200, description: 'Truck deleted successfully' })
  @ApiResponse({ status: 404, description: 'Truck not found' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.trucksService.remove(id);
  }

  @Patch(':id/deactivate')
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @ApiOperation({ summary: 'Deactivate truck' })
  @ApiResponse({ status: 200, description: 'Truck deactivated successfully' })
  deactivate(@Param('id', ParseUUIDPipe) id: string) {
    return this.trucksService.deactivate(id);
  }

  @Patch(':id/activate')
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @ApiOperation({ summary: 'Activate truck' })
  @ApiResponse({ status: 200, description: 'Truck activated successfully' })
  activate(@Param('id', ParseUUIDPipe) id: string) {
    return this.trucksService.activate(id);
  }

  @Patch(':id/maintenance')
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @ApiOperation({ summary: 'Set truck to maintenance' })
  @ApiResponse({ status: 200, description: 'Truck set to maintenance successfully' })
  setMaintenance(@Param('id', ParseUUIDPipe) id: string) {
    return this.trucksService.setMaintenanceStatus(id);
  }
}