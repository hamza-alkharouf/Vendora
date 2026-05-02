import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  RequestType,
  RequestStatus,
  Prisma,
  StoreStatus,
} from '@prisma/client';

interface RequestWithRelations {
  id: string;
  type: RequestType;
  status: RequestStatus;
  submitterId: string;
  storeId: string | null;
  data: Prisma.JsonValue;
  adminNotes: string | null;
  feedback: string | null;
  priority: number;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class RequestService {
  constructor(private prisma: PrismaService) {}

  async createRequest(
    submitterId: string,
    type: RequestType,
    data: Prisma.InputJsonValue,
    storeId?: string,
  ) {
    return this.prisma.marketplaceRequest.create({
      data: {
        type,
        submitterId,
        storeId,
        data,
      },
    });
  }

  async listAll(filters: { type?: RequestType; status?: RequestStatus }) {
    return this.prisma.marketplaceRequest.findMany({
      where: filters,
      include: {
        submitter: {
          select: { id: true, name: true, phone: true },
        },
        store: {
          select: { id: true, name: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async listByStore(storeId: string) {
    return this.prisma.marketplaceRequest.findMany({
      where: { storeId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(
    id: string,
    status: RequestStatus,
    adminNotes?: string,
    feedback?: string,
  ) {
    const request = await this.prisma.marketplaceRequest.findUnique({
      where: { id },
    });
    if (!request) throw new NotFoundException('Request not found');

    // Handle side effects of approval
    if (status === RequestStatus.APPROVED) {
      await this.handleApproval(request);
    }

    return this.prisma.marketplaceRequest.update({
      where: { id },
      data: { status, adminNotes, feedback },
    });
  }

  private async handleApproval(request: RequestWithRelations) {
    switch (request.type) {
      case RequestType.SELLER_REGISTRATION:
        if (request.storeId) {
          await this.prisma.store.update({
            where: { id: request.storeId },
            data: { status: StoreStatus.ACTIVE },
          });
        }
        break;

      case RequestType.PRODUCT_APPROVAL:
        // Logic to activate product or create it from request data
        // const productData = request.data as any;
        break;

      // Other types like RETURN_REQUEST would trigger payment refunds etc.
    }
  }
}
