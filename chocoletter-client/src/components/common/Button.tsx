import React from "react";

type ButtonProps = {
    type?: "button" | "submit" | "reset";
    onClick?: () => void;
    children?: React.ReactNode;
    className?: string;
};

const Button = ({
    type = "button",
    onClick,
    children,
    className = "",
}: ButtonProps) => {
    const baseStyle =
        "px-8 py-3 bg-white text-black rounded-lg shadow-md hover:bg-[#fcb7b7]";

    return (
        <button
            type={type}
            onClick={onClick}
            className={`${baseStyle} ${className}`}
        >
            {children}
        </button>
    );
};

export { Button };