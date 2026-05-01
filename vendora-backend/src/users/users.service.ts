import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOrCreateByPhone(phone: string) {
    let user = await this.prisma.user.findUnique({
      where: { phone: phone },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: { phone: phone },
      });
    }

    return user;
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }
}
