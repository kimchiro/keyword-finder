import { MigrationInterface, QueryRunner } from "typeorm";
export declare class AddKeywordIdDefaults1758523909770 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
