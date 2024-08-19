import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAddressToStore1720703882072 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "store" ADD COLUMN "address" character varying NULL`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "store"
            DROP COLUMN "address"
        `);
  }
}
