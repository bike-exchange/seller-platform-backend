import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddVerticalsToStore1720705382370 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "store",
      new TableColumn({
        name: "verticals",
        type: "varchar[]", // Array of strings
        // isNullable: false,
        // default: '"de"', // Default vertical TODO: default value not working
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("store", "verticals");
  }
}
