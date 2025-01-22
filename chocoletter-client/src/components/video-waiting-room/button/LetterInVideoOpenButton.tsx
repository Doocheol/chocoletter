import React from "react";

interface LetterInVideoOpenButtonProps {
    onPush: () => void;
}

const LetterInVideoOpenButton: React.FC<LetterInVideoOpenButtonProps> = ({ onPush }) => {
  return (
    <div>
      <button onClick={onPush}>편지 열기</button>
    </div>
  );
};

export default LetterInVideoOpenButton;