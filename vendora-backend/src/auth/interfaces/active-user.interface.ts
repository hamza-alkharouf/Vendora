import { UserRole } from '@prisma/client';

export interface ActiveUser {
  userId: string;
  phone: string;
  role: UserRole;
}
