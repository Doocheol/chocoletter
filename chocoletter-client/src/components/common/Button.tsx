import React from "react";

type ButtonProps = {
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  children?: React.ReactNode;
  className?: string;
};

const Button = ({ type = "button", onClick, children, className = "" }: ButtonProps) => {
  const baseStyle =
    "px-4 py-3 bg-white text-black rounded-lg shadow-md hover:bg-chocoletterPurple hover:text-white focus:outline-none focus:ring-2 focus:ring-chocoletterPurple focus:ring-opacity-50";

  return (
    <button type={type} onClick={onClick} className={`${baseStyle} ${className}`}>
      {children}
    </button>
  );
};

export { Button };
