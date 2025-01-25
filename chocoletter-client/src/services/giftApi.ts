// import axios from 'axios';
import baseAxios from "axios";

// giftAPI 인스턴스 설정 
export const axios = baseAxios.create({
    baseURL: import.meta.env.VITE_API_SERVER_URL,
    headers: {
        "Content-Type": "application/json",
      },
    withCredentials: true,
  });


  
// AccessToken 가져오기
const accessToken = '123' //  나중에 삭제!!
// function getAccessToken(): string | null {
//     return localStorage.getItem("accessToken"); 
// }

// 선물 정보 가져오기
export async function getGiftDetail(giftId: number) {
    try {
        // const accessToken = getAccessToken();

        if (!accessToken) {
            throw new Error("AccessToken is missing");
        }

        const res = await axios.get(`/api/v1/gift/${giftId}/receive`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        const data = res.data;
        console.log("Gift 데이터:", data);
        return data;
    } catch (err) {
        console.error("getGiftDetail API 호출 중 에러 발생:", err);
        throw err;
    }
  }
  
