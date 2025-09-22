import { MigrationInterface, QueryRunner } from "typeorm";

export class AddKeywordIdDefaults1758523909770 implements MigrationInterface {
    name = 'AddKeywordIdDefaults1758523909770'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // keyword_id 필드에 기본값 0 추가 (모든 테이블)
        
        // search_trends 테이블
        await queryRunner.query(`ALTER TABLE \`search_trends\` MODIFY COLUMN \`keyword_id\` int NOT NULL DEFAULT 0`);
        
        // gender_search_ratios 테이블
        await queryRunner.query(`ALTER TABLE \`gender_search_ratios\` MODIFY COLUMN \`keyword_id\` int NOT NULL DEFAULT 0`);
        
        // monthly_search_ratios 테이블
        await queryRunner.query(`ALTER TABLE \`monthly_search_ratios\` MODIFY COLUMN \`keyword_id\` int NOT NULL DEFAULT 0`);
        
        // weekday_search_ratios 테이블
        await queryRunner.query(`ALTER TABLE \`weekday_search_ratios\` MODIFY COLUMN \`keyword_id\` int NOT NULL DEFAULT 0`);
        
        // intent_analysis 테이블
        await queryRunner.query(`ALTER TABLE \`intent_analysis\` MODIFY COLUMN \`keyword_id\` int NOT NULL DEFAULT 0`);
        
        // issue_analysis 테이블
        await queryRunner.query(`ALTER TABLE \`issue_analysis\` MODIFY COLUMN \`keyword_id\` int NOT NULL DEFAULT 0`);
        
        // keyword_collection_logs 테이블의 collected_keyword_id
        await queryRunner.query(`ALTER TABLE \`keyword_collection_logs\` MODIFY COLUMN \`collected_keyword_id\` int NOT NULL DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // 기본값 제거 (원래 상태로 복원)
        
        // search_trends 테이블
        await queryRunner.query(`ALTER TABLE \`search_trends\` MODIFY COLUMN \`keyword_id\` int NOT NULL`);
        
        // gender_search_ratios 테이블
        await queryRunner.query(`ALTER TABLE \`gender_search_ratios\` MODIFY COLUMN \`keyword_id\` int NOT NULL`);
        
        // monthly_search_ratios 테이블
        await queryRunner.query(`ALTER TABLE \`monthly_search_ratios\` MODIFY COLUMN \`keyword_id\` int NOT NULL`);
        
        // weekday_search_ratios 테이블
        await queryRunner.query(`ALTER TABLE \`weekday_search_ratios\` MODIFY COLUMN \`keyword_id\` int NOT NULL`);
        
        // intent_analysis 테이블
        await queryRunner.query(`ALTER TABLE \`intent_analysis\` MODIFY COLUMN \`keyword_id\` int NOT NULL`);
        
        // issue_analysis 테이블
        await queryRunner.query(`ALTER TABLE \`issue_analysis\` MODIFY COLUMN \`keyword_id\` int NOT NULL`);
        
        // keyword_collection_logs 테이블의 collected_keyword_id
        await queryRunner.query(`ALTER TABLE \`keyword_collection_logs\` MODIFY COLUMN \`collected_keyword_id\` int NOT NULL`);
    }
}