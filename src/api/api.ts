import { registerOverriddenValidators } from "@medusajs/medusa";
import { AdminCreateUserRequest as MedusaAdminCreateUserRequest } from "@medusajs/medusa/dist/api/routes/admin/users/create-user";
import { StoreGetProductsParams as MedusaStoreGetProductsParams } from "@medusajs/medusa/dist/api/routes/store/products/list-products";
import { IsString, IsOptional } from "class-validator";

class AdminCreateUserRequest extends MedusaAdminCreateUserRequest {
  @IsString()
  @IsOptional()
  store_id?: string;
}
registerOverriddenValidators(AdminCreateUserRequest);

class StoreGetProductsParams extends MedusaStoreGetProductsParams {
  @IsString()
  @IsOptional() // Optional of course
  store_id?: string;
}
registerOverriddenValidators(StoreGetProductsParams);
