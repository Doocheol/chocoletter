import { useState, useEffect } from 'react';
import checkPurple from "../../assets/images/chocolate/check_purple.svg";

interface UnboxingTimeStickerProps {
    unboxingTime: string | null;
    giftType: string;
    isOpened: boolean;
    isAccepted?: boolean;
}

const formatTimeKST = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
        timeZone: 'Asia/Seoul'
    }).format(date)
};

export const UnboxingTimeSticker = ({unboxingTime, giftType, isOpened, isAccepted}: UnboxingTimeStickerProps) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    // 1분마다 현재 시간 갱신
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentDate(new Date());
        }, 60000);
        return () => clearInterval(interval);
    }, [])

    let content = null;

    // 일반 초콜릿은 당일 체크표시 유무만 표시 
    // 특별 초콜릿은 unboxingTime 5분 전까지는 시간수락 대기, 이후에는 연결 가능
    if (giftType === "GENERAL") {
        if (isOpened) {
            content = (
                <div className="absolute top-0 left-0 m-2">
                    <img src={checkPurple} alt="체크 아이콘" />
                </div>
            )
        }

    } else {
        if (unboxingTime === null) return null;

        const unboxingTimeKST = unboxingTime.replace("Z", "+09:00");
        const unboxingDate = new Date(unboxingTimeKST);

        if (isAccepted) {
            const formattedTime = formatTimeKST(unboxingDate);
            content = (
                <div className="absolute inset-0 flex flex-col justify-center items-center bg-gray-500 bg-opacity-50 rounded-lg pointer-events-none">
                    <svg width="24" height="24" fill="currentColor" className="text-white">
                        <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" fill="none" />
                        <path d="M12 6v6l4 2" stroke="white" strokeWidth="2" fill="none" />
                    </svg>
                    <p className="font-sans text-white text-sm text-center mt-2">{formattedTime}</p>
                </div>
            )
        } else {
            content = (
                <div className="absolute inset-0 flex justify-center items-center bg-chocoletterRed/30 bg-opacity-50 rounded-lg pointer-events-none">
                    <p className="font-sans text-white text-sm text-center font-bold">시간수락<br/>기다리는 중...</p>
                </div>
            )
        }
    }

    return (
        <div className="absolute inset-0 flex justify-center items-center top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] rounded-lg pointer-events-none z-20">
            {content}
        </div>
    )
};