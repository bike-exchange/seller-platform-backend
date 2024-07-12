import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import { EntityManager } from "typeorm";
import StoreService from "../../../services/store";
import { Store } from "../../../models/store";

/**
 * [get] /store
 * description: get current user store
 */
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const manager: EntityManager = req.scope.resolve("manager");
  const storeService: StoreService = req.scope.resolve("storeService");

  const store = await manager.transaction(async (transactioManager) => {
    const storeServiceWithTransaction =
      storeService.withTransaction(transactioManager);

    return await storeServiceWithTransaction.retrieve();
  });

  res.status(200).json({
    store,
  });
};

/**
 * [post] /store
 * creates store with payload
 */
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const newStorePayload = req.body as Store;

  const manager: EntityManager = req.scope.resolve("manager");
  const storeService: StoreService = req.scope.resolve("storeService");

  const newStore = await manager.transaction(async (transactioManager) => {
    const storeServiceWithTransaction =
      storeService.withTransaction(transactioManager);

    return await storeServiceWithTransaction.createWithPayload(newStorePayload);
  });

  res.status(200).json({
    new_store: newStore,
  });
};
