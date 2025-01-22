import React from "react";

type GoBackButtonProps = {
    icon: React.ReactNode; // 아이콘 컴포넌트
    altText?: string; // 접근성 텍스트
    className?: string; // 추가 클래스
};

export const GoBackButton = ({
    icon,
    altText = "뒤로가기 버튼",
    className = "",
}: GoBackButtonProps) => {
    const baseStyle =
        "absolute top-4 left-4 flex items-center justify-center w-12 h-12 bg-white rounded-full shadow hover:bg-gray-200";
    
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
