require("reflect-metadata");
require("dotenv").config();
const { DataSource } = require("typeorm");
const { NaverKeyword } = require("./entities/NaverKeyword");

/**
 * TypeORM DataSource 설정
 * MySQL 데이터베이스 연결을 위한 설정
 */
const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.MYSQL_HOST || "localhost",
  port: parseInt(process.env.MYSQL_PORT) || 3306,
  username: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE || "keyword_finder",
  charset: "utf8mb4",
  synchronize: false, // 수동 스키마 관리로 변경
  logging: process.env.NODE_ENV === "development",
  entities: [NaverKeyword],
  migrations: [],
  subscribers: [],
});

/**
 * 데이터베이스 연결 초기화
 */
async function initializeDatabase() {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log("✅ TypeORM MySQL 데이터베이스에 연결되었습니다.");

      // 테이블 존재 여부 확인 및 생성
      await ensureTablesExist();
    }
    return AppDataSource;
  } catch (error) {
    console.error("❌ 데이터베이스 연결 실패:", error);
    throw error;
  }
}

/**
 * 필요한 테이블들이 존재하는지 확인하고 없으면 생성
 */
async function ensureTablesExist() {
  try {
    const queryRunner = AppDataSource.createQueryRunner();

    // naver_keywords 테이블 존재 확인
    const tableExists = await queryRunner.hasTable("naver_keywords");

    if (!tableExists) {
      console.log("📋 naver_keywords 테이블이 없습니다. 생성 중...");

      // 테이블 생성 SQL
      await queryRunner.query(`
        CREATE TABLE naver_keywords (
          id INT AUTO_INCREMENT PRIMARY KEY,
          query VARCHAR(100) NOT NULL COMMENT '기준 검색어',
          keyword_type VARCHAR(50) NOT NULL COMMENT '키워드 타입',
          category VARCHAR(50) DEFAULT '일반' COMMENT '키워드 카테고리',
          text VARCHAR(255) NOT NULL COMMENT '키워드 텍스트',
          href TEXT COMMENT '관련 링크',
          imageAlt TEXT COMMENT '이미지 대체 텍스트',
          \`rank\` INT NOT NULL COMMENT '섹션 내 순위',
          grp INT DEFAULT 1 COMMENT '페이지/슬라이드 그룹 번호',
          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '생성 시간'
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `);

      // 인덱스 생성
      await queryRunner.query(
        `CREATE INDEX idx_naver_keywords_query ON naver_keywords(query);`
      );
      await queryRunner.query(
        `CREATE INDEX idx_naver_keywords_type ON naver_keywords(keyword_type);`
      );
      await queryRunner.query(
        `CREATE INDEX idx_naver_keywords_category ON naver_keywords(category);`
      );
      await queryRunner.query(
        `CREATE INDEX idx_naver_keywords_created_at ON naver_keywords(created_at);`
      );

      console.log("✅ naver_keywords 테이블이 생성되었습니다.");
    } else {
      console.log("✅ naver_keywords 테이블이 이미 존재합니다.");
    }

    // 2. naver_search_results 테이블 확인/생성
    const searchResultsTableExists = await queryRunner.hasTable(
      "naver_search_results"
    );
    if (!searchResultsTableExists) {
      console.log("📋 naver_search_results 테이블이 없습니다. 생성 중...");
      await queryRunner.query(`
        CREATE TABLE naver_search_results (
          id INT AUTO_INCREMENT PRIMARY KEY,
          query VARCHAR(100) NOT NULL COMMENT '검색어',
          title TEXT NOT NULL COMMENT '제목',
          link TEXT NOT NULL COMMENT '링크',
          description TEXT COMMENT '설명',
          bloggername VARCHAR(100) COMMENT '블로거명',
          bloggerlink TEXT COMMENT '블로거 링크',
          postdate VARCHAR(20) COMMENT '포스트 날짜',
          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '생성 시간'
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `);
      await queryRunner.query(
        `CREATE INDEX idx_naver_search_results_query ON naver_search_results(query);`
      );
      await queryRunner.query(
        `CREATE INDEX idx_naver_search_results_created_at ON naver_search_results(created_at);`
      );
      console.log("✅ naver_search_results 테이블이 생성되었습니다.");
    } else {
      console.log("✅ naver_search_results 테이블이 이미 존재합니다.");
    }

    // 3. naver_datalab_trends 테이블 확인/생성
    const trendsTableExists = await queryRunner.hasTable(
      "naver_datalab_trends"
    );
    if (!trendsTableExists) {
      console.log("📋 naver_datalab_trends 테이블이 없습니다. 생성 중...");
      await queryRunner.query(`
        CREATE TABLE naver_datalab_trends (
          id INT AUTO_INCREMENT PRIMARY KEY,
          query VARCHAR(100) NOT NULL COMMENT '검색어',
          period VARCHAR(20) NOT NULL COMMENT '기간 (YYYY-MM-DD)',
          ratio DECIMAL(5,2) NOT NULL COMMENT '검색 비율',
          device VARCHAR(20) DEFAULT NULL COMMENT '디바이스 (pc/mobile)',
          gender VARCHAR(10) DEFAULT NULL COMMENT '성별 (m/f)',
          age_group VARCHAR(20) DEFAULT NULL COMMENT '연령대',
          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '생성 시간'
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `);
      await queryRunner.query(
        `CREATE INDEX idx_naver_datalab_trends_query ON naver_datalab_trends(query);`
      );
      await queryRunner.query(
        `CREATE INDEX idx_naver_datalab_trends_period ON naver_datalab_trends(period);`
      );
      console.log("✅ naver_datalab_trends 테이블이 생성되었습니다.");
    } else {
      console.log("✅ naver_datalab_trends 테이블이 이미 존재합니다.");
      // 기존 테이블 스키마 업데이트 확인
      try {
        await queryRunner.query(
          `ALTER TABLE naver_datalab_trends ADD COLUMN device VARCHAR(20) DEFAULT NULL COMMENT '디바이스 (pc/mobile)'`
        );
        console.log("✅ device 컬럼 추가됨");
      } catch (e) {
        /* 이미 존재할 수 있음 */
      }
      try {
        await queryRunner.query(
          `ALTER TABLE naver_datalab_trends ADD COLUMN gender VARCHAR(10) DEFAULT NULL COMMENT '성별 (m/f)'`
        );
        console.log("✅ gender 컬럼 추가됨");
      } catch (e) {
        /* 이미 존재할 수 있음 */
      }
      try {
        await queryRunner.query(
          `ALTER TABLE naver_datalab_trends ADD COLUMN age_group VARCHAR(20) DEFAULT NULL COMMENT '연령대'`
        );
        console.log("✅ age_group 컬럼 추가됨");
      } catch (e) {
        /* 이미 존재할 수 있음 */
      }
    }

    // 4. naver_related_keywords 테이블 확인/생성
    const relatedKeywordsTableExists = await queryRunner.hasTable(
      "naver_related_keywords"
    );
    if (!relatedKeywordsTableExists) {
      console.log("📋 naver_related_keywords 테이블이 없습니다. 생성 중...");
      await queryRunner.query(`
        CREATE TABLE naver_related_keywords (
          id INT AUTO_INCREMENT PRIMARY KEY,
          query VARCHAR(100) NOT NULL COMMENT '기준 검색어',
          related_keyword VARCHAR(100) NOT NULL COMMENT '연관 키워드',
          monthly_pc_qc_cnt INT DEFAULT 0 COMMENT '월간 PC 검색량',
          monthly_mobile_qc_cnt INT DEFAULT 0 COMMENT '월간 모바일 검색량',
          competition_index DECIMAL(5,2) DEFAULT 0 COMMENT '경쟁 지수',
          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '생성 시간'
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `);
      await queryRunner.query(
        `CREATE INDEX idx_naver_related_keywords_query ON naver_related_keywords(query);`
      );
      await queryRunner.query(
        `CREATE INDEX idx_naver_related_keywords_related ON naver_related_keywords(related_keyword);`
      );
      console.log("✅ naver_related_keywords 테이블이 생성되었습니다.");
    } else {
      console.log("✅ naver_related_keywords 테이블이 이미 존재합니다.");
    }

    // 5. naver_comprehensive_analysis 테이블 확인/생성
    const analysisTableExists = await queryRunner.hasTable(
      "naver_comprehensive_analysis"
    );
    if (!analysisTableExists) {
      console.log(
        "📋 naver_comprehensive_analysis 테이블이 없습니다. 생성 중..."
      );
      await queryRunner.query(`
        CREATE TABLE naver_comprehensive_analysis (
          id INT AUTO_INCREMENT PRIMARY KEY,
          query VARCHAR(100) NOT NULL COMMENT '검색어',
          analysis_data JSON NOT NULL COMMENT '분석 데이터',
          generated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '생성 시간',
          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '생성 시간'
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `);
      await queryRunner.query(
        `CREATE INDEX idx_naver_comprehensive_analysis_query ON naver_comprehensive_analysis(query);`
      );
      console.log("✅ naver_comprehensive_analysis 테이블이 생성되었습니다.");
    } else {
      console.log("✅ naver_comprehensive_analysis 테이블이 이미 존재합니다.");
      // 기존 테이블 스키마 업데이트 확인
      try {
        await queryRunner.query(
          `ALTER TABLE naver_comprehensive_analysis ADD COLUMN generated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '생성 시간'`
        );
        console.log("✅ generated_at 컬럼 추가됨");
      } catch (e) {
        /* 이미 존재할 수 있음 */
      }
    }

    await queryRunner.release();
  } catch (error) {
    console.error("❌ 테이블 확인/생성 중 오류:", error);
    // 테이블 생성 실패는 치명적이지 않으므로 계속 진행
  }
}

/**
 * 데이터베이스 연결 종료
 */
async function closeDatabase() {
  try {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      console.log("✅ 데이터베이스 연결이 종료되었습니다.");
    }
  } catch (error) {
    console.error("❌ 데이터베이스 연결 종료 실패:", error);
    throw error;
  }
}

module.exports = {
  AppDataSource,
  initializeDatabase,
  closeDatabase,
};
