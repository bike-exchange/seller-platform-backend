import {
  MedusaRequest,
  MedusaResponse,
  ProductService,
} from "@medusajs/medusa";
import { EntityManager } from "typeorm";

/**
 * [get] /products
 */
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const manager: EntityManager = req.scope.resolve("manager");
  const productService: ProductService = req.scope.resolve("productService");
};
