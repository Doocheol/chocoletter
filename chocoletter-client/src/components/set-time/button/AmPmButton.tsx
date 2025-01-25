import React from "react";
import { Button } from "../../common/Button";

interface AmPmButtonProps {
  selected: "AM" | "PM"; // 현재 선택된 값
  onSelect: (value: "AM" | "PM") => void; 
}

const AmPmButton: React.FC<AmPmButtonProps> = ({ selected, onSelect }) => {
  console.log("Selected value:", selected);
  const baseClass = "w-[50px] h-[50px] my-12 flex items-center justify-center rounded-lg"; // 공통 클래스
  const selectedClass = "bg-[#ffc0cb] text-white"; // 선택된 상태 클래스
  const unselectedClass = "bg-white text-black"; // 선택되지 않은 상태 클래스
  return (
    <div className="flex flex-col mb-24">
      <Button
        onClick={() => onSelect("AM")}
        className={`${baseClass} ${selected === "AM" ? selectedClass : unselectedClass}`}
      >
        AM
      </Button>

      <Button
        onClick={() => onSelect("PM")} 
        className={`${baseClass} ${selected === "PM" ? selectedClass : unselectedClass}`}
        >
        PM
      </Button>
    </div>
  );
};

export default AmPmButton;
