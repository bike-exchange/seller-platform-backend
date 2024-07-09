import { Entity, JoinTable, ManyToMany } from "typeorm";

import { Product as MedusaProduct } from "@medusajs/medusa";

import { Store } from "./store";

@Entity()
export class Product extends MedusaProduct {
  @ManyToMany(() => Store, { cascade: true })
  @JoinTable()
  stores: Store[];
}
