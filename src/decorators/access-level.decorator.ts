import { applyDecorators, UseGuards } from "@nestjs/common";
import { AccessLevelGuard } from "../guards/access-level.guard";
import { ConfirmedGuard } from "../guards/confirmed.guard";
import { GqlAuthGuard } from "../guards/gql-auth.guard";

export function AccessLevel() {
  return applyDecorators(
    UseGuards(GqlAuthGuard, ConfirmedGuard, AccessLevelGuard)
  );
}
