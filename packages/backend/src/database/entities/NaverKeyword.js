const { EntitySchema } = require("typeorm");

/**
 * 네이버 키워드 엔티티
 * 자동완성, 함께 많이 찾는, 인기주제, 연관검색어 데이터를 저장
 */
const NaverKeyword = new EntitySchema({
  name: "NaverKeyword",
  tableName: "naver_keywords",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    query: {
      type: "varchar",
      length: 100,
      nullable: false,
      comment: "기준 검색어 (예: '맛집')",
    },
    keywordType: {
      name: "keyword_type",
      type: "varchar",
      length: 50,
      nullable: false,
      comment:
        "키워드 타입: autosuggest, togetherSearched, hotTopics, relatedKeywords",
    },
    category: {
      type: "varchar",
      length: 50,
      default: "일반",
      comment: "키워드 카테고리 (자동 분류)",
    },
    text: {
      type: "varchar",
      length: 255,
      nullable: false,
      comment: "키워드 텍스트",
    },
    href: {
      type: "text",
      nullable: true,
      comment: "관련 링크 (없으면 NULL)",
    },
    imageAlt: {
      name: "imageAlt",
      type: "text",
      nullable: true,
      comment: "이미지 대체 텍스트 (인기주제에서 사용)",
    },
    rank: {
      type: "int",
      nullable: false,
      comment: "섹션 내 순위",
    },
    grp: {
      type: "int",
      default: 1,
      comment: "페이지/슬라이드 그룹 번호",
    },
    createdAt: {
      name: "created_at",
      type: "timestamp",
      default: () => "CURRENT_TIMESTAMP",
      nullable: false,
      comment: "생성 시간",
    },
  },
  indices: [
    {
      name: "IDX_NAVER_KEYWORDS_QUERY",
      columns: ["query"],
    },
    {
      name: "IDX_NAVER_KEYWORDS_TYPE",
      columns: ["keywordType"],
    },
    {
      name: "IDX_NAVER_KEYWORDS_CATEGORY",
      columns: ["category"],
    },
    {
      name: "IDX_NAVER_KEYWORDS_CREATED_AT",
      columns: ["createdAt"],
    },
    {
      name: "IDX_NAVER_KEYWORDS_QUERY_TYPE",
      columns: ["query", "keywordType"],
    },
    {
      name: "IDX_NAVER_KEYWORDS_QUERY_CATEGORY",
      columns: ["query", "category"],
    },
  ],
});

module.exports = { NaverKeyword };
