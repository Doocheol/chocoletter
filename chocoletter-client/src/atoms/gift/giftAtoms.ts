import { atom } from 'recoil';

export const availableGiftsAtom = atom<number>({
    key: 'availableGifts',
    default: 0,
    });

export const receivedGiftsAtom = atom<number>({
    key: 'receivedGifts',
    default: 0,
});

export const selectedGiftIdAtom = atom<number>({
    key: 'selectedGiftId', 
    default: -1,   
  });