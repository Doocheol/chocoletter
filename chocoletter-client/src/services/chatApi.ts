import api from "./api";

// 채팅방 리스트 가져오기
export async function getChatRooms() {
  try {
    const res = await api.get(`/api/v1/chat-room/all`);
    const data = res.data;
    return data;
  } catch (err) {
    console.error("getChatRooms API 호출 중 에러 발생:", err);
    return null;
  }
}