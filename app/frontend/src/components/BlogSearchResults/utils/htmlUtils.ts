/**
 * HTML 태그를 제거하는 유틸리티 함수
 * @param html HTML 문자열
 * @returns 태그가 제거된 순수 텍스트
 */
export const stripHtml = (html: string): string => {
  return html.replace(/<[^>]*>/g, '');
};

/**
 * 텍스트 길이를 제한하는 함수
 * @param text 원본 텍스트
 * @param maxLength 최대 길이
 * @returns 제한된 길이의 텍스트
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * 날짜 형식을 변환하는 함수
 * @param dateString 날짜 문자열 (YYYYMMDD 형식)
 * @returns 포맷된 날짜 문자열
 */
export const formatPostDate = (dateString: string): string => {
  if (!dateString || dateString.length !== 8) return dateString;
  
  const year = dateString.substring(0, 4);
  const month = dateString.substring(4, 6);
  const day = dateString.substring(6, 8);
  
  return `${year}.${month}.${day}`;
};
