import {axios, nonAuthAxios} from "./api";

/**
 * 로그인 함수
 * @returns 로그인 응답 데이터
 */
export async function login() {
  try {
    const res = await nonAuthAxios.get(
      `/api/v1/auth/kakao`
    );
    return res.data;
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
    const res = await axios.post(
      `/api/v1/auth/logout`
    );
    return res.data.status;
  } catch (err) {
    return Promise.reject(err);
  }
}