import { registerOverriddenValidators } from "@medusajs/medusa";
import { AdminCreateUserRequest as MedusaAdminCreateUserRequest } from "@medusajs/medusa/dist/api/routes/admin/users/create-user";
import { IsOptional, IsString } from "class-validator";

class AdminCreateUserRequest extends MedusaAdminCreateUserRequest {
  @IsString()
  @IsOptional()
  store_id?: string;
}

registerOverriddenValidators(AdminCreateUserRequest);
