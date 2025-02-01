import React from "react";
// import axios from "axios";
import { useState } from "react";
import GeneralLetterModal from "../../common/GeneralLetterModal"

interface LetterInVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  sender: string;
  receiver: string;
}

const LetterInVideoModal: React.FC<LetterInVideoModalProps> = ({ isOpen, onClose, sender, receiver }) => {
  return (
    <>
      <GeneralLetterModal isOpen={isOpen} onClose={onClose} sender={sender} receiver={receiver} />
    </>
  );
};

export default LetterInVideoModal;