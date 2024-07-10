import type { Product } from "./models/product";
import type { Store } from "./models/store";

declare module "@medusajs/medusa/dist/models/product" {
  interface Product {
    stores?: Store[];
  }
}

declare module "@medusajs/medusa/dist/models/user" {
  interface User {
    store_id?: string | null;
    store?: Store | null;
  }
}
