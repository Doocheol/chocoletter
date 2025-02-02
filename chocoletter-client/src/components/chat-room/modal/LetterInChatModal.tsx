import React from "react";
// import axios from "axios";
import { useState } from "react";
import GeneralLetterModal from "../../common/GeneralLetterModal"

interface LetterInChatModalProps {
    isOpen: boolean;
    onClose: () => void;
    sender?: string; // 삭제 고려
    receiver?: string; // 삭제 고려
    nickName?: string
    content?: string;
    question?: string;
    answer?: string;
    children?: React.ReactNode;
    className?: string;
}
    

const LetterInChatModal: React.FC<LetterInChatModalProps> = (props) => {
  return (
    <>
      <GeneralLetterModal {...props} />
    </>
  );
};

export default LetterInChatModal;