import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import { EntityManager } from "typeorm";
import ProductService from "../../../services/product";

/**
 * [get] /products
 * route to get products for logged-in user:
 *  - if user is admin -> can see all products
 *  - if normal user -> can see products of the store only
 */
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const manager: EntityManager = req.scope.resolve("manager");
  const productService: ProductService = req.scope.resolve("productService");

  try {
    const [products] = await manager.transaction(async (transactionManager) => {
      const productServiceWithTransaction =
        productService.withTransaction(transactionManager);

      const allProducts = await productServiceWithTransaction.listAndCount();
      return allProducts;
    });

    return res.status(200).json({ products });
  } catch (error) {
    // TODO: better handle errors :")
    console.log(
      ` ** TEST error in getting Products ** ${JSON.stringify(error, null, 5)}`
    );
  }
};

/**
 * [post] /products
 */
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  // TODO: decide whether store-id should be inferred from logged-in user (I think yes)
  // @ts-expect-error will fix types:
  const { storeId, ...product } = req.body;

  const manager: EntityManager = req.scope.resolve("manager");
  const productService: ProductService = req.scope.resolve("productService");

  try {
    const newProduct = await manager.transaction(async (transactionManager) => {
      const productServiceWithTransaction =
        productService.withTransaction(transactionManager);

      const createdProduct =
        await productServiceWithTransaction.createProductWithStore({
          storeId,
          product,
        });

      return createdProduct;
    });

    return res.status(201).json({
      product: newProduct,
    });
  } catch (error) {
    console.log(
      ` ** TEST error in creating Product ** ${JSON.stringify(error, null, 5)}`
    );
  }
};
