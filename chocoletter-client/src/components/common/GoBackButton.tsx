import React from "react";
import go_back_arrow from "../../assets/images/button/go_back_arrow.svg";

type GoBackButtonProps = {
    icon?: React.ReactNode; // 아이콘 컴포넌트 또는 이미지
    altText?: string; // 접근성 텍스트
    className?: string; // 추가 클래스
};

export const GoBackButton = ({
    icon = <img src={go_back_arrow} alt="뒤로가기" className="w-[24px] h-[24px]" />, // 기본값으로 이미지 사용
    altText = "뒤로가기 버튼",
    className = "",
}: GoBackButtonProps) => {
    const baseStyle =
        "absolute flex items-center justify-center";
    
    const handleBackClick = () => {
        window.history.back(); // 브라우저 이전 페이지로 이동
    };

    return (
        <button
            onClick={handleBackClick}
            className={`${baseStyle} ${className}`}
            aria-label={altText}
        >
            {icon}
        </button>
    );
};
