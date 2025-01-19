import React, { PropsWithChildren } from "react";

type LayoutProps = {
  className?: string; // 추가 스타일을 위한 선택적 클래스
};

const Layout: React.FC<PropsWithChildren<LayoutProps>> = ({ children, className = "" }) => {
  return (
    <div
      className={`text-center flex flex-col items-center justify-center min-h-[calc(var(--vh)_*_100)] bg-pink-100 text-gray-800 ${className}`}
    >
      {children}
    </div>
  );
};

export default React.memo(Layout);
