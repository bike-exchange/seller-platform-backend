import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateProductStoreTable1720528382721
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "product_stores_store",
        columns: [
          {
            name: "productId",
            type: "varchar",
            length: "255",
            unsigned: true,
            isNullable: false,
          },
          {
            name: "storeId",
            type: "varchar",
            length: "255",
            unsigned: true,
            isNullable: false,
          },
        ],
        foreignKeys: [
          {
            name: "FK_64a92c1ada6c4c12a45b0df01537f1c7",
            columnNames: ["productId"],
            referencedTableName: "product",
            referencedColumnNames: ["id"],
          },
          {
            name: "FK_42e226f0e7b244eea40e19e68b8b2631",
            columnNames: ["storeId"],
            referencedTableName: "store",
            referencedColumnNames: ["id"],
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "product_stores_store" DROP CONSTRAINT "FK_64a92c1ada6c4c12a45b0df01537f1c7"'
    );
    await queryRunner.query(
      'ALTER TABLE "product_stores_store" DROP CONSTRAINT "FK_42e226f0e7b244eea40e19e68b8b2631"'
    );
    await queryRunner.dropTable("product_stores_store");
  }
}
