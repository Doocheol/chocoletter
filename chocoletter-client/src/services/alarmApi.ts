import api from "./api";

export interface Alarm {
  alarmId: number;
  alarmType: "ACCEPT_SPECIAL" | "REJECT_SPECIAL" | "RECEIVER_SPECIAL" | "UNBOXING_NOTICE";
  partnerName: string;
  unboxingTime?: string; // 일부 알림은 언박싱 시간이 있을 수 있음
  giftId: number | null;
  read: boolean;
}

/**
 * 모든 알림 데이터를 GET 요청으로 받아옵니다.
 * @returns {Promise<Alarm[]>} 알림 데이터 배열
 */
export async function getAllAlarms(): Promise<Alarm[]> {
  try {
    const res = await api.get("/api/v1/alarm/all");
    // 응답 데이터가 바로 Alarm[] 형태라고 가정
    return res.data;
  } catch (err) {
    console.error("알림 API 호출 중 에러 발생:", err);
    throw err;
  }
}

/**
 * 새로운 알림 개수를 GET 요청으로 받아옵니다.
 * @returns {Promise<number>} 새로운 알림 개수 (예: 읽지 않은 알림 개수)
 */
export async function getAlarmCount(): Promise<number> {
  try {
    const res = await api.get("/api/v1/alarm/count");
    // 응답 데이터가 { count: number } 형태라고 가정합니다.
    return res.data.count;
  } catch (err) {
    console.error("알람 개수 API 호출 중 에러 발생:", err);
    throw err;
  }
}
