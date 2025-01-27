import React from "react";
import { Button } from "../../../components/common/Button";

interface MinuteButtonProps {
  selected: string;
  onSelect: (value: string) => void;
  disabledMinutes?: string[]; // 비활성화할 분 배열
}

const MinuteButton: React.FC<MinuteButtonProps> = ({ selected, onSelect, disabledMinutes = [] }) => {
  // 분 옵션 배열
  const minutes = ["00", "10", "20", "30", "40", "50"];

  return (
    <div className="h-full flex flex-col mx-2">
      {/* "분" 텍스트 */}
      <div className="text-gray-700 font-bold text-lg mb-2">분</div>

      {/* 버튼 컨테이너 */}
      <div className="flex flex-grow items-center justify-center">
        <div className="grid grid-cols-2 gap-4">
          {minutes.map((minute) => {
            const isDisabled = disabledMinutes.includes(minute); // 비활성화 여부 확인
            return (
              <Button
                key={minute}
                onClick={() => !isDisabled && onSelect(minute)} // 비활성화된 버튼 클릭 방지
                className={`shadow-none w-[50px] h-[50px] flex items-center justify-center text-center rounded-md ${
                  isDisabled
                    ? "pointer-events-none bg-gray-300 text-gray-400"
                    : selected === minute
                    ? "text-blue-500 text-2xl bg-white font-bold hover:bg-blue-300"
                    : "text-gray-400 bg-gray-100 hover:bg-blue-300"
                }`}
              >
                <h1>{minute}</h1>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
};


export default MinuteButton;
