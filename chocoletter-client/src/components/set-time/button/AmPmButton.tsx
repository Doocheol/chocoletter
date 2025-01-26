import React from "react";
import { Button } from "../../../components/common/Button";

interface AmPmButtonProps {
  selected: "AM" | "PM"; 
  onSelect: (value: "AM" | "PM") => void;
}

const AmPmButton: React.FC<AmPmButtonProps> = ({ selected, onSelect }) => {
  return (
    <div className="w-[100px] flex flex-col mx-4">
      {/* AM 버튼 */}
      <Button
        onClick={() => onSelect("AM")} 
        className={`bg-transparent shadow-none m-4 w-[50px] h-[50px] flex items-center justify-center text-center hover:bg-blue-300 
          ${
            selected === "AM" ? "text-blue-500 text-2xl" : "text-gray-400"
          }`}
        // className={`m-4 w-[50px] h-[50px] flex items-center justify-center text-center ${selected === "AM" ? "bg-[#fcb7b7] text-white" : ""}`}
      >
        <h1>AM</h1>
      </Button>

      {/* PM 버튼 */}
      <Button
        onClick={() => onSelect("PM")}
        className={`bg-transparent shadow-none m-4 w-[50px] h-[50px] flex items-center justify-center text-center hover:bg-blue-300 
          ${
            selected === "PM" ? "text-blue-500 text-2xl" : "text-gray-400"
          }`}
      >
        <h1>PM</h1>
      </Button>
    </div>
  );
};

export default AmPmButton;
