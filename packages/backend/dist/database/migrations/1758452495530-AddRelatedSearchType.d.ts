import { MigrationInterface, QueryRunner } from "typeorm";
export declare class AddRelatedSearchType1758452495530 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
