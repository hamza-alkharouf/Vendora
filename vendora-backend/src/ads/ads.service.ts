import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AdSchedule, AdTier } from '@prisma/client';

@Injectable()
export class AdsService {
  constructor(private prisma: PrismaService) {}

  async calculatePrice(
    tier: AdTier,
    startDate: string | Date,
    endDate: string | Date,
  ): Promise<number> {
    const start = new Date(startDate);
    const end = new Date(endDate);

    // 1. Fetch Config from DB
    const config = await this.prisma.adPricingConfig.findUnique({
      where: { tier },
    });

    if (!config) {
      throw new BadRequestException(
        `No pricing configuration found for tier: ${tier}`,
      );
    }

    // 2. Fetch overlapping events from DB
    const events = await this.prisma.peakPriceEvent.findMany({
      where: {
        OR: [{ startDate: { lte: end }, endDate: { gte: start } }],
      },
    });

    let maxMultiplier = 1.0;

    // 3. Check Recurring Days (from Config)
    const current = new Date(start);
    while (current <= end) {
      const day = current.getDay();
      if (config.peakDays.includes(day)) {
        maxMultiplier = Math.max(maxMultiplier, config.peakMultiplier);
      }
      current.setDate(current.getDate() + 1);
    }

    // 4. Check Special Events (from DB)
    for (const event of events) {
      maxMultiplier = Math.max(maxMultiplier, event.multiplier);
    }

    return config.basePrice * maxMultiplier;
  }

  async createAdSchedule(
    productId: string,
    tier: AdTier,
    startDate: Date,
    endDate: Date,
  ): Promise<AdSchedule> {
    const pricePaid = await this.calculatePrice(tier, startDate, endDate);

    return this.prisma.adSchedule.create({
      data: {
        productId,
        tier,
        startDate,
        endDate,
        pricePaid,
      },
    });
  }

  async upsertConfig(dto: {
    tier: AdTier;
    basePrice: number;
    peakMultiplier: number;
    peakDays: number[];
  }) {
    return this.prisma.adPricingConfig.upsert({
      where: { tier: dto.tier },
      update: dto,
      create: dto,
    });
  }

  async createEvent(dto: {
    name: string;
    startDate: string;
    endDate: string;
    multiplier: number;
  }) {
    return this.prisma.peakPriceEvent.create({
      data: {
        name: dto.name,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        multiplier: dto.multiplier,
      },
    });
  }

  async getActiveBoosts(productIds: string[]): Promise<AdSchedule[]> {
    const now = new Date();
    return this.prisma.adSchedule.findMany({
      where: {
        productId: { in: productIds },
        startDate: { lte: now },
        endDate: { gte: now },
      },
    });
  }
}
