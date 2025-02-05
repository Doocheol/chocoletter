import api from "./api";

// 채팅방 리스트 가져오기
// export async function getChatRooms() {
//   try {
//     const res = await api.get(`/api/v1/chat-room/all`);
//     const data = res.data;
//     return data;
//   } catch (err) {
//     console.error("getChatRooms API 호출 중 에러 발생:", err);
//     throw err;
//   }
// }
const accessToken = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI0MSIsImlhdCI6MTczODY1ODAwMiwiZXhwIjoxNzM5MjYyODAyfQ.T-4wIrOTJBchmIBNVdzzbP_iJKxAcKTiEh1c40uswZw'
export async function getChatRooms() {
  try {
    const res = await api.get(`/api/v1/chat-room/all`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    const data = res.data;
    return data;
  } catch (err) {
    console.error("getChatRooms API 호출 중 에러 발생:", err);
    throw err;
  }
}