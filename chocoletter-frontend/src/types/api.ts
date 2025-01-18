/**
 * 사용자 데이터 응답 타입
 * - Spring Boot가 반환하는 성공 응답
 */
export type UserResponse = {
  name: string; // 사용자 이름
  profile_url: string; // 프로필 이미지 URL
  is_first_login: boolean;
};

/**
 * 에러 데이터 응답 타입
 * - Spring Boot가 반환하는 실패 응답
 */
export type ErrorResponse = {
  status: number; // HTTP 상태 코드
  errorMessage: string; // 에러 메시지
};

/**
 * API 응답 공통 타입
 * - 성공 타입(T) 또는 에러 타입
 */
export type ApiResponse<T> = T | ErrorResponse;
