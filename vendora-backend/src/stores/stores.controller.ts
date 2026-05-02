import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { StoresService } from './stores.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { ActiveUser } from '../auth/interfaces/active-user.interface';
import { UserRole } from '@prisma/client';

@Controller('stores')
@UseGuards(JwtAuthGuard)
export class StoresController {
  constructor(private storesService: StoresService) {}

  @Post()
  async create(@GetUser() user: ActiveUser, @Body('name') name: string) {
    return this.storesService.createStore(user.userId, name);
  }

  @Get('my-stores')
  async getMyStores(@GetUser() user: ActiveUser) {
    return this.storesService.findByUserId(user.userId);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async findAll() {
    return this.storesService.findAll();
  }
}
