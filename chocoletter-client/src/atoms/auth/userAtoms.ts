import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

export const isLoginAtom = atom<boolean>({
  key: "isLogin",
  default: false,
  effects_UNSTABLE: [persistAtom],
});

export const userNameAtom = atom<string>({
  key: "userName",
  default: "",
  effects_UNSTABLE: [persistAtom],
});

export const userProfileUrlAtom = atom<string>({
  key: "userProfileUrl",
  default: "",
  effects_UNSTABLE: [persistAtom],
});

/**
 * 첫 로그인 여부를 관리하는 Atom
 * - true일 경우 튜토리얼 오버레이 등을 보여줄 수 있음
 * - 튜토리얼 완료 후 false로 변경하거나,
 *   서버/로컬 스토리지 값을 보고 업데이트할 수 있음
 */
export const isFirstLoginAtom = atom<boolean>({
  key: "isFirstLogin",
  default: true, // 기본값은 true (최초 로그인 가정)
  effects_UNSTABLE: [persistAtom],
});

export const userGiftboxAtom = atom<number>({
  key: "userGiftbox",
  default: 1, // 초기값 (1-5)
  effects_UNSTABLE: [persistAtom],
});
