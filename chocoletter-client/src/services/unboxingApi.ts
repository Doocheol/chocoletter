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
const accessToken = 123 //  나중에 삭제!!
// function getAccessToken(): string | null {
//     return localStorage.getItem("accessToken"); 
// }


// UnboxingTime 가져오기
export async function getNotFixedUnboxingTime(giftId: number) {
    try {
        // const accessToken = getAccessToken();

        if (!accessToken) {
            throw new Error("AccessToken is missing");
        }

        const res = await axios.get(`/api/v1/gift/${giftId}/unboxing/invitation`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        const data = res.data;
        // console.log("unboxing time:", data);
        return data;
    } catch (err) {
        console.error("getNotFixedUnboxingTime API 호출 중 에러 발생:", err);
        return null;
    }
}

// Unboxing 일정 수락
export async function patchUnboxingAccept(giftId: number) {
    try {
        // const accessToken = getAccessToken();

        if (!accessToken) {
            throw new Error("AccessToken is missing");
        }

        const res = await axios.patch(`/api/v1/gift/${giftId}/unboxing/invitation/accept`, null,
            {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        const data = res.data;
        return data;
    } catch (err) {
        console.error("patchUnboxingAccept API 호출 중 에러 발생:", err);
        return null;
    }
}


// Unboxing 일정 거절
export async function patchUnboxingReject(giftId: number) {
    try {
        // const accessToken = getAccessToken();

        if (!accessToken) {
            throw new Error("AccessToken is missing");
        }

        const res = await axios.patch(`/api/v1/gift/${giftId}/unboxing/invitation/reject`, null,
            {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        const data = res.data;
        return data;
    } catch (err) {
        console.error("patchUnboxingReject API 호출 중 에러 발생:", err);
        return null;
    }
}


  
