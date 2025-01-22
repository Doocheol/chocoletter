import React from "react";
import { useNavigate } from "react-router-dom";
// import { useRecoilValue } from "recoil";
import chocoletter_login_view_logo from "../../assets/images/logo/chocoletter_login_view_logo.png";
import OnboardingIntro from "./OnboardingIntro";

// import { isLoginAtom } from "../../atoms/userAtoms";
// import { getUserInfo } from "../../features/userInfo";
// import { ITotalHeartPropsTypes } from "../../types/messageType";

function Onboarding() {
	const navigate = useNavigate();

	// const isLogin = useRecoilValue(isLoginAtom);
	// const userId = getUserInfo().userId;

	const onMyGiftBoxHandler = (e: React.MouseEvent<HTMLSpanElement>) => {
		e.preventDefault();
		// navigate(`/main/my/before/user?id=${userId}`);
		navigate("/main/my/before"); // 이동 페이지
	};

	return (
		<div className="flex flex-col items-center">
			<div className="flex flex-col h-1/3 pt-4 w-full">
				<div className="h-1/2 my-auto">
					<div className="bg-hrtColorYellow px-8 h-8 rounded-xl border-1 shadow-[0_4px_4px_rgba(251,139,176,1)]">
						<div className="text-2xl">사랑을 전해주세요!</div>
					</div>
				</div>
			</div>
			{/* <div className="h-1/3 flex justify-center items-center">
				<img
					src={chocoletter_login_view_logo}
					alt="chocoletter_login_view_logo"
					className="max-h-40"
				/>
			</div> */}
			<div className="flex flex-col h-1/3 pt-4 w-full">
				<div className="h-1/2 my-auto">
					<button
						className="bg-hrtColorYellow px-8 h-16 rounded-xl border-2 border-hrtColorPink shadow-[0_4px_4px_rgba(251,139,176,1)]"
						onClick={onMyGiftBoxHandler}
					>
						<div className="text-2xl">나의 초콜릿 박스 보기</div>
					</button>
				</div>
			</div>
			<OnboardingIntro />
		</div>
	);
}

export default Onboarding;
