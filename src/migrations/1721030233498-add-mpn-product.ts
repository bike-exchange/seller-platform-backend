import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMpnProduct1721030233498 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // add the mpn field
    await queryRunner.query(
      `ALTER TABLE "product" ADD COLUMN "mpn" character varying NULL`
    );

    // create index over the new column to enhace search w.r.t this field
    await queryRunner.query(
      `CREATE INDEX "IDX_cf0cc85118574e369c3790026b4f66bc" ON "product" ("mpn")`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "IDX_cf0cc85118574e369c3790026b4f66bc"`
    );

    await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "mpn"`);
  }
}
