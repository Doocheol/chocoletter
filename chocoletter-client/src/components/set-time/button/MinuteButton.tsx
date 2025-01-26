import React from "react";
import { Button } from "../../../components/common/Button";

interface MinuteButtonProps {
  selected: string;
  onSelect: (value: string) => void;
}

const MinuteButton: React.FC<MinuteButtonProps> = ({ selected, onSelect }) => {
  // 분 옵션 배열
  const minutes = ["00", "10", "20", "30", "40", "50"];

  return (
    <div className="h-full flex flex-col mx-2">
      {/* "분" 텍스트 */}
      <div className="text-gray-700 font-bold text-lg mb-2">분</div>

      {/* 버튼 컨테이너 */}
      <div className="flex flex-grow items-center justify-center">
        <div className="grid grid-cols-2 gap-4">
          {minutes.map((minute) => (
            <Button
              key={minute}
              onClick={() => onSelect(minute)}
              className={`shadow-none w-[50px] h-[50px] flex items-center justify-center text-center hover:bg-blue-300 ${
                selected === minute
                  ? "text-blue-500 text-2xl bg-white font-bold"
                  : "text-gray-400 bg-gray-100"
              }`}
            >
              <h1>{minute}</h1>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MinuteButton;
