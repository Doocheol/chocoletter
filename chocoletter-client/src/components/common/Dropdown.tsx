import React, { useEffect, useRef } from "react";

interface DropdownProps {
	isOpen: boolean;
	onClose: () => void;
	children?: React.ReactNode;
	className?: string;
}

const Dropdown: React.FC<DropdownProps> = ({
	isOpen,
	onClose,
	children,
	className,
}) => {
	const dropdownRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		function handleClickOutside(e: MouseEvent) {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(e.target as Node)
			) {
				onClose();
			}
		}

		if (isOpen) {
			document.addEventListener("mousedown", handleClickOutside);
		} else {
			document.removeEventListener("mousedown", handleClickOutside);
		}
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isOpen, onClose]);

	if (!isOpen) return null;

	return (
		<div
			ref={dropdownRef}
			className={`
        absolute z-50
        bg-white shadow-md rounded-md
        wave-down
        ${className || ""}
      `}
		>
			{children}
		</div>
	);
};

export default Dropdown;
