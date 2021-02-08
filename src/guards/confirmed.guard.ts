import { Injectable, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { GqlAuthGuard } from './gql-auth.guard';

@Injectable()
export class ConfirmedGuard extends GqlAuthGuard {
  async canActivate(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;
    const userID = request.user.id;

    const isConfirmed = await this.RedisHandlerService.getValue(
      userID,
      'confirmed',
    );

    if (isConfirmed === 'false') {
      throw new Error('User is not confirmed. Please confirm accout');
    }

    return true;
  }
}
