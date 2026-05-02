import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { SellerService } from './seller.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { StoreMemberGuard } from '../auth/guards/store-member.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole, StoreStatus, MemberRole } from '@prisma/client';
import { Request as ExpressRequest } from 'express';

interface RequestWithUser extends ExpressRequest {
  user: { userId: string; role: UserRole; phone: string };
}

@Controller('seller')
@UseGuards(JwtAuthGuard, RolesGuard, StoreMemberGuard)
export class SellerController {
  constructor(private readonly sellerService: SellerService) {}

  @Get(':storeId')
  @Roles(UserRole.ADMIN, UserRole.SELLER)
  async getSellerInfo(@Param('storeId') storeId: string) {
    return this.sellerService.getSellerInfo(storeId);
  }

  @Put(':storeId/status')
  @Roles(UserRole.ADMIN)
  async updateStatus(
    @Param('storeId') storeId: string,
    @Body('status') status: StoreStatus,
  ) {
    return this.sellerService.updateStoreStatus(storeId, status);
  }

  @Put(':storeId/onboarding')
  @Roles(UserRole.ADMIN, UserRole.SELLER)
  async updateOnboarding(
    @Param('storeId') storeId: string,
    @Body()
    data: {
      storeInformation?: boolean;
      stripeConnection?: boolean;
      locationsShipping?: boolean;
      products?: boolean;
    },
  ) {
    return this.sellerService.updateOnboardingProgress(storeId, data);
  }

  @Post(':storeId/invites')
  @Roles(UserRole.ADMIN, UserRole.SELLER)
  async inviteMember(
    @Param('storeId') storeId: string,
    @Request() req: RequestWithUser,
    @Body('email') email: string,
    @Body('role') role: MemberRole,
  ) {
    return this.sellerService.createInvitation(
      storeId,
      req.user.userId,
      email,
      role,
    );
  }

  @Post('invites/accept')
  async acceptInvite(
    @Request() req: RequestWithUser,
    @Body('token') token: string,
  ) {
    return this.sellerService.acceptInvitation(token, req.user.userId);
  }
}
