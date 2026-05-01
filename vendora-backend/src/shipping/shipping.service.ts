import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ShippingZone, ShippingRate } from '@prisma/client';

@Injectable()
export class ShippingService {
  constructor(private prisma: PrismaService) {}

  async createZone(name: string): Promise<ShippingZone> {
    return this.prisma.shippingZone.create({
      data: { name },
    });
  }

  async getAllZones(): Promise<ShippingZone[]> {
    return this.prisma.shippingZone.findMany();
  }

  async upsertRate(
    storeId: string,
    zoneId: string,
    price: number,
  ): Promise<ShippingRate> {
    return this.prisma.shippingRate.upsert({
      where: {
        storeId_zoneId: { storeId, zoneId },
      },
      update: { price },
      create: { storeId, zoneId, price },
    });
  }

  async getStoreRates(storeId: string): Promise<ShippingRate[]> {
    return this.prisma.shippingRate.findMany({
      where: { storeId },
      include: { zone: true },
    });
  }

  async calculateFee(storeId: string, zoneId: string): Promise<number> {
    const rate = await this.prisma.shippingRate.findUnique({
      where: {
        storeId_zoneId: { storeId, zoneId },
      },
    });

    if (!rate) {
      // Default fallback or error
      return 0;
    }

    return rate.price;
  }
}
