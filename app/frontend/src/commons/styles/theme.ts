// 테마 색상 상수
export const colors = {
  // 주요 색상
  primary: 'var(--color-primary)',
  primaryLight: 'var(--color-primary-light)',
  primaryDark: 'var(--color-primary-dark)',
  
  // 보조 색상
  secondary: 'var(--color-secondary)',
  secondaryLight: 'var(--color-secondary-light)',
  secondaryDark: 'var(--color-secondary-dark)',
  
  // 액센트 색상
  accent: 'var(--color-accent)',
  accentLight: 'var(--color-accent-light)',
  accentDark: 'var(--color-accent-dark)',
  
  // 상태 색상
  success: 'var(--color-success)',
  successLight: 'var(--color-success-light)',
  successDark: 'var(--color-success-dark)',
  
  warning: 'var(--color-warning)',
  warningLight: 'var(--color-warning-light)',
  warningDark: 'var(--color-warning-dark)',
  
  danger: 'var(--color-danger)',
  dangerLight: 'var(--color-danger-light)',
  dangerDark: 'var(--color-danger-dark)',
  
  info: 'var(--color-info)',
  infoLight: 'var(--color-info-light)',
  infoDark: 'var(--color-info-dark)',
  
  // 중성 색상
  gray50: 'var(--color-gray-50)',
  gray100: 'var(--color-gray-100)',
  gray200: 'var(--color-gray-200)',
  gray300: 'var(--color-gray-300)',
  gray400: 'var(--color-gray-400)',
  gray500: 'var(--color-gray-500)',
  gray600: 'var(--color-gray-600)',
  gray700: 'var(--color-gray-700)',
  gray800: 'var(--color-gray-800)',
  gray900: 'var(--color-gray-900)',
  
  // 배경 색상
  bgPrimary: 'var(--color-bg-primary)',
  bgSecondary: 'var(--color-bg-secondary)',
  bgTertiary: 'var(--color-bg-tertiary)',
  bgCard: 'var(--color-bg-card)',
  bgOverlay: 'var(--color-bg-overlay)',
  
  // 텍스트 색상
  textPrimary: 'var(--color-text-primary)',
  textSecondary: 'var(--color-text-secondary)',
  textTertiary: 'var(--color-text-tertiary)',
  textInverse: 'var(--color-text-inverse)',
  
  // 테두리 색상
  borderPrimary: 'var(--color-border-primary)',
  borderSecondary: 'var(--color-border-secondary)',
  borderFocus: 'var(--color-border-focus)',
} as const;

// 폰트 크기
export const fontSize = {
  xs: 'var(--font-size-xs)',
  sm: 'var(--font-size-sm)',
  base: 'var(--font-size-base)',
  lg: 'var(--font-size-lg)',
  xl: 'var(--font-size-xl)',
  '2xl': 'var(--font-size-2xl)',
  '3xl': 'var(--font-size-3xl)',
  '4xl': 'var(--font-size-4xl)',
} as const;

// 폰트 굵기
export const fontWeight = {
  light: 'var(--font-weight-light)',
  normal: 'var(--font-weight-normal)',
  medium: 'var(--font-weight-medium)',
  semibold: 'var(--font-weight-semibold)',
  bold: 'var(--font-weight-bold)',
  extrabold: 'var(--font-weight-extrabold)',
} as const;

// 줄 간격
export const lineHeight = {
  tight: 'var(--line-height-tight)',
  normal: 'var(--line-height-normal)',
  relaxed: 'var(--line-height-relaxed)',
} as const;

// 간격
export const spacing = {
  xs: 'var(--spacing-xs)',
  sm: 'var(--spacing-sm)',
  md: 'var(--spacing-md)',
  lg: 'var(--spacing-lg)',
  xl: 'var(--spacing-xl)',
  '2xl': 'var(--spacing-2xl)',
} as const;

// 테두리 반지름
export const borderRadius = {
  sm: 'var(--border-radius-sm)',
  md: 'var(--border-radius-md)',
  lg: 'var(--border-radius-lg)',
  xl: 'var(--border-radius-xl)',
  full: 'var(--border-radius-full)',
} as const;

// 그림자
export const shadow = {
  sm: 'var(--shadow-sm)',
  md: 'var(--shadow-md)',
  lg: 'var(--shadow-lg)',
  xl: 'var(--shadow-xl)',
} as const;

// 폰트 스타일 믹스인
export const fontStyles = {
  heading: `
    font-size: ${fontSize['2xl']};
    font-weight: ${fontWeight.bold};
    line-height: ${lineHeight.tight};
    color: ${colors.textPrimary};
  `,
  title: `
    font-size: ${fontSize.xl};
    font-weight: ${fontWeight.semibold};
    line-height: ${lineHeight.tight};
    color: ${colors.textPrimary};
  `,
  body: `
    font-size: ${fontSize.base};
    font-weight: ${fontWeight.normal};
    line-height: ${lineHeight.normal};
    color: ${colors.textPrimary};
  `,
  content: `
    font-size: ${fontSize.sm};
    font-weight: ${fontWeight.normal};
    line-height: ${lineHeight.relaxed};
    color: ${colors.textSecondary};
  `,
  caption: `
    font-size: ${fontSize.xs};
    font-weight: ${fontWeight.normal};
    line-height: ${lineHeight.normal};
    color: ${colors.textTertiary};
  `,
} as const;

// 테마 객체
export const theme = {
  colors,
  fontSize,
  fontWeight,
  lineHeight,
  spacing,
  borderRadius,
  shadow,
  fontStyles,
} as const;

export default theme;
