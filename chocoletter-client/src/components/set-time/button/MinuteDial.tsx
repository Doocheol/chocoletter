import React, { useState, useRef } from "react";

type MinuteDialProps = {
  onHourChange: (hour: string) => void;
};

const MinuteDial: React.FC<MinuteDialProps> = ({ onHourChange }) => {
    const [minute, setMinute] = useState("00");
    const minutes = Array.from({ length: 6 }, (_, i) => (i * 10).toString().padStart(2, "0"));

    // 스크롤 변경 처리
    const scrollTimeout = useRef<NodeJS.Timeout | null>(null);
    const handleScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
        const element = e.currentTarget;
        const index = Math.round(e.currentTarget.scrollTop / 40);
        const newMinute = minutes[index % 6]; 

        if (scrollTimeout.current) {
            clearTimeout(scrollTimeout.current);
        }

        scrollTimeout.current = setTimeout(() => {
            element.scrollTo({
            top: 40 * index,
            behavior: "smooth",
            });
        }, 150); 

        setMinute(newMinute);
        onHourChange(newMinute); 
    };
  
  return (
    <div className="flex items-center justify-center">
        <div
          className="h-[250px] overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
          onScroll={handleScroll}
        >
          <div className="h-[85px]"></div>
            {minutes.map((m, index) => (
                <div
                key={index}
                className={`w-[69px] h-[22px] flex items-center justify-center snap-center mb-[18px] ${
                    minute === m
                    ? "text-black text-bold text-[40px] h-[80px] px-[15px] py-[20px]" // 선택된 시간
                    : "text-[#595B66] text-[34px]" // 선택되지 않은 시간
                }`}
                >
                {m}
                </div>
            ))}
            <div className="h-[85px]"></div>
        </div>
    </div>
  );
};

export default MinuteDial;
