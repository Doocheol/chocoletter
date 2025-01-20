import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';

const { persistAtom } = recoilPersist();

export const isLoginAtom = atom<boolean>({
  key: 'isLogin',
  default: false,
  effects_UNSTABLE: [persistAtom],
});

export const userNameAtom = atom<string>({
  key: 'userName',
  default: '',
  effects_UNSTABLE: [persistAtom],
});

export const userProfileUrlAtom = atom<string>({
  key: 'userProfileUrl',
  default: '',
  effects_UNSTABLE: [persistAtom],
});