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
    const res = await api.patch(`/api/v1/gift-box/preview`);
    const data = res.data;
    console.log("카운트 사용 성공!", data);
    return data;
  } catch (err) {
    console.error("disPreviewCoin API 호출 중 에러 발생:", err);
    return err;
  }
}

/**
 * 내 선물(기프트박스) 개수 조회 API
 */
export async function countMyGiftBox() {
  try {
    // api.get 호출: /api/v1/gift-box/count
    const res = await api.get(`/api/v1/gift-box/count`);
    const data = res.data;
    console.log("개수 조회 성공 :", data);
    return data;
  } catch (err) {
    console.error("countMyGiftBox API 호출 중 에러 발생:", err);
    return err;
  }
}
