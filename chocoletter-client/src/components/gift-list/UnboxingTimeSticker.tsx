import { useState } from 'react';

interface UnboxingTimeStickerProps {
    unboxingTime: string | null;
}

export const UnboxingTimeSticker = ({unboxingTime}: UnboxingTimeStickerProps) => {
    const message = unboxingTime === null
        ? "열어주길\n기다리는 중..."
        : "약속시간\n정하는 중...";

    return (
        <div className="absolute inset-0 flex justify-center items-center top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] rounded-lg pointer-events-none bg-black/40 z-20">
            <p className="font-sans text-white text-sm text-center whitespace-pre-line">{message}</p>
        </div>
    )
};