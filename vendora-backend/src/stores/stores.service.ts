import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StoresService {
  constructor(private prisma: PrismaService) {}

  async createStore(userId: string, name: string) {
    return this.prisma.store.create({
      data: {
        name,
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
}
