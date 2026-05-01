import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Headers,
} from '@nestjs/common';
import { ShippingService } from './shipping.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('shipping')
export class ShippingController {
  constructor(private shippingService: ShippingService) {}

  @Post('zones')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async createZone(@Body('name') name: string) {
    return this.shippingService.createZone(name);
  }

  @Get('zones')
  async getAllZones() {
    return this.shippingService.getAllZones();
  }

  @Post('rates')
  @UseGuards(JwtAuthGuard)
  async upsertRate(
    @Headers('x-store-id') storeId: string,
    @Body('zoneId') zoneId: string,
    @Body('price') price: number,
  ) {
    return this.shippingService.upsertRate(storeId, zoneId, price);
  }

  @Get('my-rates')
  @UseGuards(JwtAuthGuard)
  async getMyRates(@Headers('x-store-id') storeId: string) {
    return this.shippingService.getStoreRates(storeId);
  }
}
