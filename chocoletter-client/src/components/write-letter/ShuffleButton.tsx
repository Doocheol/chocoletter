import { IoShuffle } from "react-icons/io5";

import React from "react";

type ShuffleButtonProps = {
    altText?: string; 
    className?: string; 
};

export const ShuffleButton = ({
    altText = "질문 섞기 버튼",
    className = "",
}: ShuffleButtonProps) => {
    const baseStyle =
        "top-4 left-4 flex items-center justify-center w-[50px] h-[70px] bg-white outline-none rounded-lg shadow hover:bg-gray-200";
    
    const handleBackClick = () => {
        window.history.back(); // 질문 섞는 역할 해야함. get 함수
    };

    return (
        <button
            onClick={handleBackClick}
            className={`${baseStyle} ${className}`}
            aria-label={altText}
        >
            <IoShuffle size={24} />
        </button>
    );
};
