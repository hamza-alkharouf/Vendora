import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StoresService {
  constructor(private prisma: PrismaService) {}

  async createStore(userId: string, name: string) {
    const handle = name.toLowerCase().replace(/ /g, '-');
    return this.prisma.store.create({
      data: {
        name,
        handle,
        members: {
          create: {
            userId,
            role: 'OWNER',
          },
        },
      },
    });
  }

  async findByUserId(userId: string) {
    return this.prisma.store.findMany({
      where: {
        members: {
          some: {
            userId,
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.store.findMany({
      include: {
        onboarding: true,
        _count: {
          select: { products: true, members: true },
        },
      },
    });
  }
}
