import { MyUserInfo } from "../types/user";

/**
 * 사용자 정보를 로컬 스토리지에 저장하는 함수
 * @param userInfo - 저장할 사용자 정보
 */
export const savingUserInfo = (userInfo: MyUserInfo): void => {
  window.localStorage.setItem("userId", userInfo.userId);
  window.localStorage.setItem("accessToken", userInfo.accessToken);
};

/**
 * 로컬 스토리지에서 사용자 정보를 가져오는 함수
 * @returns 사용자 정보 객체
 */
export const getUserInfo = (): MyUserInfo | null => {
  const userId = window.localStorage.getItem("userId");
  const accessToken = window.localStorage.getItem("accessToken");

  if (userId && accessToken) {
    return { userId, accessToken };
  }

  return null;
};

/**
 * 로컬 스토리지에서 사용자 정보를 삭제하는 함수
 */
export const deleteUserInfo = (): void => {
  window.localStorage.removeItem("userId");
  window.localStorage.removeItem("accessToken");
  window.localStorage.removeItem("recoil-persist"); // Recoil 상태 관리 관련 키 삭제
};
