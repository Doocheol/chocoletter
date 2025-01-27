import { IoShuffle } from "react-icons/io5";
import React from "react";

type ShuffleButtonProps = {
    altText?: string; 
    className?: string; 
    onShuffleClick: () => void; // 부모 컴포넌트로 전달할 이벤트
};

export const ShuffleButton = ({
    altText = "질문 섞기 버튼",
    className = "",
    onShuffleClick,
}: ShuffleButtonProps) => {
    const baseStyle =
        "top-4 left-4 flex items-center justify-center w-[50px] h-[100px] bg-white border-y-4 border-r-4 border-gray-300 outline-none rounded-tr-lg rounded-br-lg shadow hover:bg-gray-100";
    
    return (
        <button
            onClick={onShuffleClick}
            className={`${baseStyle} ${className}`}
            aria-label={altText}
        >
            <IoShuffle size={24} />
        </button>
    );
};
