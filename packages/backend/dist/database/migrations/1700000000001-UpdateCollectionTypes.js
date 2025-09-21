"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCollectionTypes1700000000001 = void 0;
class UpdateCollectionTypes1700000000001 {
    async up(queryRunner) {
        console.log('🔄 마이그레이션: CollectionType 업데이트 시작...');
        await queryRunner.query(`
      DELETE FROM keyword_collection_logs 
      WHERE collection_type IN ('autosuggest', 'related')
    `);
        console.log('✅ 기존 autosuggest, related 데이터 삭제 완료');
        await queryRunner.query(`
      ALTER TABLE keyword_collection_logs 
      MODIFY COLUMN collection_type VARCHAR(20) NOT NULL
    `);
        console.log('✅ collection_type 컬럼 크기 확장 완료');
        await queryRunner.query(`
      ALTER TABLE keyword_collection_logs 
      ADD CONSTRAINT chk_collection_type 
      CHECK (collection_type IN ('trending', 'smartblock'))
    `);
        console.log('✅ 새로운 collection_type 제약조건 추가 완료');
        console.log('🎉 CollectionType 업데이트 마이그레이션 완료!');
    }
    async down(queryRunner) {
        console.log('🔄 마이그레이션 롤백: CollectionType 복원 시작...');
        await queryRunner.query(`
      ALTER TABLE keyword_collection_logs 
      DROP CONSTRAINT IF EXISTS chk_collection_type
    `);
        await queryRunner.query(`
      ALTER TABLE keyword_collection_logs 
      MODIFY COLUMN collection_type VARCHAR(50) NOT NULL
    `);
        console.log('🔄 CollectionType 롤백 완료');
    }
}
exports.UpdateCollectionTypes1700000000001 = UpdateCollectionTypes1700000000001;
//# sourceMappingURL=1700000000001-UpdateCollectionTypes.js.map