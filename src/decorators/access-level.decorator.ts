import { applyDecorators, UseGuards } from "@nestjs/common";
import { AccessLevelGuard, ConfirmedGuard, GqlAuthGuard } from "../guards";

export function AccessLevel() {
  return applyDecorators(
    UseGuards(GqlAuthGuard, ConfirmedGuard, AccessLevelGuard)
  );
}
