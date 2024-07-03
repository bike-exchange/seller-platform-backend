import { UserRoles } from "@medusajs/medusa";
import { User } from "../models/user";

export const checkIsAdminUser = (user: User | null): boolean => {
  return user?.role === UserRoles.ADMIN;
};
