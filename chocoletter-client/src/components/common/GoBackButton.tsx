type GoBackButtonProps = {
    strokeColor?: string; // 아이콘의 stroke 색상
    altText?: string; // 접근성 텍스트
    className?: string; // 추가 클래스
};

export const GoBackButton = ({
    strokeColor = "white", // 기본값은 white
    altText = "뒤로가기 버튼",
    className = "",
}: GoBackButtonProps) => {
    const baseStyle = "absolute flex items-center justify-center mt-[17px] ml-4 top-0 left-0";

    const handleBackClick = () => {
        window.history.back(); // 브라우저 이전 페이지로 이동
    };

    return (
        <button
            onClick={handleBackClick}
            className={`${baseStyle} ${className}`}
            aria-label={altText}
        >
            {/* SVG 아이콘 */}
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
            >
                <path
                    d="M18 1L7 12.2683L17.4762 23"
                    stroke={strokeColor} // 동적으로 stroke 설정
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </button>
    );
};
