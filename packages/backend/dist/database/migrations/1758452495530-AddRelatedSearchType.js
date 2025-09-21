"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddRelatedSearchType1758452495530 = void 0;
class AddRelatedSearchType1758452495530 {
    constructor() {
        this.name = 'AddRelatedSearchType1758452495530';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`keyword_collection_logs\` CHANGE \`collection_type\` \`collection_type\` enum ('trending', 'smartblock', 'related_search') NOT NULL`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`keyword_collection_logs\` CHANGE \`collection_type\` \`collection_type\` enum ('trending', 'smartblock') NOT NULL`);
    }
}
exports.AddRelatedSearchType1758452495530 = AddRelatedSearchType1758452495530;
//# sourceMappingURL=1758452495530-AddRelatedSearchType.js.map