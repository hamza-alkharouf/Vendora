import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UserRole } from '@prisma/client';
import { Request } from 'express';

interface RequestWithUser extends Request {
  user: { userId: string; role: UserRole; phone: string };
  membership?: unknown;
}

@Injectable()
export class StoreMemberGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;
    const storeId =
      (request.headers['x-store-id'] as string) ||
      (request.params.storeId as string);

    if (!user) {
      return false;
    }

    // Admins can bypass membership check
    if (user.role === UserRole.ADMIN) {
      return true;
    }

    if (!storeId) {
      return false;
    }

    const membership = await this.prisma.storeMember.findUnique({
      where: {
        userId_storeId: {
          userId: user.userId,
          storeId: storeId,
        },
      },
    });

    if (!membership) {
      throw new ForbiddenException('You are not a member of this store');
    }

    // Attach membership to request for later use if needed
    request.membership = membership;

    return true;
  }
}
