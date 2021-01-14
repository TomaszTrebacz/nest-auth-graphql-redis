import { Injectable, ExecutionContext } from "@nestjs/common";
import { GqlAuthGuard } from "./gql-auth.guard";
import { GqlExecutionContext } from "@nestjs/graphql";

/*
  this guard is useful in scenarios when user want to change properties of other account by mutation,
  e.g, user with admin role provide mutation to API wherein they want to change account of other admin/root
*/
@Injectable()
export class AccessLevelGuard extends GqlAuthGuard {
  async canActivate(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;

    const reqUserRole = await this.RedisHandlerService.getValue(
      request.user.id,
      "role"
    );

    if (reqUserRole == "user") {
      throw new Error("Wrong role!");
    }

    const resUserId = ctx.getArgs().id;

    const resUserRole = await this.RedisHandlerService.getValue(
      resUserId,
      "role"
    );

    if (
      reqUserRole == "admin" &&
      (resUserRole == "admin" || resUserRole == "root")
    ) {
      throw new Error(
        "You can not change any properties of accounts with admin or root permissions!"
      );
    }

    return true;
  }
}
