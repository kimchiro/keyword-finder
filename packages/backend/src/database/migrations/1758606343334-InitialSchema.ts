import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1758606343334 implements MigrationInterface {
    name = 'InitialSchema1758606343334'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Keywords 테이블 생성
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS keywords (
                id INT AUTO_INCREMENT PRIMARY KEY,
                keyword VARCHAR(255) NOT NULL,
                status ENUM('active', 'inactive', 'archived') NOT NULL DEFAULT 'active',
                created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                UNIQUE INDEX IDX_keyword (keyword)
            ) ENGINE=InnoDB
        `);

        // Keyword Analytics 테이블 생성
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS keyword_analytics (
                id INT AUTO_INCREMENT PRIMARY KEY,
                keyword_id INT NOT NULL,
                keyword VARCHAR(255) NOT NULL,
                monthly_search_pc BIGINT NOT NULL DEFAULT 0,
                monthly_search_mobile BIGINT NOT NULL DEFAULT 0,
                monthly_search_total BIGINT NOT NULL DEFAULT 0,
                monthly_content_blog INT NOT NULL DEFAULT 0,
                monthly_content_cafe INT NOT NULL DEFAULT 0,
                monthly_content_all INT NOT NULL DEFAULT 0,
                estimated_search_yesterday BIGINT NOT NULL DEFAULT 0,
                estimated_search_end_month BIGINT NOT NULL DEFAULT 0,
                saturation_index_blog DECIMAL(5,2) NOT NULL DEFAULT 0.00,
                saturation_index_cafe DECIMAL(5,2) NOT NULL DEFAULT 0.00,
                saturation_index_all DECIMAL(5,2) NOT NULL DEFAULT 0.00,
                analysis_date DATE NOT NULL,
                created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                INDEX IDX_keyword_id (keyword_id),
                INDEX IDX_analysis_date (analysis_date),
                INDEX IDX_monthly_search_total (monthly_search_total),
                UNIQUE INDEX IDX_keyword_id_analysis_date (keyword_id, analysis_date),
                FOREIGN KEY FK_keyword_analytics_keyword_id (keyword_id) REFERENCES keywords(id) ON DELETE CASCADE
            ) ENGINE=InnoDB
        `);

        // Related Keywords 테이블 생성
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS related_keywords (
                id INT AUTO_INCREMENT PRIMARY KEY,
                base_keyword_id INT NOT NULL,
                related_keyword_id INT NOT NULL,
                base_keyword VARCHAR(255) NOT NULL,
                related_keyword VARCHAR(255) NOT NULL,
                monthly_search_volume BIGINT NOT NULL DEFAULT 0,
                blog_cumulative_posts INT NOT NULL DEFAULT 0,
                similarity_score ENUM('낮음', '보통', '높음') NOT NULL DEFAULT '보통',
                rank_position INT NOT NULL,
                analysis_date DATE NOT NULL,
                created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                INDEX IDX_base_keyword_id (base_keyword_id),
                INDEX IDX_related_keyword_id (related_keyword_id),
                INDEX IDX_analysis_date (analysis_date),
                INDEX IDX_rank_position (rank_position),
                INDEX IDX_base_keyword_id_rank_position (base_keyword_id, rank_position),
                INDEX IDX_base_keyword_id_analysis_date (base_keyword_id, analysis_date),
                UNIQUE INDEX IDX_base_related_keyword_analysis_date (base_keyword_id, related_keyword_id, analysis_date),
                FOREIGN KEY FK_related_keywords_base_keyword_id (base_keyword_id) REFERENCES keywords(id) ON DELETE CASCADE,
                FOREIGN KEY FK_related_keywords_related_keyword_id (related_keyword_id) REFERENCES keywords(id) ON DELETE CASCADE
            ) ENGINE=InnoDB
        `);

        // Search Trends 테이블 생성
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS search_trends (
                id INT AUTO_INCREMENT PRIMARY KEY,
                keyword_id INT NULL,
                keyword VARCHAR(255) NOT NULL,
                period_type ENUM('daily', 'weekly', 'monthly') NOT NULL,
                period_value VARCHAR(20) NOT NULL,
                search_volume BIGINT NOT NULL DEFAULT 0,
                search_ratio DECIMAL(5,2) NOT NULL DEFAULT 0.00,
                created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                INDEX IDX_keyword (keyword),
                INDEX IDX_period_type (period_type),
                INDEX IDX_period_value (period_value),
                INDEX IDX_keyword_period_type (keyword, period_type),
                UNIQUE INDEX IDX_keyword_period_type_period_value (keyword, period_type, period_value)
            ) ENGINE=InnoDB
        `);

        // Monthly Search Ratios 테이블 생성
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS monthly_search_ratios (
                id INT AUTO_INCREMENT PRIMARY KEY,
                keyword_id INT NULL,
                keyword VARCHAR(255) NOT NULL,
                month_number INT NOT NULL CHECK (month_number BETWEEN 1 AND 12),
                search_ratio DECIMAL(5,2) NOT NULL DEFAULT 0.00,
                analysis_year YEAR NOT NULL,
                created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                INDEX IDX_keyword (keyword),
                INDEX IDX_month_number (month_number),
                INDEX IDX_analysis_year (analysis_year),
                INDEX IDX_keyword_analysis_year (keyword, analysis_year),
                UNIQUE INDEX IDX_keyword_month_number_analysis_year (keyword, month_number, analysis_year)
            ) ENGINE=InnoDB
        `);

        // Keyword Collection Logs 테이블 생성
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS keyword_collection_logs (
                id INT AUTO_INCREMENT PRIMARY KEY,
                base_query_id INT NOT NULL,
                collected_keyword_id INT NOT NULL,
                base_query VARCHAR(255) NOT NULL,
                collected_keyword VARCHAR(255) NOT NULL,
                collection_type ENUM('trending', 'smartblock', 'related_search') NOT NULL,
                rank_position INT NOT NULL DEFAULT 0,
                collected_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                INDEX IDX_base_query_id (base_query_id),
                INDEX IDX_collected_keyword_id (collected_keyword_id),
                INDEX IDX_collection_type (collection_type),
                INDEX IDX_collected_at (collected_at),
                FOREIGN KEY FK_keyword_collection_logs_base_query_id (base_query_id) REFERENCES keywords(id) ON DELETE CASCADE,
                FOREIGN KEY FK_keyword_collection_logs_collected_keyword_id (collected_keyword_id) REFERENCES keywords(id) ON DELETE CASCADE
            ) ENGINE=InnoDB
        `);

        console.log('✅ 모든 테이블이 성공적으로 생성되었습니다.');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // 외래키 제약 조건 비활성화
        await queryRunner.query(`SET FOREIGN_KEY_CHECKS = 0`);
        
        // 테이블 삭제 (역순)
        await queryRunner.query(`DROP TABLE IF EXISTS keyword_collection_logs`);
        await queryRunner.query(`DROP TABLE IF EXISTS monthly_search_ratios`);
        await queryRunner.query(`DROP TABLE IF EXISTS search_trends`);
        await queryRunner.query(`DROP TABLE IF EXISTS related_keywords`);
        await queryRunner.query(`DROP TABLE IF EXISTS keyword_analytics`);
        await queryRunner.query(`DROP TABLE IF EXISTS keywords`);
        
        // 외래키 제약 조건 재활성화
        await queryRunner.query(`SET FOREIGN_KEY_CHECKS = 1`);
        
        console.log('✅ 모든 테이블이 성공적으로 삭제되었습니다.');
    }

}