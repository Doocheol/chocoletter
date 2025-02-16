type GoBackButtonProps = {
    strokeColor?: string; 
    altText?: string; 
    className?: string; 
    onClick?: () => void; 
};

export const GoBackButton = ({
    strokeColor = "white", 
    altText = "뒤로가기 버튼",
    className = "",
    onClick,    
}: GoBackButtonProps) => {
    const baseStyle = "absolute flex items-center justify-center mt-[17px] ml-4 top-0 left-0";

    const handleBackClick = () => {
        if (onClick) {
            onClick(); 
        }
        window.history.back();
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
                    stroke={strokeColor}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </button>
    );
};
