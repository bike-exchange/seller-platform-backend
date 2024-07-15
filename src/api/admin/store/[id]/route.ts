import {
  MedusaRequest,
  MedusaResponse,
  Store,
  validator,
} from "@medusajs/medusa";
import { EntityManager } from "typeorm";
import StoreService from "../../../../services/store";
import { AdminPostStoreReq } from "../../../index";

/**
 * [get] /store/{id}
 * description: get store data by given ID
 */
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const { id } = req.params;
  const manager: EntityManager = req.scope.resolve("manager");
  const storeService: StoreService = req.scope.resolve("storeService");

  const store = await manager.transaction(async (transactioManager) => {
    const storeServiceWithTransaction =
      storeService.withTransaction(transactioManager);

    return await storeServiceWithTransaction.getById(id);
  });

  res.status(200).json({
    store,
  });
};

/**
 * [post] /store/{id}
 * description: update store with payload
 */
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const validatedPayload = await validator(AdminPostStoreReq, req.body);
  const { id } = req.params;

  const manager: EntityManager = req.scope.resolve("manager");
  const storeService: StoreService = req.scope.resolve("storeService");

  const updatedStore = await manager.transaction(async (transactioManager) => {
    const storeServiceWithTransaction =
      storeService.withTransaction(transactioManager);

    const storeUpdatePayload: Partial<Store> = {
      name: validatedPayload.name,
      default_currency_code: validatedPayload.default_currency_code,
      // TODO: check these missing fields:
      // default_currency: validatedPayload.default_currency,
      // currencies: validatedPayload.currencies || [],
      swap_link_template: validatedPayload.swap_link_template,
      payment_link_template: validatedPayload.payment_link_template,
      invite_link_template: validatedPayload.invite_link_template,
      // default_location_id: validatedPayload.default_location_id,
      metadata: validatedPayload.metadata,
      // default_sales_channel_id: validatedPayload.default_sales_channel_id,
      // default_sales_channel: validatedPayload.default_sales_channel,
      seller_external_id: validatedPayload.seller_external_id,
      address: validatedPayload.address,
      verticals: validatedPayload.verticals,
      delivery_options: validatedPayload.delivery_options,
    };
    return await storeServiceWithTransaction.updateWithPayload(
      id,
      storeUpdatePayload
    );
  });

  res.status(200).json({
    updated_store: updatedStore,
  });
};
