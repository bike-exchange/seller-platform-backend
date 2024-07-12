import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddDeliveryOptionsToStore1720705977762
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "store",
      new TableColumn({
        name: "delivery_options",
        type: "varchar[] NULL", // Array of strings
        isNullable: true,
        // default: '"DTD"', // Default value as a string representation of the array TODO: default value not working
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("store", "delivery_options");
  }
}
