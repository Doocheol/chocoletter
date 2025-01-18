import { atom } from "recoil";

// 사용자 이름 상태
export const userNameAtom = atom<string>({
  key: "userNameAtom",
  default: "",
});

// 사용자 프로필 URL 상태
export const userProfileUrlAtom = atom<string>({
  key: "userProfileUrlAtom",
  default: "",
});
