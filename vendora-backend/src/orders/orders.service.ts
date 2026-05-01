import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Order, PaymentMethod } from '@prisma/client';
import { ShippingService } from '../shipping/shipping.service';

export interface CreateOrderDto {
  shippingZoneId: string;
  paymentMethod: PaymentMethod;
  items: {
    productId: string;
    quantity: number;
  }[];
}

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private shippingService: ShippingService,
  ) {}

  async createOrder(customerId: string, dto: CreateOrderDto): Promise<Order> {
    return this.prisma.$transaction(async (tx) => {
      // 1. Fetch product details
      const productIds = dto.items.map((i) => i.productId);
      const products = await tx.product.findMany({
        where: { id: { in: productIds } },
      });

      if (products.length !== dto.items.length) {
        throw new BadRequestException('One or more products not found');
      }

      // 2. Map items to product data
      const itemsWithDetails = dto.items.map((item) => {
        const product = products.find((p) => p.id === item.productId);
        if (!product) throw new BadRequestException('Product mismatch');
        return {
          ...item,
          price: product.price,
          storeId: product.storeId,
        };
      });

      // 3. Group by storeId
      const storeGroups = itemsWithDetails.reduce(
        (acc, item) => {
          if (!acc[item.storeId]) acc[item.storeId] = [];
          acc[item.storeId].push(item);
          return acc;
        },
        {} as Record<string, typeof itemsWithDetails>,
      );

      // 4. Calculate Subtotals and Shipping Fees
      let totalProductsPrice = 0;
      let totalShippingFees = 0;
      const storeCalculations: Record<
        string,
        { subTotal: number; shippingFee: number }
      > = {};

      for (const [storeId, items] of Object.entries(storeGroups)) {
        const subTotal = items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0,
        );
        const shippingFee = await this.shippingService.calculateFee(
          storeId,
          dto.shippingZoneId,
        );

        storeCalculations[storeId] = { subTotal, shippingFee };
        totalProductsPrice += subTotal;
        totalShippingFees += shippingFee;
      }

      // 5. Create Parent Order
      const parentOrder = await tx.order.create({
        data: {
          customerId,
          shippingZoneId: dto.shippingZoneId,
          paymentMethod: dto.paymentMethod,
          totalPrice: totalProductsPrice + totalShippingFees,
        },
      });

      // 6. Create SubOrders and Items
      for (const [storeId, items] of Object.entries(storeGroups)) {
        const { subTotal, shippingFee } = storeCalculations[storeId];

        const subOrder = await tx.subOrder.create({
          data: {
            orderId: parentOrder.id,
            storeId,
            subTotal,
            shippingFeeCharged: shippingFee,
          },
        });

        await tx.orderItem.createMany({
          data: items.map((item) => ({
            subOrderId: subOrder.id,
            productId: item.productId,
            quantity: item.quantity,
            priceAtPurchase: item.price,
          })),
        });
      }

      return parentOrder;
    });
  }

  async findMyOrders(customerId: string) {
    return this.prisma.order.findMany({
      where: { customerId },
      include: { subOrders: { include: { items: true } } },
    });
  }

  async findStoreOrders(storeId: string) {
    return this.prisma.subOrder.findMany({
      where: { storeId },
      include: { items: { include: { product: true } } },
    });
  }
}
