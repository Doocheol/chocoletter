import React from "react";

type ImageButtonProps = {
  ref?: React.Ref<HTMLButtonElement>;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  children?: React.ReactNode;
  className?: string;
  src?: string; // 이미지 소스
  alt?: string; // 이미지 대체 텍스트
};

const ImageButton = ({
  ref,
  type = "button",
  onClick,
  children,
  className = "",
  src = "",
  alt = "button image",
}: ImageButtonProps) => {
  return (
    <button
      ref={ref}
      type={type}
      onClick={onClick}
      className={`${className} p-0 border-0`} // 패딩과 테두리 제거
    >
      <img src={src} alt={alt} className="display-block" />
      {children}
    </button>
  );
};

export { ImageButton };
