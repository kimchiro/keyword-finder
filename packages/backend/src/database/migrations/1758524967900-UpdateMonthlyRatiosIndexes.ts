import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateMonthlyRatiosIndexes1758524967900 implements MigrationInterface {
    name = 'UpdateMonthlyRatiosIndexes1758524967900'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // monthly_search_ratios 테이블의 기존 인덱스 제거
        await queryRunner.query(`DROP INDEX \`IDX_50479c200ac3c5fb965ce6616b\` ON \`monthly_search_ratios\``);
        
        // keyword 기반 새로운 UNIQUE 인덱스 생성
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_monthly_keyword_month_year\` ON \`monthly_search_ratios\` (\`keyword\`, \`month_number\`, \`analysis_year\`)`);
        
        // keyword 인덱스 추가
        await queryRunner.query(`CREATE INDEX \`IDX_monthly_keyword\` ON \`monthly_search_ratios\` (\`keyword\`)`);
        
        // search_trends 테이블도 동일하게 처리
        await queryRunner.query(`DROP INDEX \`IDX_50feb037785d4796b712f02f75\` ON \`search_trends\``);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_search_keyword_period\` ON \`search_trends\` (\`keyword\`, \`period_type\`, \`period_value\`)`);
        
        console.log('✅ 인덱스 업데이트 완료 - keyword 기반으로 변경');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // 롤백 시 원래 인덱스 복원
        await queryRunner.query(`DROP INDEX \`IDX_monthly_keyword_month_year\` ON \`monthly_search_ratios\``);
        await queryRunner.query(`DROP INDEX \`IDX_monthly_keyword\` ON \`monthly_search_ratios\``);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_50479c200ac3c5fb965ce6616b\` ON \`monthly_search_ratios\` (\`keyword\`, \`month_number\`, \`analysis_year\`)`);
        
        await queryRunner.query(`DROP INDEX \`IDX_search_keyword_period\` ON \`search_trends\``);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_50feb037785d4796b712f02f75\` ON \`search_trends\` (\`keyword\`, \`period_type\`, \`period_value\`)`);
        
        console.log('✅ 인덱스 롤백 완료');
    }
}