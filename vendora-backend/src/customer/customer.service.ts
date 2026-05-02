import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserRole, Prisma } from '@prisma/client';

@Injectable()
export class CustomerService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        addresses: true,
        groups: true,
        organization: true,
      },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateProfile(userId: string, data: Prisma.UserUpdateInput) {
    return this.prisma.user.update({
      where: { id: userId },
      data,
    });
  }

  async addAddress(userId: string, data: Prisma.AddressCreateInput) {
    if (data.isDefaultShipping) {
      await this.prisma.address.updateMany({
        where: { userId, isDefaultShipping: true },
        data: { isDefaultShipping: false },
      });
    }
    if (data.isDefaultBilling) {
      await this.prisma.address.updateMany({
        where: { userId, isDefaultBilling: true },
        data: { isDefaultBilling: false },
      });
    }

    const { user, ...addressData } = data;
    console.log(user); // Just to avoid unused var if it exists in input

    return this.prisma.address.create({
      data: {
        ...addressData,
        user: { connect: { id: userId } },
      },
    });
  }

  async deleteAddress(userId: string, addressId: string) {
    return this.prisma.address.delete({
      where: { id: addressId, userId },
    });
  }

  async getGroups() {
    return this.prisma.customerGroup.findMany({
      include: { _count: { select: { users: true } } },
    });
  }

  async createGroup(name: string, metadata?: Prisma.InputJsonValue) {
    return this.prisma.customerGroup.create({
      data: { name, metadata },
    });
  }

  async addToGroup(groupId: string, userId: string) {
    return this.prisma.customerGroup.update({
      where: { id: groupId },
      data: {
        users: {
          connect: { id: userId },
        },
      },
    });
  }

  async getOrganizations() {
    return this.prisma.organization.findMany({
      include: { _count: { select: { members: true } } },
    });
  }

  async createOrganization(name: string, metadata?: Prisma.InputJsonValue) {
    return this.prisma.organization.create({
      data: { name, metadata },
    });
  }

  async addMemberToOrganization(orgId: string, userId: string) {
    return this.prisma.organization.update({
      where: { id: orgId },
      data: {
        members: {
          connect: { id: userId },
        },
      },
    });
  }

  async listAllCustomers() {
    return this.prisma.user.findMany({
      where: { role: UserRole.CUSTOMER },
      include: {
        groups: true,
        _count: { select: { orders: true } },
      },
    });
  }
}
