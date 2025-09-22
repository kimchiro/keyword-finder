import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveSearchTrendsForeignKey1758524652114 implements MigrationInterface {
    name = 'RemoveSearchTrendsForeignKey1758524652114'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // search_trends 테이블의 외래키 제약 조건 제거
        await queryRunner.query(`ALTER TABLE \`search_trends\` DROP FOREIGN KEY \`FK_16c248f55f8a5d2c2cc1e17939a\``);
        
        // keyword_id 필드를 nullable로 변경 (로직에서 사용하지 않으므로)
        await queryRunner.query(`ALTER TABLE \`search_trends\` MODIFY COLUMN \`keyword_id\` int NULL DEFAULT NULL`);
        
        // 다른 테이블들도 동일하게 처리 (로직에서 keyword_id를 설정하지 않는 경우)
        await queryRunner.query(`ALTER TABLE \`gender_search_ratios\` DROP FOREIGN KEY \`FK_151dffc942faa56b8ba94ebd990\``);
        await queryRunner.query(`ALTER TABLE \`gender_search_ratios\` MODIFY COLUMN \`keyword_id\` int NULL DEFAULT NULL`);
        
        await queryRunner.query(`ALTER TABLE \`monthly_search_ratios\` DROP FOREIGN KEY \`FK_c954aa4c6c6d0d7db245ce4c839\``);
        await queryRunner.query(`ALTER TABLE \`monthly_search_ratios\` MODIFY COLUMN \`keyword_id\` int NULL DEFAULT NULL`);
        
        await queryRunner.query(`ALTER TABLE \`weekday_search_ratios\` DROP FOREIGN KEY \`FK_d4ad301d1a3e28b03dbe3f831d2\``);
        await queryRunner.query(`ALTER TABLE \`weekday_search_ratios\` MODIFY COLUMN \`keyword_id\` int NULL DEFAULT NULL`);
        
        await queryRunner.query(`ALTER TABLE \`intent_analysis\` DROP FOREIGN KEY \`FK_559fbfdb59f5d44189ce4321a4b\``);
        await queryRunner.query(`ALTER TABLE \`intent_analysis\` MODIFY COLUMN \`keyword_id\` int NULL DEFAULT NULL`);
        
        await queryRunner.query(`ALTER TABLE \`issue_analysis\` DROP FOREIGN KEY \`FK_1fb0edee4b4cfa4a9ced503c2a7\``);
        await queryRunner.query(`ALTER TABLE \`issue_analysis\` MODIFY COLUMN \`keyword_id\` int NULL DEFAULT NULL`);
        
        // keyword_collection_logs는 실제로 keyword_id를 사용하므로 유지
        // await queryRunner.query(`ALTER TABLE \`keyword_collection_logs\` DROP FOREIGN KEY \`FK_52bc48f21663daca9a4924f71b4\``);
        // await queryRunner.query(`ALTER TABLE \`keyword_collection_logs\` MODIFY COLUMN \`collected_keyword_id\` int NULL DEFAULT NULL`);
        
        console.log('✅ 외래키 제약 조건 제거 완료 - 로직에서 keyword 문자열만 사용');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // 롤백 시 외래키 제약 조건 복원
        await queryRunner.query(`ALTER TABLE \`search_trends\` MODIFY COLUMN \`keyword_id\` int NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE \`search_trends\` ADD CONSTRAINT \`FK_16c248f55f8a5d2c2cc1e17939a\` FOREIGN KEY (\`keyword_id\`) REFERENCES \`keywords\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        
        await queryRunner.query(`ALTER TABLE \`gender_search_ratios\` MODIFY COLUMN \`keyword_id\` int NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE \`gender_search_ratios\` ADD CONSTRAINT \`FK_151dffc942faa56b8ba94ebd990\` FOREIGN KEY (\`keyword_id\`) REFERENCES \`keywords\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        
        await queryRunner.query(`ALTER TABLE \`monthly_search_ratios\` MODIFY COLUMN \`keyword_id\` int NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE \`monthly_search_ratios\` ADD CONSTRAINT \`FK_c954aa4c6c6d0d7db245ce4c839\` FOREIGN KEY (\`keyword_id\`) REFERENCES \`keywords\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        
        await queryRunner.query(`ALTER TABLE \`weekday_search_ratios\` MODIFY COLUMN \`keyword_id\` int NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE \`weekday_search_ratios\` ADD CONSTRAINT \`FK_d4ad301d1a3e28b03dbe3f831d2\` FOREIGN KEY (\`keyword_id\`) REFERENCES \`keywords\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        
        await queryRunner.query(`ALTER TABLE \`intent_analysis\` MODIFY COLUMN \`keyword_id\` int NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE \`intent_analysis\` ADD CONSTRAINT \`FK_559fbfdb59f5d44189ce4321a4b\` FOREIGN KEY (\`keyword_id\`) REFERENCES \`keywords\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        
        await queryRunner.query(`ALTER TABLE \`issue_analysis\` MODIFY COLUMN \`keyword_id\` int NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE \`issue_analysis\` ADD CONSTRAINT \`FK_1fb0edee4b4cfa4a9ced503c2a7\` FOREIGN KEY (\`keyword_id\`) REFERENCES \`keywords\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        
        console.log('✅ 외래키 제약 조건 복원 완료');
    }
}