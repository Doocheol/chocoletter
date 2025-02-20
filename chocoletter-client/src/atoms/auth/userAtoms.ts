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

export const isFirstLoginAtom = atom<boolean>({
  key: "isFirstLogin",
  default: true, // 기본값은 true (최초 로그인 가정)
  effects_UNSTABLE: [persistAtom],
});

export const giftBoxIdAtom = atom<string>({
  key: "giftBoxId",
  default: "",
  effects_UNSTABLE: [persistAtom],
});

export const giftBoxNumAtom = atom<number>({
  key: "giftBoxNum",
  default: 0,
  effects_UNSTABLE: [persistAtom],
});

export const memberIdAtom = atom<string>({
  key: "memberId",
  default: "",
  effects_UNSTABLE: [persistAtom],
});

export const isGiftBoxSelectedAtom = atom<boolean>({
  key: "isGiftBoxSelected",
  default: false,
  effects_UNSTABLE: [persistAtom],
});

export const isWatchNewTutorialAtom = atom<boolean>({
  key: "isWatchNewTutorial",
  default: false,
  effects_UNSTABLE: [persistAtom],
})

export const isFirstLoginEventAtom = atom<boolean>({
  key: "isFirstLoginEvent",
  default: true, // 기본값은 true (최초 로그인 가정)
  effects_UNSTABLE: [persistAtom],
});