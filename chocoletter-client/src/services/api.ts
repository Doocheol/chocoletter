import baseAxios from "axios";
import {deleteUserInfo, getUserInfo} from "./userInfo";
import { toast } from "react-toastify";
import { reissueTokenApi } from "./userApi";

export const axios = baseAxios.create({
  baseURL: import.meta.env.VITE_API_SERVER_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});


axios.interceptors.request.use((config) => {
  const userInfo = getUserInfo();
  if (userInfo) {
    config.headers["Authorization"] = `Bearer ${userInfo.accessToken}`;
  }
  return config;
});

axios.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (error.response && error.response.status) {
      if (error.response.status === 401) {
        if (error.response.data.message === "reissue") {
          const reissueToken = async function () {
            const data = await reissueTokenApi();
            if (data.status === "success") {
              window.localStorage.setItem("accessToken", data.data.accessToken);
            }
          };
          reissueToken();
        }
        else {
          deleteUserInfo();
          toast.error("다시 로그인이 필요합니다.");
          window.location.replace("/");
        }
        return new Promise(() => {});
      } else {
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export const nonAuthAxios = baseAxios.create({
  baseURL: import.meta.env.VITE_API_SERVER_URL,
  headers: {
    "Content-Type": "application/json",
  },
});