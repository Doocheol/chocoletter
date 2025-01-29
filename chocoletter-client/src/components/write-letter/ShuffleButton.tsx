import React from "react";
import shuffle_icon from "../../assets/images/letter/shuffle_icon.svg";

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
        "flex w-[60px] h-[45px] justify-center items-center gap-2 rounded-[15px] border border-black bg-[#9E4AFF]";
    
    return (
        <button
            onClick={onShuffleClick}
            className={`${baseStyle} ${className}`}
            aria-label={altText}
        >
            <img src={shuffle_icon} alt="랜덤 질문 섞기" />
        </button>
    );
};
