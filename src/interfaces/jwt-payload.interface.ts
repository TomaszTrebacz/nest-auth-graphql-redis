export interface JwtPayload {
  id: string;
  count?: number;
  code?: number;
  data?: any;
  iat: number;
  exp: number;
}
