import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddDeliveryOptionsToStore1720705977762
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "store",
      new TableColumn({
        name: "delivery_options",
        type: "varchar[]", // Array of strings
        isNullable: false,
        default: "'DTD'", // Default value as a string representation of the array
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("store", "delivery_options");
  }
}
