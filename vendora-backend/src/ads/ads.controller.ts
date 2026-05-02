import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Param,
  Delete,
} from '@nestjs/common';
import { AdsService } from './ads.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { AdTier, UserRole } from '@prisma/client';

@Controller('ads')
export class AdsController {
  constructor(private adsService: AdsService) {}

  // --- Admin Endpoints ---

  @Post('config')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async updateConfig(
    @Body()
    dto: {
      tier: AdTier;
      basePrice: number;
      peakMultiplier: number;
      peakDays: number[];
    },
  ) {
    // Logic to upsert config (moved to service)
    return this.adsService.upsertConfig(dto);
  }

  @Post('events')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async createEvent(
    @Body()
    dto: {
      name: string;
      startDate: string;
      endDate: string;
      multiplier: number;
    },
  ) {
    return this.adsService.createEvent(dto);
  }

  // --- Public/Vendor Endpoints ---

  @Post('estimate')
  async estimate(
    @Body('tier') tier: AdTier,
    @Body('startDate') startDate: string,
    @Body('endDate') endDate: string,
  ) {
    return {
      estimatedPrice: await this.adsService.calculatePrice(
        tier,
        startDate,
        endDate,
      ),
    };
  }

  @Post('schedule')
  @UseGuards(JwtAuthGuard)
  async schedule(
    @Body('productId') productId: string,
    @Body('tier') tier: AdTier,
    @Body('startDate') startDate: string,
    @Body('endDate') endDate: string,
  ) {
    return this.adsService.createAdSchedule(
      productId,
      tier,
      new Date(startDate),
      new Date(endDate),
    );
  }
}
