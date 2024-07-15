import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSellerExternalIdSeller1720695897521
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // add the seller_external_id field, presenting the seller id from CT & MP
    await queryRunner.query(
      `ALTER TABLE "store" ADD COLUMN "seller_external_id" character varying NULL`
    );

    // create index over the new column to enhace search w.r.t this field
    await queryRunner.query(
      `CREATE INDEX "IDX_fef7b93f8788475ca7ec0fa0b08bfe41" ON "store" ("seller_external_id")`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "IDX_fef7b93f8788475ca7ec0fa0b08bfe41"`
    );

    await queryRunner.query(
      `ALTER TABLE "store" DROP COLUMN "seller_external_id"`
    );
  }
}
