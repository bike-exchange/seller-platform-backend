import { registerOverriddenValidators } from "@medusajs/medusa";
import { AdminCreateUserRequest as MedusaAdminCreateUserRequest } from "@medusajs/medusa/dist/api/routes/admin/users/create-user";
import { AdminPostStoreReq as MedusaAdminPostStoreReq } from "@medusajs/medusa/dist/api/routes/admin/store/update-store";
import { ArrayMaxSize, IsOptional, IsString } from "class-validator";

class AdminCreateUserRequest extends MedusaAdminCreateUserRequest {
  @IsString()
  @IsOptional()
  store_id?: string;
}

export class AdminPostStoreReq extends MedusaAdminPostStoreReq {
  @IsString()
  seller_external_id: string | null;

  @IsString()
  address: string | null;

  @IsString({ each: true })
  @ArrayMaxSize(25)
  verticals: string[] = ["de"];

  @IsString({ each: true })
  @ArrayMaxSize(25)
  delivery_options: string[] = ["DTD"];
}

registerOverriddenValidators(AdminCreateUserRequest);
registerOverriddenValidators(AdminPostStoreReq);
