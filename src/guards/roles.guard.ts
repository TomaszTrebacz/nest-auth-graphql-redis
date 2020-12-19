import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
  Inject,
} from "@nestjs/common";
import { GqlAuthGuard } from "./gql-auth.guard";
import { Reflector } from "@nestjs/core";
import { GqlExecutionContext } from "@nestjs/graphql";

@Injectable()
export class RolesGuard extends GqlAuthGuard {
  async canActivate(context: ExecutionContext) {
    const roles = this.reflector.get<string[]>("roles", context.getHandler());

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
