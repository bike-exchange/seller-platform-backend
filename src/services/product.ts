import type {
  FindProductConfig,
  CreateProductInput as MedusaCreateProductInput,
} from "@medusajs/medusa/dist/types/product";
import {
  FindConfig,
  ProductService as MedusaProductService,
  Product,
  buildQuery,
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

  async updateProductWithStore({
    product,
    storeId,
  }: {
    product: Product;
    storeId: string;
  }): Promise<Product> {
    const productRepo = this.activeManager_.withRepository(
      this.productRepository_
    );

    const newProductStore = await this.storeService_.getById(storeId);
    (product.stores || []).push(newProductStore);
    const updatedProduct = await productRepo.save(product);
    return updatedProduct;
  }

  async createProductWithStore({
    product,
    storeId,
  }: {
    product: Product;
    storeId: string;
  }): Promise<Product> {
    const productRepo = this.activeManager_.withRepository(
      this.productRepository_
    );

    const associatedProductStore = await this.storeService_.getById(storeId);

    product.stores = [associatedProductStore];

    const createdResource = await productRepo.save(product);
    return createdResource;
  }

  /**
   * given a Product object and a store-id, this function would:
   *  - store the Product into our DB if it doesn't exisit
   *  - update existing Product by adding store relation
   * @returns created or updated Product
   */

  async createOrUpdateForStore({
    storeId,
    product,
    selector,
    config,
  }: {
    storeId: string;
    product: Product;
    selector: ProductSelector;
    config?: FindConfig<Product>;
  }): Promise<Product> {
    const productMpn = product.mpn;
    const existingProduct = await this.getByMpn(productMpn, selector, config);

    // if we have an existing product with given MPN
    // => we add store to product-store relation
    if (existingProduct) {
      const updatedProduct = await this.updateProductWithStore({
        product,
        storeId,
      });
      return updatedProduct;
    }

    // else we create the product and set the store relation
    else {
      const createdProduct = await this.createProductWithStore({
        product,
        storeId,
      });

      return createdProduct;
    }
  }

  /**
   * To enable migration of products from CT to Medusa we need:
   * insert new Product entries
   * check if a given product exists (mpn) => if product exists, we simply extend the stores relation and add new store
   *
   */

  async getByMpn(
    mpn: string,
    selector?: ProductSelector,
    config?: FindConfig<Product>
  ): Promise<Product | null> {
    const productRepo = this.activeManager_.withRepository(
      this.productRepository_
    );
    const query = buildQuery({ mpn: mpn }, config);
    const products = await productRepo.find(query);

    return products.length ? products[0] : null;
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
