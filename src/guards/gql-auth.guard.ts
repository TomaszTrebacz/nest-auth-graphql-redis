import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
  Inject,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { GqlExecutionContext } from "@nestjs/graphql";
import { Reflector } from "@nestjs/core";
import { AuthenticationError } from "apollo-server-express";

@Injectable()
export class GqlAuthGuard extends AuthGuard("jwt") {
  constructor(
    @Inject("RedisHandlerService") public readonly RedisHandlerService,
    public reflector: Reflector
  ) {
    super();
  }

  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;

    return request;
  }

  handleRequest(err: any, user: any, payload: any) {
    if (err || !user) {
      throw err || new Error(payload.message);
    }

    return user;
  }
}
