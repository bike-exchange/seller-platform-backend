import {
  type FindConfig,
  StoreService as MedusaStoreService,
  buildQuery,
} from "@medusajs/medusa";
import { Lifetime } from "awilix";

import type { User } from "../models/user";
import type { Store } from "../models/store";

class StoreService extends MedusaStoreService {
  static LIFE_TIME = Lifetime.TRANSIENT;
  protected readonly loggedInUser_: User | null;

  constructor(container, options) {
    // @ts-ignore
    super(...arguments);

    try {
      this.loggedInUser_ = container.loggedInUser;
    } catch (e) {
      // avoid errors when backend first runs
    }
  }

  async retrieve(config?: FindConfig<Store>): Promise<Store> {
    if (!this.loggedInUser_?.store_id) {
      return super.retrieve(config);
    }

    return this.retrieveForLoggedInUser(config);
  }

  async retrieveForLoggedInUser(config?: FindConfig<Store>) {
    const storeRepo = this.manager_.withRepository(this.storeRepository_);
    // TODO: for admin, we should return all stores
    const query = buildQuery<Partial<Store>, Store>(
      {
        id: this.loggedInUser_.store_id,
      },
      {
        ...config,
        relations: [...(config?.relations || []), "members"],
      }
    );

    return await storeRepo.findOne(query);
  }
}

export default StoreService;
