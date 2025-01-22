import React, { useState, useEffect } from "react";
// import { FaArrowUp } from "react-icons/fa"; // 아이콘 라이브러리 사용 (react-icons)
// import { MdArrowUpward } from "react-icons/md";

import classNames from "classnames"; // 조건부 클래스 적용을 위한 라이브러리

type GoToTopButtonProps = {
	className?: string; // 추가적인 Tailwind CSS 클래스
	scrollThreshold?: number; // 버튼이 나타날 스크롤 임계값 (픽셀 단위)
};

const GoToTopButton: React.FC<GoToTopButtonProps> = ({
	className = "",
	scrollThreshold = 600, // 기본 스크롤 임계값 설정
}) => {
	const [isVisible, setIsVisible] = useState(false);

	// 스크롤 이벤트 핸들러
	const toggleVisibility = () => {
		if (window.pageYOffset > scrollThreshold) {
			setIsVisible(true);
		} else {
			setIsVisible(false);
		}
	};

	// 스크롤 이벤트 리스너 등록
	useEffect(() => {
		window.addEventListener("scroll", toggleVisibility);
		return () => {
			window.removeEventListener("scroll", toggleVisibility);
		};
	}, [scrollThreshold]);

	// 스크롤 최상단으로 부드럽게 이동
	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: "smooth", // 부드러운 스크롤
		});
	};

	return (
		<>
			{isVisible && (
				<button
					onClick={scrollToTop}
					className={classNames(
						"px-2 h-10 bg-white text-black rounded-full shadow-lg hover:bg-gray-200 transition-colors duration-300",

						className
					)}
					aria-label="페이지 상단으로 이동"
				>
					{/* <FaArrowUp className="text-xl" /> */}
					{/* <MdArrowUpward className="text-xl" /> */}
					TOP
				</button>
			)}
		</>
	);
};

export { GoToTopButton };
