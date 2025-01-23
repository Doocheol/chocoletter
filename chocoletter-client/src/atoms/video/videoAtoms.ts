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

// 로컬 테스트용입니다. 오로지
export const memberCntAtom = atom<number>({
    key: 'memberCntAtom',
    default: 2,
    effects_UNSTABLE: [persistAtom],
})