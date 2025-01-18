import React from "react";

type ImageButtonProps = {
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  children?: React.ReactNode;
  className?: string;
  /** 배경에 사용할 이미지 URL */
  backgroundImage?: string;
};

export const ImageButton = ({
  type = "button",
  onClick,
  children,
  className = "",
  backgroundImage = "",
}: ImageButtonProps) => {
  // 기본 Tailwind 스타일 (반응형 높이)
  const baseStyle = `
    relative
    w-full
    h-32
    bg-no-repeat
    bg-center
    bg-cover
    overflow-hidden

    sm:h-40
    md:h-48
    lg:h-56
  `;

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyle} ${className}`}
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
      }}
    >
      {children}
    </button>
  );
};
