import { Lifetime } from "awilix";
import {
  ProductService as MedusaProductService,
  Product,
  User,
} from "@medusajs/medusa";
import {
  CreateProductInput as MedusaCreateProductInput,
  FindProductConfig,
  ProductSelector as MedusaProductSelector,
} from "@medusajs/medusa/dist/types/product";

// associate the product with its store
type ProductSelector = {
  store_id?: string;
} & MedusaProductSelector;

type CreateProductInput = {
  store_id?: string;
} & MedusaCreateProductInput;

class ProductService extends MedusaProductService {
  static LIFE_TIME = Lifetime.SCOPED;
  protected readonly loggedInUser_: User | null;

  constructor(container, options) {
    // @ts-expect-error prefer-rest-params
    super(...arguments);

    try {
      this.loggedInUser_ = container.loggedInUser;
    } catch (e) {
      // avoid errors when backend first runs
    }
  }

  async list(
    selector: ProductSelector,
    config?: FindProductConfig
  ): Promise<Product[]> {
    if (!selector.store_id && this.loggedInUser_?.store_id) {
      selector.store_id = this.loggedInUser_.store_id;
    }

    config.select?.push("store_id");

    config.relations?.push("store");

    return await super.list(selector, config);
  }

  async listAndCount(
    selector: ProductSelector,
    config?: FindProductConfig
  ): Promise<[Product[], number]> {
    if (!selector.store_id && this.loggedInUser_?.store_id) {
      selector.store_id = this.loggedInUser_.store_id;
    }

    config.select?.push("store_id");

    config.relations?.push("store");

    return await super.listAndCount(selector, config);
  }

  async retrieve(
    productId: string,
    config?: FindProductConfig
  ): Promise<Product> {
    config.relations = [...(config.relations || []), "store"];

    const product = await super.retrieve(productId, config);

    if (
      product.store?.id &&
      this.loggedInUser_?.store_id &&
      product.store.id !== this.loggedInUser_.store_id
    ) {
      // Throw error bc every product must belong to a store
      throw new Error("Product does not exist in store.");
    }

    return product;
  }

  async create(productObject: CreateProductInput): Promise<Product> {
    if (!productObject.store_id && this.loggedInUser_?.store_id) {
      productObject.store_id = this.loggedInUser_.store_id;

      /*
      // This will generate a handle for the product based on the title and store_id
      const title = productObject.title
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "-")
        .toLowerCase();
      const store_id = this.loggedInUser_.store_id.replace("store_", "");

      productObject.handle = `${title}-${store_id}`; // NOTE: the handle must be unique, hence we postfix title with store-id
      */
    }

    return await super.create(productObject);
  }
}

export default ProductService;
