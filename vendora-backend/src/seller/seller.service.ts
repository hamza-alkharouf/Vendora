import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StoreStatus, MemberRole, UserRole } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';

interface OnboardingUpdate {
  storeInformation?: boolean;
  stripeConnection?: boolean;
  locationsShipping?: boolean;
  products?: boolean;
}

interface JwtPayload {
  storeId: string;
  email: string;
  role: MemberRole;
  type: string;
}

@Injectable()
export class SellerService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async getSellerInfo(storeId: string) {
    const store = await this.prisma.store.findUnique({
      where: { id: storeId },
      include: {
        onboarding: true,
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                phone: true,
              },
            },
          },
        },
      },
    });

    if (!store) {
      throw new NotFoundException(`Store with ID ${storeId} not found`);
    }

    return store;
  }

  async updateStoreStatus(storeId: string, status: StoreStatus) {
    return this.prisma.store.update({
      where: { id: storeId },
      data: { status },
    });
  }

  async updateOnboardingProgress(storeId: string, data: OnboardingUpdate) {
    return this.prisma.storeOnboarding.upsert({
      where: { storeId },
      update: data,
      create: {
        storeId,
        ...data,
      },
    });
  }

  async createInvitation(
    storeId: string,
    inviterId: string,
    email: string,
    role: MemberRole,
  ) {
    const store = await this.prisma.store.findUnique({
      where: { id: storeId },
    });
    if (!store) throw new NotFoundException('Store not found');

    const token = this.jwtService.sign(
      { storeId, email, role, type: 'MEMBER_INVITE' },
      { expiresIn: '7d' },
    );

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    return this.prisma.memberInvite.create({
      data: {
        email,
        role,
        token,
        expiresAt,
        storeId,
        invitedBy: inviterId,
      },
    });
  }

  async acceptInvitation(token: string, userId: string) {
    let payload: JwtPayload;
    try {
      payload = this.jwtService.verify(token);
    } catch {
      throw new BadRequestException('Invalid or expired invitation token');
    }

    if (payload.type !== 'MEMBER_INVITE') {
      throw new BadRequestException('Invalid token type');
    }

    const invite = await this.prisma.memberInvite.findUnique({
      where: { token },
    });

    if (!invite || invite.expiresAt < new Date()) {
      throw new BadRequestException('Invitation not found or expired');
    }

    // Use transaction to add member and delete invite
    return this.prisma.$transaction(async (tx) => {
      const member = await tx.storeMember.create({
        data: {
          storeId: invite.storeId,
          userId: userId,
          role: invite.role,
        },
      });

      await tx.memberInvite.delete({
        where: { id: invite.id },
      });

      // Also ensure user has SELLER role
      await tx.user.update({
        where: { id: userId },
        data: { role: UserRole.SELLER },
      });

      return member;
    });
  }
}
