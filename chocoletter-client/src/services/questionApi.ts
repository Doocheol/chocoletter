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

// 질문 목록 가져오기
let previousQuestionId = 0; // 처음 요청 시 0으로 설정
export async function getQuestion() {
    try {
        // const accessToken = getAccessToken();

        if (!accessToken) {
            throw new Error("AccessToken is missing");
        }

        const res = await axios.get(`/api/v1/letter/question`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            params: {
                previousQuestionId: previousQuestionId, // 쿼리 파라미터 추가
            },
        });

        // 다음 요청을 위한 ID 업데이트
        if (res.data?.id) {
            previousQuestionId = res.data.id; // 응답에서 받은 `id`로 업데이트
        }
        // console.log('Data : ', res.data)

        return res.data.question;
    } catch (err) {
        console.error("getQuestion API 호출 중 에러 발생:", err);
        return null;
    }
}
    