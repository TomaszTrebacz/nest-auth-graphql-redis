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
  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    const roles = this.reflector.get<string[]>("roles", context.getHandler());

    if (roles) {
      const ctx = GqlExecutionContext.create(context);
      const request = ctx.getContext().req;

      /*const actualRole = await this.RedisHandlerService.getValue(
        request.user.id,
        "role"
      );
*/
      const actualRole = "user";

      if (!roles.includes(actualRole)) {
        throw new UnauthorizedException("Wrong role!");
      }
    }

    return true;
  }
}
