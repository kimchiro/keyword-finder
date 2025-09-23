import { MigrationInterface, QueryRunner } from "typeorm";
export declare class InitialSchema1758606343334 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
