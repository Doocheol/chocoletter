import baseAxios from "axios";

// giftAPI 인스턴스 설정 
export const axios = baseAxios.create({
    baseURL: import.meta.env.VITE_API_SERVER_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

const accessToken = '123'

// 언박싱 룸 권한 체크
export async function checkAuthVideoRoom(roomId: string) {
    try {
        // const accessToken = getAccessToken();

        if (!accessToken) {
            throw new Error("AccessToken is missing");
        }
        const res = await axios.get(`/api/v1/unboxing-room/${roomId}/verify`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            }
        })
        console.log("권한 체크(200) : ", res.data)
        return res.data;
    } catch (err) {
        console.error("언박싱 거절 종류 : ", err);
        return err;
    }
}

    // 언박싱 종료 시 권한 정지
export async function terminateVideoRoom(roomId: string) {
    try {
        // const accessToken = getAccessToken();

        if (!accessToken) {
            throw new Error("AccessToken is missing");
        }

        const res = await axios.patch(`/api/v1/unboxing-room/${roomId}/end`);
        console.log("안전하게 화상채팅 종료")
        return res.data;
    } catch (err) {
        console.log("종료 오류 : ", err);
        return null;
    }
}