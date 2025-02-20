import { atom } from "recoil";

export const freeLetterState = atom({
  key: "freeLetterState",
  default: {
    nickname: "",
    content: "",
    contentLength: 0,
  },
});

export const questionLetterState = atom({
  key: "questionLetterState",
  default: {
    nickname: "",
    question: "",
    answer: "",
    answerLength: 0,
  },
});