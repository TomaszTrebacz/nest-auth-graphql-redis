<p align="center">
  <a href="https://github.com/TomaszTrebacz/nest-auth-graphql-redis/packages/541967"><img src="https://i.postimg.cc/NG61WrJS/logo.png" alt="Package Logo" /></a>
   <h1 align="center">Nest Auth GraphQL Redis</h1>
</p>

## Description

`nest-auth-graphql-redis` is package which help you handling authentication & authorization using redis database, especially in apps with microservices based architecture.

## Getting started

- Create .env file with necessary variables:

```
ACCESS_JWT_SECRET=
ACCESS_JWT_EXP=
REDIS_HOST=
REDIS_PORT=
REDIS_DB=
REDIS_PASSWORD=
```

- Install package:

```ts
npm install @tomasztrebacz/nest-auth-graphql-redis
```

- Create following files in ./config directory:

```ts
// redis.config.ts

export default registerAs("redis", () => ({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT),
  db: parseInt(process.env.REDIS_DB),
  password: process.env.REDIS_PASSWORD,
}));

// jwt.config.ts

export default registerAs("jwt", () => ({
  secret: process.env.ACCESS_JWT_SECRET,
  signOptions: { expiresIn: process.env.ACCESS_JWT_EXP },
}));
```

- Import them & package in main module

```ts
imports: [
  ConfigModule.forRoot({
    isGlobal: true,
    load: [redisConfig, jwtConfig],
  }),
  AuthGraphqlRedisModule,
];
```

- Inject needed parts, for example:

```ts
import { Injectable } from "@nestjs/common";
import {
  AuthGqlRedisService,
  RedisHandlerService,
} from "@tomasztrebacz/nest-auth-graphql-redis";

@Injectable()
export class xyzService {
  constructor(
    private authGqlRedisService: AuthGqlRedisService,
    private redisHandlerService: RedisHandlerService
  ) {}
}
```

## Usage

- ### Guards & Decorators

  - GqlAuthGuard & Current User  
    `check if the user is logged & exist in db and get his/her data`

  ```ts
  @Query('currentUser')
  @UseGuards(GqlAuthGuard)
  async currentUser(@CurrentUser() user: User) {
    return await this.usersService.findOneById(user.id);
  }
  ```

  - RolesGuard & Roles  
    `check if the user match given role in decorator`

  ```ts
  @Query('users')
  @Roles(userRole.ADMIN, userRole.ROOT)
  @UseGuards(GqlAuthGuard, RolesGuard)
  findAll() {
    return this.usersService.findAll();
  }
  ```

- ### Tokens

  - create access token (due to security reasons we reduce payload to `user id`)

  ```ts
  const accessToken = await this.authGqlRedisService.createDefaultJWT(user.id);
  ```

  - create custom tokens with necessary secret, exp date and informations provided in payload (in this example we will create refresh token)

  ```ts
  const payload = {
    id: user.id,
    count: user.count,
  };

  const refreshToken = await this.authGqlRedisService.createJWT(
    payload,
    process.env.REFRESH_JWT_SECRET,
    process.env.REFRESH_JWT_EXP
  );
  ```

  - verify token

  ```ts
  const { id } = await this.authGqlRedisService.verifyToken(
    exampleToken,
    process.env.EXAMPLE_JWT_SECRET
  );
  ```

- ### Redis

  - `setUser`  
    comprehensive function for saving new user in database
    and create/update fields for purposes
    like reset password, refresh token etc.

    ```ts
    const userProperties = new Map<string, string>([
      ["role", "batman"],
      ["count", "0"],
      ["confirmed", "false"],
      ["confirmtoken", "eyJhbGciOiJ[...]"],
    ]);

    await this.redisHandler.setUser(id, userProperties);
    ```

    <i>note: all values in redis are stored as strings</i>

  - `getFields`

    ```ts
    const keys: string[] = ["role", "count"];
    const user = await this.redisHandler.getFields(id, keys);
    ```

  - `userExists`

    ```ts
    await this.redisHandler.userExists(decodedJWT.id);
    ```

  - `getValue`

    ```ts
    const actualRole = await this.redisHandler.getValue(id, "role");
    ```

  - `deleteField`

    ```ts
    await this.redisHandler.deleteField(id, "confirmtoken");
    ```

  - `deleteUser`
    ```ts
    await this.redisHandler.deleteUser(id);
    ```

## Real life scenario

- Visit <a href="https://github.com/tomasztrebacz">my profile</a> to see how to seize the opportunities of this package by adding functionalities like reset password by email/phone, confirmation link, refresh token etc.

## Resources

- <a href="https://dev.to/nestjs/publishing-nestjs-packages-with-npm-21fm">Publishing NestJS Packages with npm | Author: John Biundo</a>

## License

- [MIT](https://github.com/TomaszTrebacz/nest-auth-graphql-redis/blob/master/LICENSE.md)
