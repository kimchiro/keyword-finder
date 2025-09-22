"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateMonthlyRatiosIndexes1758524967900 = void 0;
class UpdateMonthlyRatiosIndexes1758524967900 {
    constructor() {
        this.name = 'UpdateMonthlyRatiosIndexes1758524967900';
    }
    async up(queryRunner) {
        await queryRunner.query(`DROP INDEX \`IDX_50479c200ac3c5fb965ce6616b\` ON \`monthly_search_ratios\``);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_monthly_keyword_month_year\` ON \`monthly_search_ratios\` (\`keyword\`, \`month_number\`, \`analysis_year\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_monthly_keyword\` ON \`monthly_search_ratios\` (\`keyword\`)`);
        await queryRunner.query(`DROP INDEX \`IDX_50feb037785d4796b712f02f75\` ON \`search_trends\``);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_search_keyword_period\` ON \`search_trends\` (\`keyword\`, \`period_type\`, \`period_value\`)`);
        console.log('✅ 인덱스 업데이트 완료 - keyword 기반으로 변경');
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP INDEX \`IDX_monthly_keyword_month_year\` ON \`monthly_search_ratios\``);
        await queryRunner.query(`DROP INDEX \`IDX_monthly_keyword\` ON \`monthly_search_ratios\``);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_50479c200ac3c5fb965ce6616b\` ON \`monthly_search_ratios\` (\`keyword\`, \`month_number\`, \`analysis_year\`)`);
        await queryRunner.query(`DROP INDEX \`IDX_search_keyword_period\` ON \`search_trends\``);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_50feb037785d4796b712f02f75\` ON \`search_trends\` (\`keyword\`, \`period_type\`, \`period_value\`)`);
        console.log('✅ 인덱스 롤백 완료');
    }
}
exports.UpdateMonthlyRatiosIndexes1758524967900 = UpdateMonthlyRatiosIndexes1758524967900;
//# sourceMappingURL=1758524967900-UpdateMonthlyRatiosIndexes.js.map