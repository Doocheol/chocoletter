import React from "react";
import axios from "axios";
import { useState } from "react";

interface LetterInVideoModalProps {
    onPush: () => void;
    sender: string;
    receiver: string;
}

const LetterInVideoModal: React.FC<LetterInVideoModalProps> = ({ onPush, sender, receiver }) => {
  // 편지 담을 state
  const [letter, setLetter] = useState("Sweet Valentine Letter");

  // api 호출 (작성된 편지)
//   const openRTCLetter = async () => {
//     const response = await axios.get("");
//   }

  return (
    <>
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="absolute inset-0 bg-black opacity-50" onClick={onPush}></div>
            <div className="bg-white rounded-lg p-8 z-10" onClick={(e) => e.stopPropagation()}>
                <button onClick={onPush}>❌</button>
                <p>To. {receiver}</p>
                <p>{letter}</p>
                <p>From. {sender}</p>
            </div>
        </div>
    </>
  );
};

export default LetterInVideoModal;