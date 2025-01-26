import React, { useState } from "react";

type HourDialButtonProps = {
  onHourChange: (hour: string) => void; 
};


const HourDialButton: React.FC<HourDialButtonProps> = ({ onHourChange }) => {
    const [hour, setHour] = useState("01"); // 초기 시간 값 ("01" ~ "12")

    // 시간 배열 ("01" ~ "12")
    const hours = Array.from({ length: 12 }, (_, i) =>
        (i + 1).toString().padStart(2, "0")
    );

    // 스크롤 변경 처리
    const handleScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
        const index = Math.round(e.currentTarget.scrollTop / 40); // 40px 단위로 스크롤 계산
        const newHour = hours[index % 12]; // "01" ~ "12" 순환
        setHour(newHour);
        onHourChange(newHour); // 부모 컴포넌트에 새로운 시간 전달
    };

    return (
        <div className="flex flex-col items-center justify-center h-full">
        {/* 시간 선택 다이얼 */}
            <div className="h-[50px] text-gray-700 font-bold text-lg pr-8">시</div>
            <div
                className="h-40 w-20 overflow-y-scroll snap-y snap-mandatory"
                    onScroll={handleScroll}
                    style={{
                        scrollbarWidth: "none", 
                        msOverflowStyle: "none", 
                    }}
                    >
                            
                {hours.map((h, index) => (
                    <div
                        key={index}
                        className={`w-[50px] h-[50px] flex items-center justify-center snap-center ${
                        hour === h
                            ? "text-blue-500 font-bold text-3xl rounded-lg bg-white " // 선택된 시간
                            : "text-gray-400 text-xl" // 선택되지 않은 시간
                        }`}
                    >
                        {h}
                    </div>
                    ))}
            </div>
        </div>
    );
};

export default HourDialButton;
