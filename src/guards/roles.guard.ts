import { Injectable, ExecutionContext } from "@nestjs/common";
import { GqlAuthGuard } from "./gql-auth.guard";
import { GqlExecutionContext } from "@nestjs/graphql";
import { userRole } from "../enums";

@Injectable()
export class RolesGuard extends GqlAuthGuard {
  async canActivate(context: ExecutionContext) {
    const roles = this.reflector.get<userRole[]>("roles", context.getHandler());

    // if roles array is empty, we assume that only default user has access
    if (roles.length > 0) {
      const ctx = GqlExecutionContext.create(context);
      const request = ctx.getContext().req;

      const actualRole = await this.RedisHandlerService.getValue(
        request.user.id,
        "role"
      );

      if (!roles.includes(actualRole)) {
        throw new Error("Wrong role!");
      }
    }

    return true;
  }
}
