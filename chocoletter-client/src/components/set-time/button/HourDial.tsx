import React, { useState, useRef } from "react";

type HourDialProps = {
  onHourChange: (hour: string) => void;
};

const HourDial: React.FC<HourDialProps> = ({ onHourChange }) => {
    const [hour, setHour] = useState("1");

    // 시간 배열 ("01" ~ "12")
    const hours = Array.from({ length: 12 }, (_, i) =>
        (i + 1).toString()
    );

    // 스크롤 변경 처리
    const scrollTimeout = useRef<NodeJS.Timeout | null>(null);
    const handleScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
        const element = e.currentTarget;
        const index = Math.round(e.currentTarget.scrollTop / 40);
        const newHour = hours[index % 12]; 

        if (scrollTimeout.current) {
            clearTimeout(scrollTimeout.current);
        }

    scrollTimeout.current = setTimeout(() => {
        element.scrollTo({
          top: 40 * index,
          behavior: "smooth",
        });
    }, 150);
    
    setHour(newHour);
    onHourChange(newHour);
  };

  return (      
    <div className="flex items-center justify-center">
        <div
          className="h-[250px] overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
          onScroll={handleScroll}
        >
                <div className="h-[85px]"></div>
                {hours.map((h, index) => (
                    <div
                    key={index}
                    className={`w-[69px] h-[22px] flex items-center justify-center snap-center mb-[18px] ${
                        hour === h
                        ? "text-black text-bold text-[40px] h-[80px] px-[15px] py-[20px]" // 선택된 시간
                        : "text-[#595B66] text-[34px]" // 선택되지 않은 시간
                    }`}
                    >
                    {h}
                    </div>
                ))}
                <div className="h-[85px]"></div>
            </div>
      </div>
  );
};

export default HourDial;
