import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole, Prisma } from '@prisma/client';
import { Request as ExpressRequest } from 'express';

interface RequestWithUser extends ExpressRequest {
  user: { userId: string; role: UserRole; phone: string };
}

@Controller('customer')
@UseGuards(JwtAuthGuard)
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get('me')
  async getProfile(@Request() req: RequestWithUser) {
    return this.customerService.getProfile(req.user.userId);
  }

  @Put('me')
  async updateProfile(
    @Request() req: RequestWithUser,
    @Body() data: Prisma.UserUpdateInput,
  ) {
    return this.customerService.updateProfile(req.user.userId, data);
  }

  @Post('address')
  async addAddress(
    @Request() req: RequestWithUser,
    @Body() data: Prisma.AddressCreateInput,
  ) {
    return this.customerService.addAddress(req.user.userId, data);
  }

  @Delete('address/:id')
  async deleteAddress(
    @Request() req: RequestWithUser,
    @Param('id') id: string,
  ) {
    return this.customerService.deleteAddress(req.user.userId, id);
  }

  // Admin Endpoints
  @Get('admin/list')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async listCustomers() {
    return this.customerService.listAllCustomers();
  }

  @Get('admin/groups')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async getGroups() {
    return this.customerService.getGroups();
  }

  @Post('admin/groups')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async createGroup(
    @Body('name') name: string,
    @Body('metadata') metadata: Prisma.InputJsonValue,
  ) {
    return this.customerService.createGroup(name, metadata);
  }

  @Get('admin/organizations')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async getOrganizations() {
    return this.customerService.getOrganizations();
  }

  @Post('admin/organizations')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async createOrganization(
    @Body('name') name: string,
    @Body('metadata') metadata: Prisma.InputJsonValue,
  ) {
    return this.customerService.createOrganization(name, metadata);
  }
}
