import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Query,
  UseGuards,
  Request,
  Param,
} from '@nestjs/common';
import { RequestService } from './request.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole, RequestType, RequestStatus, Prisma } from '@prisma/client';
import { Request as ExpressRequest } from 'express';

interface RequestWithUser extends ExpressRequest {
  user: { userId: string; role: UserRole; phone: string };
}

@Controller('requests')
@UseGuards(JwtAuthGuard)
export class RequestController {
  constructor(private readonly requestService: RequestService) {}

  @Post()
  async submitRequest(
    @Request() req: RequestWithUser,
    @Body('type') type: RequestType,
    @Body('data') data: Prisma.InputJsonValue,
    @Body('storeId') storeId?: string,
  ) {
    return this.requestService.createRequest(
      req.user.userId,
      type,
      data,
      storeId,
    );
  }

  @Get('my-store')
  async listMyStoreRequests(@Query('storeId') storeId: string) {
    return this.requestService.listByStore(storeId);
  }

  // Admin Endpoints
  @Get('admin/all')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async listAll(
    @Query('type') type?: RequestType,
    @Query('status') status?: RequestStatus,
  ) {
    return this.requestService.listAll({ type, status });
  }

  @Put('admin/:id/status')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: RequestStatus,
    @Body('adminNotes') adminNotes?: string,
    @Body('feedback') feedback?: string,
  ) {
    return this.requestService.updateStatus(id, status, adminNotes, feedback);
  }
}
