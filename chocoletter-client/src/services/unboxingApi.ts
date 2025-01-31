import api from "./api";

// 언박싱 전체 일정 조회(giftBoxId의 언박싱 전체 스케줄)
// export async function getUnboxingSchedule(giftBoxId: number) {
//   try {
//     const res = await api.get(`/api/v1/gift-box/${giftBoxId}/unboxing/schedule`);
//     return res.data;
//   } catch (err) {
//     console.error("getUnboxingSchedule API 호출 중 에러 발생:", err);
//     return null;
//   }
// }

const accessToken = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxOCIsImlhdCI6MTczODI3OTk3MSwiZXhwIjoxNzM4ODg0NzcxfQ.i7E3fDn9tkwcJBQQCIy0y8Ev6dyfCICx79QBxJol4I0'
export async function getUnboxingSchedule(giftBoxId: number) {
  try {
    const res = await api.get(`/api/v1/gift-box/${giftBoxId}/unboxing/schedule`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            }
        })
    return res.data;
  } catch (err) {
    console.error("getUnboxingSchedule API 호출 중 에러 발생:", err);
    return null;
  }
}

// 언박싱 초대 시간 조회(giftId의 언박싱 시간간)
export async function getNotFixedUnboxingTime(giftId: number) {
  try {
    const res = await api.get(`/api/v1/gift/${giftId}/unboxing/invitation`);
    return res.data;
  } catch (err) {
    console.error("getNotFixedUnboxingTime API 호출 중 에러 발생:", err);
    return null;
  }
}

// 언박싱 일정 수락
export async function patchUnboxingAccept(giftId: number) {
  try {
    const res = await api.patch(`/api/v1/gift/${giftId}/unboxing/invitation/accept`);
    return res.data;
  } catch (err) {
    console.error("patchUnboxingAccept API 호출 중 에러 발생:", err);
    return null;
  }
}

// 언박싱 일정 거절
export async function patchUnboxingReject(giftId: number) {
  try {
    const res = await api.patch(`/api/v1/gift/${giftId}/unboxing/invitation/reject`);
    return res.data;
  } catch (err) {
    console.error("patchUnboxingReject API 호출 중 에러 발생:", err);
    return null;
  }
}

// 언박싱 일정 요청청
export async function sendUnboxingTime(giftId: number) {
  try {
    const res = await api.patch(`/api/v1/gift/${giftId}/unboxing/invitation/reject`);
    return res.data;
  } catch (err) {
    console.error("patchUnboxingReject API 호출 중 에러 발생:", err);
    return null;
  }
}