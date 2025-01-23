import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { deleteUserInfo, getUserInfo } from './userInfo'; // User Info
import { reissueTokenApi } from './tokenApi'; // Reissue Token API

// Vite 환경 변수 사용 (process.env.REACT_APP_API → import.meta.env.VITE_API_BASE_URL)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

// 인증이 필요한 Axios 인스턴스
const authAxios = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터: 토큰을 헤더에 추가
authAxios.interceptors.request.use(
  (config: AxiosRequestConfig): AxiosRequestConfig => {
    const userInfo = getUserInfo();
    if (userInfo && userInfo.accessToken) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${userInfo.accessToken}`,
      };
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터: 토큰 재발급 및 에러 처리
authAxios.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    if (error.response) {
      const { status, data } = error.response;
      if (status === 401) {
        if (data.message === 'reissue') {
          try {
            const reissueResponse = await reissueTokenApi();
            if (reissueResponse.status === 'success') {
              const newAccessToken = reissueResponse.data.accessToken;
              window.localStorage.setItem('accessToken', newAccessToken);
              // 기존 요청을 새로운 토큰으로 재시도
              if (error.config.headers) {
                error.config.headers['Authorization'] = `Bearer ${newAccessToken}`;
              }
              return axios(error.config);
            }
          } catch (reissueError) {
            console.error('토큰 재발급 실패:', reissueError);
          }
        } else {
          deleteUserInfo();
          alert('다시 로그인해주세요');
          window.location.replace('/');
        }
        return new Promise(() => {}); // pending 상태로 유지하여 후속 처리를 막음
      }
    }
    return Promise.reject(error);
  }
);

// 인증이 필요 없는 Axios 인스턴스
const nonAuthAxios = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export { authAxios, nonAuthAxios };
