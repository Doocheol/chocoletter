import api from "./api";
// 위에서 import한 `api` 인스턴스는
// interceptors.request에서 자동으로 토큰을 붙여 주고,
// interceptors.response에서 401 처리, 재발급 등을 담당합니다.

/**
 * 선물 프리뷰 코인(개봉 가능 횟수 등) 사용 API
 */
export async function disPreviewCoin() {
  try {
    // api.patch 호출: /api/v1/gift-box/preview
    const res = await api.patch(`/api/v1/gift-box/preview`, {});
    const data = res.data;
    console.log("카운트 사용 성공!", data);
    return data;
  } catch (err) {
    console.error("disPreviewCoin API 호출 중 에러 발생:", err);
    throw err;
  }
}

/**
 * 내 선물(기프트박스) 개수 조회 API
 */
export async function countMyGiftBox() {
  try {
    // api.get 호출: /api/v1/gift-box/count
    const res = await api.get(`/api/v1/gift-box/count`);

    // key: giftCount, canOpenGiftCount
    const data = res.data;
    console.log("개수 조회 성공 :", data);
    return data;
  } catch (err) {
    console.error("countMyGiftBox API 호출 중 에러 발생:", err);
    return err;
  }
}

/**
 * 상대방 선물상자 정보 조회 API
 * giftBoxId를 이용하여 선물상자 정보를 받아오고,
 * 응답 데이터에서 name만 추출하여 반환합니다.
 */
export async function getGiftBoxName(giftBoxId: string) {
    try {
        const res = await api.get(`/api/v1/gift-box/${giftBoxId}`);
        // 응답 데이터에서 name 프로퍼티만 추출 (응답 형식에 따라 수정 가능)
        const { name } = res.data;
        console.log("선물상자 이름 조회 성공:", name);
        return name;
    } catch (err) {
        console.error("getGiftBoxName API 호출 중 에러 발생:", err);
        return null;
    }
}
