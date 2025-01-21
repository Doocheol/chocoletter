import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';

const { persistAtom } = recoilPersist();

export const sessionAtom = atom<string>({
    key: 'sessionAtom',
    default: '',
    effects_UNSTABLE: [persistAtom],
});

export const tokenAtom = atom<string>({
    key: 'tokenAtom',
    default: '',
    effects_UNSTABLE: [persistAtom],
});