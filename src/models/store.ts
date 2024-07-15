import { Column, Entity, Index, OneToMany } from "typeorm";

import { Store as MedusaStore } from "@medusajs/medusa";

import { User } from "./user";

@Entity()
export class Store extends MedusaStore {
  // add external ID column referencing the seller-id from CT & MP:
  @Index("sellerExternalId")
  @Column({ nullable: true }) // TODO: ideally we should not have this empty, but it can be empty for admin
  seller_external_id: string | null;

  // store HQ address:
  @Column({ nullable: true }) // TODO: ideally we should not have this empty, but it can be empty for admin store
  address: string | null;

  // verticals that the store covers:
  @Column("text", { nullable: true /*, default: "de"*/, array: true })
  verticals: string[] | null;

  // different delivery options offered by the seller
  @Column("text", { nullable: true /*, default: ["DTD"]*/, array: true })
  delivery_options: string[] | null;

  // relation between the store and the users (dev/member):
  @OneToMany(() => User, (user) => user.store)
  members?: User[];
}
