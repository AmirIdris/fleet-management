import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { TripsService } from './trips.service';
import { CreateTripDto, UpdateTripDto, AddTripExpenseDto } from './dto/trip.dto';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/modules/auth/guards/roles.guard';
import { Roles } from '@/modules/auth/decorators/roles.decorator';
import { CurrentUser } from '@/modules/auth/decorators/current-user.decorator';
import { User } from '@/modules/users/entities/user.entity';
import { UserRole } from '@/common/enums';

@ApiTags('Trips')
@Controller('trips')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class TripsController {
  constructor(private readonly tripsService: TripsService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @ApiOperation({ summary: 'Create a new trip' })
  @ApiResponse({ status: 201, description: 'Trip created successfully' })
  @ApiResponse({ status: 409, description: 'Trip with trip number already exists' })
  @ApiResponse({ status: 400, description: 'Invalid truck, driver, or client' })
  create(@Body() createTripDto: CreateTripDto) {
    return this.tripsService.create(createTripDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.STAFF, UserRole.VIEWER)
  @ApiOperation({ summary: 'Get all trips' })
  @ApiResponse({ status: 200, description: 'Trips retrieved successfully' })
  findAll() {
    return this.tripsService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.STAFF, UserRole.VIEWER)
  @ApiOperation({ summary: 'Get trip by ID' })
  @ApiResponse({ status: 200, description: 'Trip retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Trip not found' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.tripsService.findById(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @ApiOperation({ summary: 'Update trip' })
  @ApiResponse({ status: 200, description: 'Trip updated successfully' })
  @ApiResponse({ status: 404, description: 'Trip not found' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateTripDto: UpdateTripDto) {
    return this.tripsService.update(id, updateTripDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete trip' })
  @ApiResponse({ status: 200, description: 'Trip deleted successfully' })
  @ApiResponse({ status: 404, description: 'Trip not found' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.tripsService.remove(id);
  }

  @Patch(':id/start')
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @ApiOperation({ summary: 'Start trip' })
  @ApiResponse({ status: 200, description: 'Trip started successfully' })
  @ApiResponse({ status: 400, description: 'Trip cannot be started' })
  startTrip(@Param('id', ParseUUIDPipe) id: string) {
    return this.tripsService.startTrip(id);
  }

  @Patch(':id/complete')
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @ApiOperation({ summary: 'Complete trip' })
  @ApiResponse({ status: 200, description: 'Trip completed successfully' })
  @ApiResponse({ status: 400, description: 'Trip cannot be completed' })
  completeTrip(@Param('id', ParseUUIDPipe) id: string) {
    return this.tripsService.completeTrip(id);
  }

  @Patch(':id/cancel')
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @ApiOperation({ summary: 'Cancel trip' })
  @ApiResponse({ status: 200, description: 'Trip cancelled successfully' })
  cancelTrip(@Param('id', ParseUUIDPipe) id: string) {
    return this.tripsService.cancelTrip(id);
  }

  @Post(':id/expenses')
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @ApiOperation({ summary: 'Add expense to trip' })
  @ApiResponse({ status: 201, description: 'Expense added successfully' })
  @ApiResponse({ status: 404, description: 'Trip not found' })
  addExpense(
    @Param('id', ParseUUIDPipe) tripId: string,
    @Body() addTripExpenseDto: AddTripExpenseDto,
  ) {
    return this.tripsService.addExpense(tripId, addTripExpenseDto);
  }

  @Delete(':id/expenses/:expenseId')
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @ApiOperation({ summary: 'Remove expense from trip' })
  @ApiResponse({ status: 200, description: 'Expense removed successfully' })
  @ApiResponse({ status: 404, description: 'Expense not found' })
  removeExpense(
    @Param('id', ParseUUIDPipe) tripId: string,
    @Param('expenseId', ParseUUIDPipe) expenseId: string,
  ) {
    return this.tripsService.removeExpense(tripId, expenseId);
  }
}