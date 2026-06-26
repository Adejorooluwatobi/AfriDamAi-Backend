import { SetMetadata } from '@nestjs/common';
import { AdminType } from '@prisma/client';

export const Roles = (...roles: AdminType[]) => SetMetadata('roles', roles);
