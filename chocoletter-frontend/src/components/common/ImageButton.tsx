import React from "react";

type ImageButtonProps = {
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  children?: React.ReactNode;
  className?: string;
  backgroundImage?: string; // 배경 이미지
};

const ImageButton = ({
  type = "button",
  onClick,
  children,
  className = "",
  backgroundImage = "",
}: ImageButtonProps) => {
  const baseStyle = "px-4 py-2 relative overflow-hidden";

  const backgroundStyle = backgroundImage
    ? {
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "contain", // 이미지 비율 유지 축소/확대
        backgroundPosition: "center", // 중앙 정렬
      }
    : {};

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyle} ${className}`}
      style={backgroundStyle}
    >
      {children}
    </button>
  );
};

export { ImageButton };
