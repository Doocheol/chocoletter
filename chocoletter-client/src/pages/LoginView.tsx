import { useNavigate } from "react-router";
import giftbox_event_1 from "../assets/images/giftbox/giftbox_event_1.svg";
import login_view_service_title from "../assets/images/logo/login_view_service_title.svg";
import KakaoLoginButton from "../components/login/button/KakaoLoginButton";
import Onboarding from "../components/onboarding/Onboarding";
import { giftBoxIdAtom, isLoginAtom } from "../atoms/auth/userAtoms";
import { useRecoilValue } from "recoil";
import { useEffect, useState } from "react";
import { MyUserInfo } from "../types/user";
import {
	deleteUserInfo,
	getUserInfo,
	savingUserInfo,
} from "../services/userInfo";

function LoginView() {
	const isLogin = useRecoilValue(isLoginAtom);
	const giftBoxId = useRecoilValue(giftBoxIdAtom);

	const navigate = useNavigate();

	// 로컬스토리지에서 가져온 사용자 정보를 상태로 관리
	const [userInfo, setUserInfo] = useState<MyUserInfo | null>(null);

	// 컴포넌트가 마운트될 때 로컬스토리지에 저장된 사용자 정보를 확인
	useEffect(() => {
		const storedUserInfo = getUserInfo();
		if (storedUserInfo) {
			setUserInfo(storedUserInfo);
		}
	}, []);

	// 로그인 버튼 클릭 시 호출되는 함수 (실제 로그인 API 호출 대신 예시 데이터 사용)
	const handledummyLogin = () => {
		// 실제 환경에서는 로그인 API를 통해 받아온 데이터를 사용하세요.
		const dummyUser: MyUserInfo = {
			userName: "johnDoe",
			accessToken: "fakeAccessToken123",
			giftBoxId: "giftBox_123",
		};

		// 로컬스토리지에 저장
		savingUserInfo(dummyUser);
		// 상태 업데이트
		setUserInfo(dummyUser);
	};

	// 로그아웃 버튼 클릭 시 호출되는 함수
	const handledummyLogout = () => {
		// 로컬스토리지에서 사용자 정보 삭제
		deleteUserInfo();
		// 상태 초기화
		setUserInfo(null);
	};

	useEffect(() => {
		if (isLogin) {
			// 이미 로그인됨 → 메인 페이지로 이동
			navigate(`/main/${giftBoxId}`);
		}
	}, [isLogin, giftBoxId, navigate]);

	return (
		<div className="h-[calc((var(--vh, 1vh) * 100)-8rem)] flex flex-col items-center justify-center px-4 onboarding-intro-container">
			<div className="flex justify-center items-center mb-20">
				<h1 className="sr-only">
					발렌타인데이를 특별하게, 익명 편지 서비스!
				</h1>
			</div>

			<button
				onClick={handledummyLogin}
				className="w-16 h-16 flex justify-center items-center bg-yellow-300 p-1 rounded-lg border border-black transition focus:outline-none"
				aria-label="카카오톡 공유"
			></button>
			<button
				onClick={handledummyLogout}
				className="w-16 h-16 flex justify-center items-center bg-yellow-300 p-1 rounded-lg border border-black transition focus:outline-none"
				aria-label="카카오톡 공유"
			></button>

			{/* 로고 이미지 */}
			<div className="flex justify-center items-center mt-8 mb-10 pl-6">
				<img
					src={giftbox_event_1}
					alt="giftbox_event_1"
					style={{ width: "240px", height: "auto" }}
				/>{" "}
			</div>

			{/* 서비스 타이틀 및 서브타이틀 */}
			<div className="flex flex-col items-center mb-10">
				<img
					src={login_view_service_title}
					alt="login_view_service_title"
					className=""
				/>
				{/* <h1 className="text-gray-600 font-extrabold">chocoletter</h1> */}
			</div>

			{/* 온보딩 컴포넌트 */}
			<div className="w-full max-w-sm mb-6">
				<Onboarding />
			</div>

			{/* 로그인 버튼들 */}
			<div className="flex flex-col items-center mb-4">
				<KakaoLoginButton />
			</div>
		</div>
	);
}

export default LoginView;
