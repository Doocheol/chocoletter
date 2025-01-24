import { atom } from "recoil";

/**
 * 개봉 가능한(열 수 있는) 초콜릿 수
 */
export const availableGiftsAtom = atom<number>({
  key: "availableGifts",
  default: 0,
});

/**
 * 받은(전체) 초콜릿 수
 */
export const receivedGiftsAtom = atom<number>({
  key: "receivedGifts",
  default: 0,
});

/**
 * 보낸(전체) 초콜릿 수
 * - 새로 추가
 */
export const sentGiftsAtom = atom<number>({
  key: "sentGifts",
  default: 0,
});

/**
 * 선택된 특정 초콜릿 ID
 */
export const selectedGiftIdAtom = atom<number>({
  key: "selectedGiftId",
  default: -1,
});