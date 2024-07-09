import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateProductStoreTable1720528382721
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "product_store",
        columns: [
          {
            name: "product_id",
            type: "char",
            unsigned: true,
            isNullable: false,
          },
          {
            name: "store_id",
            type: "char",
            unsigned: true,
            isNullable: false,
          },
        ],
        foreignKeys: [
          {
            name: "FK_64a92c1ada6c4c12a45b0df01537f1c7",
            columnNames: ["product_id"],
            referencedTableName: "product",
            referencedColumnNames: ["id"],
          },
          {
            name: "FK_42e226f0e7b244eea40e19e68b8b2631",
            columnNames: ["store_id"],
            referencedTableName: "store",
            referencedColumnNames: ["id"],
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "product_store" DROP CONSTRAINT "FK_64a92c1ada6c4c12a45b0df01537f1c7"'
    );
    await queryRunner.query(
      'ALTER TABLE "product_store" DROP CONSTRAINT "FK_42e226f0e7b244eea40e19e68b8b2631"'
    );
    await queryRunner.dropTable("product_store");
  }
}
