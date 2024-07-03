import type {
  FindProductConfig,
  CreateProductInput as MedusaCreateProductInput,
} from "@medusajs/medusa/dist/types/product";
import { ProductService as MedusaProductService } from "@medusajs/medusa";
import { Lifetime } from "awilix";
import { ProductSelector as MedusaProductSelector } from "@medusajs/medusa/dist/types/product";

import type { User } from "../models/user";
import type { Product } from "../models/product";
import { checkIsAdminUser } from "../utils/checkIsAdminUser";

// We override the type definition so it will not throw TS errors in the `create` method
type CreateProductInput = {
  store_id?: string;
} & MedusaCreateProductInput;

type ProductSelector = {
  store_id?: string;
} & MedusaProductSelector;

class ProductService extends MedusaProductService {
  static LIFE_TIME = Lifetime.TRANSIENT;
  protected readonly loggedInUser_: User | null;

  constructor(container) {
    // @ts-ignore
    super(...arguments);

    try {
      this.loggedInUser_ = container.loggedInUser;
    } catch (e) {
      // avoid errors when backend first runs
    }
  }

  /**
   * Assigns store_id to selector if not provided except for admin user who can see all users
   * @param selector
   */
  private prepareListConfig_(
    selector?: ProductSelector,
    config?: FindProductConfig
  ) {
    selector = selector || {};

    const isAdminUser = checkIsAdminUser(this.loggedInUser_);
    if (!isAdminUser && this.loggedInUser_?.store_id && !selector.store_id) {
      selector.store_id = this.loggedInUser_.store_id;
      config?.select?.push("store_id");
      config?.relations?.push("store");
    }
  }

  async list(
    selector: ProductSelector,
    config?: FindProductConfig
  ): Promise<Product[]> {
    this.prepareListConfig_(selector, config);

    const products = await super.list(selector, config);
    return products;
  }

  async listAndCount(
    selector: ProductSelector,
    config?: FindProductConfig
  ): Promise<[Product[], number]> {
    this.prepareListConfig_(selector, config);

    const products = await super.listAndCount(selector, config);
    return products;
  }

  async create(productObject: CreateProductInput): Promise<Product> {
    if (!productObject.store_id && this.loggedInUser_?.store_id) {
      productObject.store_id = this.loggedInUser_.store_id;

      // This will generate a handle for the product based on the title and store_id
      // e.g. "sunglasses-01HXVYMJF9DW..."
      const title = productObject.title
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "-")
        .toLowerCase();
      const store_id = this.loggedInUser_.store_id.replace("store_", "");

      productObject.handle = `${title}-${store_id}`;
    }

    const product = await super.create(productObject);
    return product;
  }
}

export default ProductService;
