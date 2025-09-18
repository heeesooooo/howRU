export const pad2 = (n: number) => String(n).padStart(2, '0');

// e.g., 오늘은 YYYY년 MM월 DD일
export const formatKoreanDateYYYYMMDD = (date: Date) =>
  `${date.getFullYear()}년 ${pad2(date.getMonth() + 1)}월 ${pad2(date.getDate())}일`;

// e.g., YYYY년 M월 D일 금요일 (월/일 0패딩 없음)
export const formatKoreanFullDateWithWeekday = (date: Date) => {
  const weekdays = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
  const w = weekdays[date.getDay()];
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 ${w}`;
};
