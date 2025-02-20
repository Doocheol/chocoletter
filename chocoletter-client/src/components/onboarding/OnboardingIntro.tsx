import { useState, useEffect, useRef } from "react";

import onboarding_intro_choco_1 from "../../assets/images/logo/onboarding_intro_choco_1.svg";
import onboarding_intro_choco_2 from "../../assets/images/logo/onboarding_intro_choco_2.svg";
import onboarding_intro_choco_3 from "../../assets/images/logo/onboarding_intro_choco_3.svg";
import onboarding_intro_text_1 from "../../assets/images/logo/onboarding_intro_text_1.svg";
import onboarding_intro_text_2 from "../../assets/images/logo/onboarding_intro_text_2.svg";
import onboarding_intro_text_3 from "../../assets/images/logo/onboarding_intro_text_3.svg";

import login_view_down_arrow from "../../assets/images/button/login_view_down_arrow.svg";

function OnboardingIntro() {
	const [scrollPosition, setScrollPosition] = useState(0);
	const updateScroll = () => {
		setScrollPosition(window.scrollY || document.documentElement.scrollTop);
	};

	const introRef = useRef<HTMLDivElement>(null);
	const onMoreClick = () => {
		introRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	useEffect(() => {
		window.addEventListener("scroll", updateScroll);
		return () => window.removeEventListener("scroll", updateScroll);
	}, []);

	return (
		<div className="onboarding-intro-container flex flex-col w-full overflow-hidden">
			{/* 초코레터 이용 안내서 */}
			<span className="flex justify-center items-center my-8">
				<p className="border-b border-chocoletterPurpleBold w-[50px] my-4"></p>
				<p className="mx-4 text-[24px] text-chocoletterPurpleBold text-bold textShadow-none">
					초코레터 이용 안내서
				</p>
				<p className="border-b border-chocoletterPurpleBold w-[50px] my-4"></p>
			</span>

			<div
				className={`flex flex-col justify-center items-center ${
					scrollPosition < 90
						? "shake-vertical"
						: "scale-out-center hidden"
				}`}
				// onClick={onMoreClick}
				ref={introRef}
			>
				<p className="text-chocoletterPurpleBold"> Scroll!</p>
				<img
					src={login_view_down_arrow}
					alt="login_view_down_arrow"
					className="p-2 max-h-24 opacity-80"
				/>
			</div>

			{/* 서비스 설명 */}
			<div
				className={`mb-14 ${
					scrollPosition > 70 ? "slide-in-bottom" : "collapse"
				}`}
			>
				{/* 첫 번째 소개 이미지 */}
				<div className="flex flex-col items-center mx-8 mb-4">
					<img
						src={onboarding_intro_choco_1}
						alt="onboarding_intro_choco_1"
						className="p-2 max-h-64"
					/>
					<img
						src={onboarding_intro_text_1}
						alt="onboarding_intro_text_1"
						className="p-2 max-h-64"
					/>
				</div>
			</div>

			{/* 추가 서비스 기능 설명 */}
			<div
				className={`mb-14 ${
					scrollPosition > 240 ? "slide-in-bottom" : "collapse"
				}`}
			>
				<div className="flex flex-col items-center mx-8 mb-4">
					{/* 두 번째 소개 이미지 */}
					<img
						src={onboarding_intro_choco_2}
						alt="onboarding_intro_choco_2"
						className="p-2 max-h-64"
					/>
					<img
						src={onboarding_intro_text_2}
						alt="onboarding_intro_text_2"
						className="p-2 max-h-64"
					/>
				</div>
			</div>

			<div
				className={`${
					scrollPosition > 300 ? "slide-in-bottom" : "collapse"
				}`}
			>
				<div className="flex flex-col items-center mx-8 mb-4">
					{/* 세 번째 소개 이미지 */}
					<img
						src={onboarding_intro_choco_3}
						alt="onboarding_intro_choco_3"
						className="p-2 max-h-64"
					/>
					<img
						src={onboarding_intro_text_3}
						alt="onboarding_intro_text_3"
						className="p-2 max-h-64"
					/>
				</div>
			</div>
		</div>
	);
}

export default OnboardingIntro;
