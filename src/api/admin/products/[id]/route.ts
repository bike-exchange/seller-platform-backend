import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import ProductService from "../../../../services/product";
import { EntityManager } from "typeorm";

/**
 * [get] /store/{id}
 * description: get store data by given ID
 */
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const { id } = req.params;
  const manager: EntityManager = req.scope.resolve("manager");
  const productService: ProductService = req.scope.resolve("productService");

  const product = await manager.transaction(async (transactioManager) => {
    const productServiceWithTransaction =
      productService.withTransaction(transactioManager);

    return await productServiceWithTransaction.getById(id);
  });

  res.status(200).json({
    product,
  });
};
