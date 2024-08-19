import { Column, Entity, Index, JoinTable, ManyToMany } from "typeorm";

import { Product as MedusaProduct } from "@medusajs/medusa";

import { Store } from "./store";

@Entity()
export class Product extends MedusaProduct {
  @ManyToMany(() => Store, { cascade: true })
  @JoinTable()
  stores: Store[];

  // add mpn column referencing CT/MP resources
  @Index("mpn")
  @Column({ nullable: true })
  mpn: string | null;

  // TODO: other relevant fields need to be added
}
