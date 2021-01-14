import { applyDecorators, SetMetadata, UseGuards } from "@nestjs/common";
import { ConfirmedGuard, GqlAuthGuard, RolesGuard } from "../guards";

export function Auth(...roles: string[]) {
  return applyDecorators(
    SetMetadata("roles", roles),
    UseGuards(GqlAuthGuard, ConfirmedGuard, RolesGuard)
  );
}
