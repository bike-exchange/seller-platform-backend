import type {
  FindProductConfig,
  CreateProductInput as MedusaCreateProductInput,
} from "@medusajs/medusa/dist/types/product";
import {
  ProductService as MedusaProductService,
  Product,
} from "@medusajs/medusa";
import { MedusaError } from "@medusajs/utils";
import { Lifetime } from "awilix";
import { ProductSelector as MedusaProductSelector } from "@medusajs/medusa/dist/types/product";

import type { User } from "../models/user";
import StoreService from "./store";
import { Store } from "../models/store";

// We override the type definition so it will not throw TS errors in the `create` method
type CreateProductInput = {
  stores?: Store[];
} & MedusaCreateProductInput;

type ProductSelector = {
  stores?: Store[];
} & MedusaProductSelector;

class ProductService extends MedusaProductService {
  static LIFE_TIME = Lifetime.TRANSIENT;
  protected readonly loggedInUser_: User | null;
  protected readonly storeService_: StoreService;

  constructor(container) {
    // @ts-ignore
    super(...arguments);
    this.storeService_ = container.storeService;

    try {
      this.loggedInUser_ = container.loggedInUser;
    } catch (e) {
      // avoid errors when backend first runs
    }
  }

  async create(productObject: CreateProductInput): Promise<Product> {
    if (this.loggedInUser_?.store_id) {
      const currentStore = await this.storeService_.retrieve();
      // NOTE: when product is created for first time, we set the stores object to contain current user store
      if (currentStore) {
        productObject.stores = [currentStore];
        return await super.create(productObject);
      } else {
        throw new MedusaError(
          MedusaError.Types.NOT_FOUND,
          "could not get store data of current user"
        );
      }
    } else {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        "can not create Product because of missing user store"
      );
    }
  }

  async list(
    selector: ProductSelector,
    config?: FindProductConfig
  ): Promise<Product[]> {
    if (this.loggedInUser_?.store_id) {
      try {
        const currentStoreId = this.loggedInUser_?.store_id;
        const productRepo = this.activeManager_.withRepository(
          this.productRepository_
        );

        const qb = productRepo
          .createQueryBuilder("product")
          .innerJoin("product.stores", "store", "store.id = :storeId")
          .setParameter("storeId", currentStoreId) // only get products which are related to current user store
          .leftJoinAndSelect("product.variants", "variant");

        const products = await qb.getMany();
        // TODO: check if this is actually needed
        products.forEach((product) => {
          const productVariants = product.variants;
          product.variants = productVariants || [];
        });

        return products;
      } catch (error) {
        throw new MedusaError(
          MedusaError.Types.UNEXPECTED_STATE,
          `error in fetching products ${JSON.stringify(error)}`
        );
      }
    } else {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        "can not create Product because of missing user store"
      );
    }
  }

  async listAndCount(
    selector: ProductSelector,
    config?: FindProductConfig
  ): Promise<[Product[], number]> {
    if (this.loggedInUser_?.store_id) {
      try {
        const currentStoreId = this.loggedInUser_?.store_id;
        const productRepo = this.activeManager_.withRepository(
          this.productRepository_
        );

        const qb = productRepo
          .createQueryBuilder("product")
          .innerJoin("product.stores", "store", "store.id = :storeId")
          .setParameter("storeId", currentStoreId)
          .leftJoinAndSelect("product.variants", "variant"); // NOTE: I needed to add variants bc it was throwing an error on GET

        const productsWithCount = await qb.getManyAndCount();

        return productsWithCount;
      } catch (error) {
        throw new MedusaError(
          MedusaError.Types.UNEXPECTED_STATE,
          `error in fetching products with count ${JSON.stringify(error)}`
        );
      }
    } else {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        "can not create Product because of missing user store"
      );
    }
  }
}

export default ProductService;
