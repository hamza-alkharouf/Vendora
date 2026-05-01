import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Product } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(
    storeId: string,
    data: { title: Record<string, string>; description?: Record<string, string>; price: number },
  ): Promise<Product> {
    return this.prisma.product.create({
      data: {
        ...data,
        storeId,
      },
    });
  }

  async findAll(storeId?: string): Promise<Product[]> {
    return this.prisma.product.findMany({
      where: storeId ? { storeId } : {},
    });
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async update(
    id: string,
    storeId: string,
    data: Partial<{ title: Record<string, string>; description: Record<string, string>; price: number }>,
  ): Promise<Product> {
    await this.findOne(id); // Ensure exists
    return this.prisma.product.update({
      where: { id, storeId },
      data,
    });
  }

  async remove(id: string, storeId: string): Promise<Product> {
    await this.findOne(id);
    return this.prisma.product.delete({
      where: { id, storeId },
    });
  }
}
