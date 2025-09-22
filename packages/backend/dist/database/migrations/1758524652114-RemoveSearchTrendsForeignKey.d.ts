import { MigrationInterface, QueryRunner } from "typeorm";
export declare class RemoveSearchTrendsForeignKey1758524652114 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
