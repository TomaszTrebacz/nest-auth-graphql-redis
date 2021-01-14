import { SetMetadata } from "@nestjs/common";
import { userRole } from "../enums";

export const Roles = (...roles: userRole[]) => SetMetadata("roles", roles);
