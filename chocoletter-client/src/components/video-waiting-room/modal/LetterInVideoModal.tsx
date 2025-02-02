import React from "react";
// import axios from "axios";
import { useState } from "react";
import GeneralLetterModal from "../../common/GeneralLetterModal"

interface LetterInVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  nickName?: string;
  content?: string;
  question?: string;
  answer?: string;
}

const LetterInVideoModal: React.FC<LetterInVideoModalProps> = ({ isOpen, onClose, nickName, content, question, answer }) => {
  return (
    <>
      <GeneralLetterModal isOpen={isOpen} onClose={onClose} nickName={nickName} content={content} question={question} answer={answer} />
    </>
  );
};

export default LetterInVideoModal;