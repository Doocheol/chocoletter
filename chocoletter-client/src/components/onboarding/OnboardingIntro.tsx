import { useState, useEffect, useRef } from "react";

import onboarding_intro_1 from "../../assets/images/logo/onboarding_intro_1.png";
import onboarding_intro_2 from "../../assets/images/logo/onboarding_intro_2.png";
import onboarding_intro_3 from "../../assets/images/logo/onboarding_intro_3.png";
import { GoToTopButton } from "../login/button/GoToTopButton";

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
		<div className="flex flex-col w-full">
			{/* 첫 번째 소개 이미지 */}

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
					className="p-2 rounded-full max-h-24"
				/>
			</div>

			{/* 서비스 소개 제목 */}
			<div
				className={`pt-2 ${
					scrollPosition > 90 ? "slide-in-bottom" : "collapse"
				}`}
			>
				<span className="flex justify-center items-center my-2">
					<p className="border-b border-hrtColorPink w-1/4 my-4"></p>
					<p className="mx-4 text-sm text-hrtColorPink textShadow-none">
						초코레터? 뭘까요?
					</p>
					<p className="border-b border-hrtColorPink w-1/4 my-4"></p>
				</span>
			</div>

			{/* 서비스 설명 */}
			<div
				className={`mb-2 ${
					scrollPosition > 100 ? "slide-in-bottom" : "collapse"
				}`}
			>
				<span className="text-xl flex justify-center text-white items-center textShadow ">
					<p className="mr-1 white text-hrtColorPink pr-2">
						익명 편지 서비스
					</p>
					<p className="mr-1 purple ">초코레터!</p>
				</span>
				<span className="text-lg flex flex-col justify-center text-white items-center textShadow my-2 ">
					<p className="mr-1 purple pr-2">초콜릿 서비스는</p>
					<p className="mr-1 white text-hrtColorPink">
						발렌타인데이인 2월 14일에
					</p>
					<p className="mr-1 purple">모든 편지를 확인 가능해요!</p>
				</span>

				{/* 두 번째 소개 이미지 */}
				<div className="flex flex-col items-center mx-8">
					<img
						src={onboarding_intro_2}
						alt="onboarding_intro_2"
						className="p-2 max-h-64"
					/>
				</div>
			</div>

			{/* 추가 서비스 기능 설명 */}
			<div
				className={`mt-2 mb-4 ${
					scrollPosition > 330 ? "slide-in-bottom" : "collapse"
				}`}
			>
				<div className="flex flex-col items-center mx-8">
					<span className="text-lg flex justify-center text-white items-center textShadow my-2 ">
						<p className="mr-1 white text-hrtColorPink pr-2">
							그럼, 다음 단계로 두둥,,,
						</p>
					</span>
					<span className="text-lg flex flex-col justify-center text-white items-center textShadow py-2 ">
						<p className="purple pr-2">
							나만의 초콜릿 박스를 만들어
						</p>
						<p className="pr-1 white text-hrtColorPink">
							소중한 사람과 공유하고
						</p>
						<p className="pr-1 purple">
							특별한 초콜릿도 선물해보세요!
						</p>
					</span>

					{/* 세 번째 소개 이미지 */}
					<img
						src={onboarding_intro_3}
						alt="onboarding_intro_3"
						className="p-2 max-h-64"
					/>
				</div>
			</div>

			{/* 초콜릿 상자 보러가기 링크 */}
			<a
				className={`mx-4 mb-4 bg-hrtColorYellow rounded-xl border-2 border-hrtColorPink ${
					scrollPosition > 330 ? "heartbeat" : "collapse"
				} `}
				href="https://www.chocolate-letter.com"
			>
				<p className="py-2 text-hrtColorPink">
					"초코레터"팀의 초콜릿 박스 보러가기
				</p>
			</a>

			{/* 페이지 상단으로 가기 버튼 */}
			<div className="px-8 flex justify-end">
				<GoToTopButton
					// className="mb-" // 버튼의 너비와 높이 조정
					scrollThreshold={600} // 필요에 따라 조정
				/>
			</div>

			{/* 추가 추천 문구 */}
			<div className="flex justify-center">
				<p className="text-lg text-white">
					Sweet Valentine's Day with chocoletter!
				</p>
			</div>
		</div>
	);
}

export default OnboardingIntro;
