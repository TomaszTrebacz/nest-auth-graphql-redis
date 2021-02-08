import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { userRole } from '../enums';
import { ConfirmedGuard, GqlAuthGuard, RolesGuard } from '../guards';

export function Auth(...roles: userRole[]) {
  return applyDecorators(
    SetMetadata('roles', roles),
    UseGuards(GqlAuthGuard, ConfirmedGuard, RolesGuard),
  );
}
