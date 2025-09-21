import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRelatedSearchType1758452495530 implements MigrationInterface {
    name = 'AddRelatedSearchType1758452495530'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`keyword_collection_logs\` CHANGE \`collection_type\` \`collection_type\` enum ('trending', 'smartblock', 'related_search') NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`keyword_collection_logs\` CHANGE \`collection_type\` \`collection_type\` enum ('trending', 'smartblock') NOT NULL`);
    }

}
