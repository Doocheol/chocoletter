import React from "react";

type GoBackButtonProps = {
    imageUrl?: string; // 버튼 이미지 경로 (선택적)
    altText?: string;  // 이미지 대체 텍스트
    className?: string; // 추가 클래스
};

const GoBackButton = ({
    imageUrl = "", // 기본값 빈 문자열
    altText = "뒤로가기",
    className = "",
}: GoBackButtonProps) => {
    const baseStyle =
        "absolute left-0 w-[50px] h-[50px] bg-cover z-10";

    const handleBackClick = () => {
        window.history.back(); // 브라우저 이전 페이지로 이동
    };

    return (
        <button
            onClick={handleBackClick}
            className={`${baseStyle} ${className}`}
            style={{
                backgroundImage: `url(${imageUrl})`, 
            }}
            aria-label={altText} 
        />
    );
};

export { GoBackButton };
