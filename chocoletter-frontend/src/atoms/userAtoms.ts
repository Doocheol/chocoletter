import { atom } from "recoil";

export const userNameAtom = atom<string | null>({
  key: "userName",
  default: null,
});

export const userProfileUrlAtom = atom<string | null>({
  key: "userProfileUrl",
  default: null,
});
