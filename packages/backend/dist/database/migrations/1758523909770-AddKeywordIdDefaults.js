"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddKeywordIdDefaults1758523909770 = void 0;
class AddKeywordIdDefaults1758523909770 {
    constructor() {
        this.name = 'AddKeywordIdDefaults1758523909770';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`search_trends\` MODIFY COLUMN \`keyword_id\` int NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE \`gender_search_ratios\` MODIFY COLUMN \`keyword_id\` int NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE \`monthly_search_ratios\` MODIFY COLUMN \`keyword_id\` int NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE \`weekday_search_ratios\` MODIFY COLUMN \`keyword_id\` int NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE \`intent_analysis\` MODIFY COLUMN \`keyword_id\` int NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE \`issue_analysis\` MODIFY COLUMN \`keyword_id\` int NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE \`keyword_collection_logs\` MODIFY COLUMN \`collected_keyword_id\` int NOT NULL DEFAULT 0`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`search_trends\` MODIFY COLUMN \`keyword_id\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`gender_search_ratios\` MODIFY COLUMN \`keyword_id\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`monthly_search_ratios\` MODIFY COLUMN \`keyword_id\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`weekday_search_ratios\` MODIFY COLUMN \`keyword_id\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`intent_analysis\` MODIFY COLUMN \`keyword_id\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`issue_analysis\` MODIFY COLUMN \`keyword_id\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`keyword_collection_logs\` MODIFY COLUMN \`collected_keyword_id\` int NOT NULL`);
    }
}
exports.AddKeywordIdDefaults1758523909770 = AddKeywordIdDefaults1758523909770;
//# sourceMappingURL=1758523909770-AddKeywordIdDefaults.js.map