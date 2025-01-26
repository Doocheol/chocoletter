import React from "react";
import { Button } from "../../../components/common/Button";

interface AmPmButtonProps {
  selected: "AM" | "PM"; // 현재 선택된 값
  onSelect: (value: "AM" | "PM") => void; // 선택 변경 이벤트
}

const AmPmButton: React.FC<AmPmButtonProps> = ({ selected, onSelect }) => {
  return (
    <div className="flex flex-col my-24 ml-4">
      {/* AM 버튼 */}
      <Button
        onClick={() => onSelect("AM")} // 선택 변경 이벤트
        className={`m-4 w-[50px] h-[50px] flex items-center justify-center text-center ${selected === "AM" ? "bg-[#fcb7b8] text-white" : ""}`}
      >
        <h1>AM</h1>
      </Button>

      {/* PM 버튼 */}
      <Button
        onClick={() => onSelect("PM")} // 선택 변경 이벤트
        className={`m-4 w-[50px] h-[50px] flex items-center justify-center text-center ${selected === "PM" ? "bg-[#fcb7b8] text-white" : ""}`}
      >
        <h1>PM</h1>
      </Button>
    </div>
  );
};

export default AmPmButton;
