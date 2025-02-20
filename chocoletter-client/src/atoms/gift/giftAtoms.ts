import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

export const availableGiftsAtom = atom<number>({
  key: "availableGifts",
  default: 0,
});

export const receivedGiftsAtom = atom<number>({
  key: "receivedGifts",
  default: 0,
});

export const sentGiftsAtom = atom<number>({
  key: "sentGifts",
  default: 0,
});

export const selectedGiftIdAtom = atom<string | null>({
  key: "selectedGiftId",
  default: null,
  effects_UNSTABLE: [persistAtom],
});

export const selectedGiftTypeAtom = atom<"all" | "general" | "special">({
  key: "selectedGiftType",
  default: "all",
});

export const giftListRefreshAtom = atom<boolean>({
  key: 'giftListRefreshAtom',
  default: false,
  effects_UNSTABLE: [persistAtom],
});