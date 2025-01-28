import React from "react";
// import axios from "axios";
import { useState } from "react";
import GeneralLetterModal from "../../common/GeneralLetterModal"

interface LetterInVideoModalProps {
  isOpen: boolean;
  onPush: () => void;
  sender: string;
  receiver: string;
}

const LetterInVideoModal: React.FC<LetterInVideoModalProps> = ({ isOpen, onPush, sender, receiver }) => {
  return (
    <>
      <GeneralLetterModal isOpen={isOpen} onClose={onPush} sender={sender} receiver={receiver} />
    </>
  );
};

export default LetterInVideoModal;