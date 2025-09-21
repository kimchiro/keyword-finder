"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateInitialTables1700000000000 = void 0;
class CreateInitialTables1700000000000 {
    constructor() {
        this.name = 'CreateInitialTables1700000000000';
    }
    async up(queryRunner) {
        await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS keyword_analytics (
        id INT AUTO_INCREMENT PRIMARY KEY,
        keyword VARCHAR(255) NOT NULL,
        monthly_search_pc BIGINT DEFAULT 0,
        monthly_search_mobile BIGINT DEFAULT 0,
        monthly_search_total BIGINT DEFAULT 0,
        monthly_content_blog INT DEFAULT 0,
        monthly_content_cafe INT DEFAULT 0,
        monthly_content_all INT DEFAULT 0,
        estimated_search_yesterday BIGINT DEFAULT 0,
        estimated_search_end_month BIGINT DEFAULT 0,
        saturation_index_blog DECIMAL(5,2) DEFAULT 0,
        saturation_index_cafe DECIMAL(5,2) DEFAULT 0,
        saturation_index_all DECIMAL(5,2) DEFAULT 0,
        analysis_date DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY unique_keyword_date (keyword, analysis_date),
        INDEX idx_keyword (keyword),
        INDEX idx_analysis_date (analysis_date),
        INDEX idx_monthly_search_total (monthly_search_total)
      )
    `);
        await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS related_keywords (
        id INT AUTO_INCREMENT PRIMARY KEY,
        base_keyword VARCHAR(255) NOT NULL,
        related_keyword VARCHAR(255) NOT NULL,
        monthly_search_volume BIGINT DEFAULT 0,
        blog_cumulative_posts INT DEFAULT 0,
        similarity_score ENUM('낮음', '보통', '높음') DEFAULT '보통',
        rank_position INT NOT NULL,
        analysis_date DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY unique_base_related_date (base_keyword, related_keyword, analysis_date),
        INDEX idx_base_keyword (base_keyword),
        INDEX idx_analysis_date (analysis_date),
        INDEX idx_rank_position (rank_position)
      )
    `);
        await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS search_trends (
        id INT AUTO_INCREMENT PRIMARY KEY,
        keyword VARCHAR(255) NOT NULL,
        period_type ENUM('daily', 'weekly', 'monthly') NOT NULL,
        period_value VARCHAR(20) NOT NULL,
        search_volume BIGINT DEFAULT 0,
        search_ratio DECIMAL(5,2) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_keyword_period (keyword, period_type, period_value),
        INDEX idx_keyword (keyword),
        INDEX idx_period_type (period_type),
        INDEX idx_period_value (period_value)
      )
    `);
        await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS monthly_search_ratios (
        id INT AUTO_INCREMENT PRIMARY KEY,
        keyword VARCHAR(255) NOT NULL,
        month_number INT NOT NULL CHECK (month_number BETWEEN 1 AND 12),
        search_ratio DECIMAL(5,2) DEFAULT 0,
        analysis_year YEAR NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_keyword_month_year (keyword, month_number, analysis_year),
        INDEX idx_keyword (keyword),
        INDEX idx_month_number (month_number),
        INDEX idx_analysis_year (analysis_year)
      )
    `);
        await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS weekday_search_ratios (
        id INT AUTO_INCREMENT PRIMARY KEY,
        keyword VARCHAR(255) NOT NULL,
        weekday_number INT NOT NULL CHECK (weekday_number BETWEEN 1 AND 7),
        search_ratio DECIMAL(5,2) DEFAULT 0,
        analysis_date DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_keyword_weekday_date (keyword, weekday_number, analysis_date),
        INDEX idx_keyword (keyword),
        INDEX idx_weekday_number (weekday_number),
        INDEX idx_analysis_date (analysis_date)
      )
    `);
        await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS gender_search_ratios (
        id INT AUTO_INCREMENT PRIMARY KEY,
        keyword VARCHAR(255) NOT NULL,
        male_ratio DECIMAL(5,2) DEFAULT 0,
        female_ratio DECIMAL(5,2) DEFAULT 0,
        analysis_date DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_keyword_date (keyword, analysis_date),
        INDEX idx_keyword (keyword),
        INDEX idx_analysis_date (analysis_date)
      )
    `);
        await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS issue_analysis (
        id INT AUTO_INCREMENT PRIMARY KEY,
        keyword VARCHAR(255) NOT NULL,
        issue_type ENUM('급상승', '안정', '하락', '신규') NOT NULL,
        issue_score DECIMAL(5,2) DEFAULT 0,
        trend_direction ENUM('상승', '하락', '유지') DEFAULT '유지',
        volatility_score DECIMAL(5,2) DEFAULT 0,
        analysis_date DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_keyword_date (keyword, analysis_date),
        INDEX idx_keyword (keyword),
        INDEX idx_issue_type (issue_type),
        INDEX idx_analysis_date (analysis_date)
      )
    `);
        await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS intent_analysis (
        id INT AUTO_INCREMENT PRIMARY KEY,
        keyword VARCHAR(255) NOT NULL,
        informational_ratio DECIMAL(5,2) DEFAULT 0,
        commercial_ratio DECIMAL(5,2) DEFAULT 0,
        primary_intent ENUM('정보성', '상업성', '혼합') DEFAULT '혼합',
        confidence_score DECIMAL(5,2) DEFAULT 0,
        analysis_date DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_keyword_date (keyword, analysis_date),
        INDEX idx_keyword (keyword),
        INDEX idx_primary_intent (primary_intent),
        INDEX idx_analysis_date (analysis_date)
      )
    `);
        await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS keyword_collection_logs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        base_query VARCHAR(255) NOT NULL,
        collected_keyword VARCHAR(255) NOT NULL,
        collection_type ENUM('autosuggest', 'related', 'trending') NOT NULL,
        source_page VARCHAR(100) DEFAULT 'naver',
        rank_position INT DEFAULT 0,
        collected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_base_query (base_query),
        INDEX idx_collection_type (collection_type),
        INDEX idx_collected_at (collected_at)
      )
    `);
        console.log('✅ 모든 테이블이 성공적으로 생성되었습니다.');
    }
    async down(queryRunner) {
        await queryRunner.query('DROP TABLE IF EXISTS keyword_collection_logs');
        await queryRunner.query('DROP TABLE IF EXISTS intent_analysis');
        await queryRunner.query('DROP TABLE IF EXISTS issue_analysis');
        await queryRunner.query('DROP TABLE IF EXISTS gender_search_ratios');
        await queryRunner.query('DROP TABLE IF EXISTS weekday_search_ratios');
        await queryRunner.query('DROP TABLE IF EXISTS monthly_search_ratios');
        await queryRunner.query('DROP TABLE IF EXISTS search_trends');
        await queryRunner.query('DROP TABLE IF EXISTS related_keywords');
        await queryRunner.query('DROP TABLE IF EXISTS keyword_analytics');
        console.log('✅ 모든 테이블이 성공적으로 삭제되었습니다.');
    }
}
exports.CreateInitialTables1700000000000 = CreateInitialTables1700000000000;
//# sourceMappingURL=1700000000000-CreateInitialTables.js.map