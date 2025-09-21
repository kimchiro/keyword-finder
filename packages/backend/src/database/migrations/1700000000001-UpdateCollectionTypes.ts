import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateCollectionTypes1700000000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    console.log('🔄 마이그레이션: CollectionType 업데이트 시작...');

    // 1. 기존 데이터 정리 - autosuggest, related 타입 데이터 삭제
    await queryRunner.query(`
      DELETE FROM keyword_collection_logs 
      WHERE collection_type IN ('autosuggest', 'related')
    `);
    console.log('✅ 기존 autosuggest, related 데이터 삭제 완료');

    // 2. collection_type 컬럼을 VARCHAR(20)으로 확장 (smartblock이 길어서)
    await queryRunner.query(`
      ALTER TABLE keyword_collection_logs 
      MODIFY COLUMN collection_type VARCHAR(20) NOT NULL
    `);
    console.log('✅ collection_type 컬럼 크기 확장 완료');

    // 3. 새로운 ENUM 제약조건 추가 (trending, smartblock만 허용)
    await queryRunner.query(`
      ALTER TABLE keyword_collection_logs 
      ADD CONSTRAINT chk_collection_type 
      CHECK (collection_type IN ('trending', 'smartblock'))
    `);
    console.log('✅ 새로운 collection_type 제약조건 추가 완료');

    console.log('🎉 CollectionType 업데이트 마이그레이션 완료!');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    console.log('🔄 마이그레이션 롤백: CollectionType 복원 시작...');

    // 1. 제약조건 제거
    await queryRunner.query(`
      ALTER TABLE keyword_collection_logs 
      DROP CONSTRAINT IF EXISTS chk_collection_type
    `);

    // 2. 컬럼 크기 원복
    await queryRunner.query(`
      ALTER TABLE keyword_collection_logs 
      MODIFY COLUMN collection_type VARCHAR(50) NOT NULL
    `);

    console.log('🔄 CollectionType 롤백 완료');
  }
}
