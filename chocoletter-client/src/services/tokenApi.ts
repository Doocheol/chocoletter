import { authAxios } from './api';

/**
 * 토큰 재발급 API의 응답 타입
 */
interface ReissueTokenResponse {
  status: string;
  data: {
    accessToken: string;
  };
}

/**
 * 토큰을 재발급하는 함수
 * @returns 재발급된 토큰 데이터
 */
export const reissueTokenApi = async (): Promise<ReissueTokenResponse> => {
  try {
    const response = await authAxios.get<ReissueTokenResponse>('/api/v1/auth/retoken');
    return response.data;
  } catch (err) {
    throw err;
  }
};
