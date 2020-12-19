import { applyDecorators, SetMetadata, UseGuards } from "@nestjs/common";
import { ConfirmedGuard } from "../guards/confirmed.guard";
import { GqlAuthGuard } from "../guards/gql-auth.guard";
import { RolesGuard } from "../guards/roles.guard";

export function Auth(...roles: string[]) {
  return applyDecorators(
    SetMetadata("roles", roles),
    UseGuards(GqlAuthGuard, ConfirmedGuard, RolesGuard)
  );
}
