/**
 * 유틸리티 함수들
 */

/**
 * 랜덤 딜레이 (봇 탐지 방지)
 */
async function randomDelay(sleepMinMs = 200, sleepMaxMs = 600) {
  const delay =
    Math.floor(Math.random() * (sleepMaxMs - sleepMinMs + 1)) + sleepMinMs;
  await new Promise((resolve) => setTimeout(resolve, delay));
}

/**
 * 키워드 카테고리 분류
 */
function categorizeKeyword(keyword) {
  const text = keyword.toLowerCase();

  // 위치 기반 키워드
  if (
    text.includes("근처") ||
    text.includes("내주변") ||
    text.includes("주변") ||
    text.includes("내근처")
  ) {
    return "위치기반";
  }

  // 지역별 키워드 (지명이 포함된 경우)
  const regions = [
    "서울",
    "부산",
    "대구",
    "인천",
    "광주",
    "대전",
    "울산",
    "세종",
    "경기",
    "강원",
    "충북",
    "충남",
    "전북",
    "전남",
    "경북",
    "경남",
    "제주",
    "강남",
    "홍대",
    "명동",
    "이태원",
    "성수",
    "연남동",
    "서촌",
    "부암동",
    "여의도",
    "광안리",
    "전포",
    "명지",
    "양평",
    "가평",
    "대부도",
    "목포",
    "애월",
    "일산",
  ];

  for (const region of regions) {
    if (text.includes(region)) {
      return "지역별";
    }
  }

  // 블로그/리뷰 관련 키워드 (긴 텍스트나 특정 단어 포함)
  if (
    text.includes("후기") ||
    text.includes("리뷰") ||
    text.includes("추천") ||
    text.includes("맛집") ||
    text.includes("데이트") ||
    text.includes("분위기") ||
    text.includes("외관") ||
    text.includes("내부") ||
    text.includes("메뉴") ||
    text.includes("케이크") ||
    text.includes("위치") ||
    text.includes("차림판") ||
    text.includes("외부") ||
    text.includes("종류") ||
    text.includes("구성") ||
    text.length > 15
  ) {
    // 긴 텍스트는 대부분 블로그 제목
    return "블로그리뷰";
  }

  // 기본 카테고리 (단순 키워드)
  return "일반";
}

/**
 * 키워드 필터링 (공통 필터링 로직)
 */
function isValidKeyword(text, originalQuery) {
  if (!text || text.trim().length < 2 || text.trim().length > 30) {
    return false;
  }

  const cleanText = text.trim();

  // 공통 제외 키워드들
  const excludeKeywords = [
    "더보기",
    "이전",
    "다음",
    "네이버",
    "검색",
    "광고",
    "Keep",
    "함께 많이 찾는",
    "인기주제",
    "트렌드",
  ];

  for (const exclude of excludeKeywords) {
    if (cleanText.includes(exclude)) {
      return false;
    }
  }

  // 원래 검색어와 같으면 제외
  if (cleanText === originalQuery) {
    return false;
  }

  // 한글, 영문, 숫자가 포함되어야 함
  if (!/[가-힣a-zA-Z0-9]/.test(cleanText)) {
    return false;
  }

  return true;
}

module.exports = {
  randomDelay,
  categorizeKeyword,
  isValidKeyword,
};
