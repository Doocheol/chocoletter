import React from "react";
import { Button } from "../../common/Button";

interface AmPmSelectorProps {
  selected: "AM" | "PM"; // 현재 선택된 값
  onSelect: (value: "AM" | "PM") => void; // 선택 변경 이벤트
}

const AmPmSelector: React.FC<AmPmSelectorProps> = ({ selected, onSelect }) => {
  return (
    <div className="flex space-x-4">
      <Button
        onClick={() => onSelect("AM")} // 선택 변경 이벤트
        className={selected === "AM" ? "bg-[#fcb7b7] text-white" : ""}
      >
        AM
      </Button>

      <Button
        onClick={() => onSelect("PM")} // 선택 변경 이벤트
        className={selected === "PM" ? "bg-[#fcb7b7] text-white" : ""}
      >
        PM
      </Button>
    </div>
  );
};

export default AmPmSelector;
