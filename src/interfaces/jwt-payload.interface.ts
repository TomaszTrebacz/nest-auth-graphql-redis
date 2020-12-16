export interface JwtPayload {
  id: string;
  count?: number;
  code?: number;
  iat: number;
  exp: number;
}
