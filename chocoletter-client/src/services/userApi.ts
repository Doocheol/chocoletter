import { authAxios, nonAuthAxios } from "./api"; // 변경된 경로

/**
 * 로그인 함수
 * @param provider - 소셜 로그인 제공자 (예: "twitter")
 * @param code - 인증 코드
 * @returns 로그인 응답 데이터
 */
export async function login(provider: string, code: string) {
  try {
    const res = await nonAuthAxios.get(
      `api/v1/auth/guests/social/${provider}?code=${code}`
    );
    return res.data;
  } catch (err) {
    return Promise.reject(err);
  }
}

/**
 * 닉네임 수정 API 호출
 * @param nickname - 수정할 닉네임 정보
 * @returns 수정 상태
 */
export async function modifyNickname(nickname: object) {
  try {
    const res = await authAxios.patch("api/v1/auth/users/nickname", nickname);
    return res.data.status;
  } catch (err) {
    return Promise.reject(err);
  }
}

/**
 * 상태 메시지 수정 API 호출
 * @param statusMessage - 수정할 상태 메시지 정보
 * @returns 수정 상태
 */
export async function modifyStatusMessage(statusMessage: object) {
  try {
    const res = await authAxios.patch(
      "api/v1/auth/users/status-message",
      statusMessage
    );
    return res.data.status;
  } catch (err) {
    return Promise.reject(err);
  }
}

/**
 * 로그아웃 API 호출
 * @returns 로그아웃 상태
 */
export async function logout() {
  try {
    const res = await authAxios.patch("api/v1/auth/users/logout");
    return res.data.status;
  } catch (err) {
    return Promise.reject(err);
  }
}

/**
 * 사용자 프로필 가져오기 API 호출
 * @param userId - 사용자 ID
 * @returns 사용자 프로필 데이터
 */
export async function getProfile(userId: string) {
  try {
    const res = await nonAuthAxios.get(`api/v1/auth/guests/${userId}`);
    return res.data;
  } catch (err) {
    return Promise.reject(err);
  }
}

/**
 * 알림 가져오기 API 호출
 * @returns 알림 데이터
 */
export async function getNotificationApi() {
  try {
    const res = await authAxios.get("/api/v1/notifications");
    return res.data;
  } catch (err) {
    return Promise.reject(err);
  }
}

/**
 * 알림 읽기 API 호출
 * @param notificationId - 알림 ID
 * @returns 알림 읽기 상태
 */
export async function readNotificationApi(notificationId: number) {
  try {
    const res = await authAxios.post(`/api/v1/notifications/${notificationId}`);
    return res.data;
  } catch (err) {
    return Promise.reject(err);
  }
}
