import { useState, useEffect, useRef } from "react";

import onboarding_intro_1 from "../../assets/images/logo/onboarding_intro_1.png";
import onboarding_intro_2 from "../../assets/images/logo/onboarding_intro_2.png";
import onboarding_intro_3 from "../../assets/images/logo/onboarding_intro_3.png";
import { GoToTopButton } from "../login/button/GoToTopButton";
// import { useHref } from "react-router-dom";

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
	}, []);

	return (
		<div className="flex flex-col w-full">
			<div
				className={`flex justify-center items-center pt-2 ${
					scrollPosition < 90
						? "shake-vertical"
						: "scale-out-center hidden"
				}`}
				onClick={onMoreClick}
				ref={introRef}
			>
				<img
					src={onboarding_intro_1}
					alt="onboarding_intro_1"
					className="p-2 max-h-24"
				/>
			</div>
			<div
				className={`pt-2 ${
					scrollPosition > 90 ? "slide-in-bottom" : "collapse"
				}`}
			>
				<span className="flex justify-center items-center my-2">
					<p className="border-b border-hrtColorPink w-1/4 my-4"></p>
					<p className="mx-4 text-sm text-hrtColorPink textShadow-none">
						초코레터는 뭘까요?
					</p>
					<p className="border-b border-hrtColorPink w-1/4 my-4"></p>
				</span>
			</div>
			<div
				className={`mt-2 mb-6 ${
					scrollPosition > 100 ? "slide-in-bottom" : "collapse"
				}`}
			>
				<span className="text-xl flex justify-center text-white items-center textShadow ">
					<p className="mr-1 white text-hrtColorPink pr-2">
						익명 편지 서비스
					</p>
					<p className="mr-1 white text-hrtColorPink">초코레터!</p>
				</span>
				<span className="text-lg flex flex-col justify-center text-white items-center textShadow my-2 ">
					<p className="mr-1 purple pr-2">초콜릿은</p>
					<p className="mr-1 white text-hrtColorPink">2월 14일</p>
					<p className="mr-1 purple">발렌타인데이 때 전체 열려요</p>
				</span>

				<div className="flex flex-col items-center mx-8">
					<img
						src={onboarding_intro_2}
						alt="onboarding_intro_2"
						className="p-2 max-h-64"
					/>
				</div>
			</div>

			<div
				className={`mt-2 mb-4 ${
					scrollPosition > 330 ? "slide-in-bottom" : "collapse"
				}`}
			>
				<div className="flex flex-col items-center mx-8">
					<span className="text-lg flex justify-center text-white items-center textShadow my-2 ">
						<p className="mr-1 white text-hrtColorPink pr-2">
							그러면 두둥,,
						</p>
					</span>
					<span className="text-lg flex flex-col justify-center text-white items-center textShadow my-2 ">
						<p className="mr-1 purple pr-2">
							나의 초콜릿 박스를 만들어
						</p>
						<p className="mr-1 white text-hrtColorPink">
							상대방에게 공유하고
						</p>
						<p className="mr-1 purple">
							사랑하는 사람에게 초콜릿을 만들어주세요!
						</p>
					</span>

					<img
						src={onboarding_intro_3}
						alt="onboarding_intro_3"
						className="p-2 max-h-80"
					/>
				</div>
			</div>
			<a
				className={`mx-8 mb-8 bg-hrtColorYellow rounded-xl border-2 border-hrtColorPink ${
					scrollPosition > 330 ? "heartbeat" : "collapse"
				} `}
				href="https://www.chocoletter.store"
			>
				<p className="py-2 text-hrtColorPink">
					초코레터팀의 초콜릿 상자 보러가기
				</p>
			</a>
			<div className="mx-8 mb-12 flex justify-end">
				<GoToTopButton
					className="mb-" // 버튼의 너비와 높이 조정
					scrollThreshold={600} // 필요에 따라 조정
				/>
			</div>
		</div>
	);
}

export default OnboardingIntro;
