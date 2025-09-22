import { MigrationInterface, QueryRunner } from "typeorm";
export declare class FixedDatabaseStructureImprovement1758510381678 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
