import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class TokenService {
  constructor(private jwtService: JwtService) {}

  // secret & exp is setted in auth.module.ts in config env
  createDefaultJWT(payload) {
    return this.jwtService.sign(payload);
  }

  // used for custom tokens, like refresh or confirm token
  createJWT(payload, secret, expiresIn) {
    return this.jwtService.sign(payload, {
      secret: secret,
      expiresIn: expiresIn,
    });
  }

  verifyToken(token, secret) {
    return this.jwtService.verify(token, secret);
  }
}
