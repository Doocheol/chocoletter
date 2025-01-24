import { useEffect } from "react";
import "./styles/App.css";
import { BrowserRouter, Route, Routes } from "react-router";
import LoginView from "./pages/LoginView";
import ErrorPage from "./pages/ErrorPage";
import ReceiveView from "./pages/ReceiveView";
import LetterView from "./pages/LetterView";
import SelectGiftTypeView from "./pages/SelectGiftTypeView";
import SelectLetterTypeView from "./pages/SelectLetterTypeView";
import WriteGeneralLetterView from "./pages/WriteGeneralLetterView";
import WriteQuestionLetterView from "./pages/WriteQuestionLetterView";
import SentGiftView from "./pages/SentGiftView";
import { ToastContainer } from "react-toastify";
import MainMyBeforeView from "./pages/MainMyBeforeView";
import ErrorBoundary from "./components/common/ErrorBoundary";
import { useSetRecoilState } from "recoil";
import {
	isLoginAtom,
	userNameAtom,
	userProfileUrlAtom,
} from "./atoms/auth/userAtoms";
import { fetchUserInfo, login } from "./services/userApi";
import { getUserInfo } from "./services/userInfo";
import KakaoLoginCallback from "./components/login/KakaoLoginCallback";
import ResetTimeView from "./pages/ResetTimeView";
import SetTimeView from "./pages/SetTimeView";
import RejectedView from "./pages/RejectedView";
import useViewportHeight from "./hooks/useViewportHeight";
import TestPage from "./pages/TestPage";
import GiftListBeforeView from "./pages/GiftListBeforeView";
import WaitingRoomView from "./pages/VideoWaitingRoomView";
import VideoRoomView from "./pages/VideoRoomView";

declare global {
	interface Window {
		Kakao: any;
	}
}

function App() {
	const setIsLogin = useSetRecoilState(isLoginAtom);
	const setUserName = useSetRecoilState(userNameAtom);
	const setUserProfileUrl = useSetRecoilState(userProfileUrlAtom);

	useViewportHeight(); // 커스텀 훅 호출

	useEffect(() => {
		const initializeUser = async () => {
			try {
				const userInfo = fetchUserInfo();
				if (userInfo) {
					// 서버에서 사용자 정보를 검증하는 API 호출 (필요 시)
					const response = await login();
					const { userId, userProfileUrl } = JSON.parse(response);

					// Recoil 상태 업데이트
					setIsLogin(true);
					setUserName(userId);
					setUserProfileUrl(userProfileUrl);
				}
			} catch (error) {
				console.log("사용자 정보 조회 실패:", error);
				setIsLogin(false);
				setUserName("");
				setUserProfileUrl("");
			}
		};

		// 로그인 상태 확인
		const userInfo = getUserInfo();
		if (userInfo) {
			initializeUser();
		}
	}, [setIsLogin, setUserName, setUserProfileUrl]);

	return (
		<div className="App bg-hrtColorBackground text-hrtColorOutline">
			<ErrorBoundary>
				<BrowserRouter>
					<Routes>
						<Route index element={<LoginView />} />
						<Route path="/test" element={<TestPage />} />
						<Route path="/*" element={<ErrorPage />} />
						<Route path="/error" element={<ErrorPage />} />
						<Route
							path="/auth/kakao/callback"
							element={<KakaoLoginCallback />}
						/>
						<Route
							path="/main/my/before"
							element={<MainMyBeforeView />}
						/>
						<Route path="/receive/:giftId" element={<ReceiveView />} />
						<Route path="/letter" element={<LetterView />} />
						<Route
							path="/selectletter"
							element={<SelectLetterTypeView />}
						/>
						<Route
							path="/write/general"
							element={<WriteGeneralLetterView />}
						/>
						<Route
							path="/write/question"
							element={<WriteQuestionLetterView />}
						/>
						<Route path="/sentgift" element={<SentGiftView />} />
						<Route
							path="/selectgift"
							element={<SelectGiftTypeView />}
						/>
						<Route
							path="/video/waiting-room/:sessionIdInit"
							element={<WaitingRoomView />}
						/>
						<Route path="/video/room" element={<VideoRoomView />} />
						<Route path="/reset-time" element={<ResetTimeView />} />
						<Route path="/set-time" element={<SetTimeView />} />
						<Route path="/rejected" element={<RejectedView />} />
						<Route path="/gift/list/before" element={<GiftListBeforeView/>} />
					</Routes>
				</BrowserRouter>
			</ErrorBoundary>
			<ToastContainer
				position="top-right"
				autoClose={5000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme="colored"
				className="custom-toast-body" /* 필요 시 추가 */
			/>
		</div>
	);
}

export default App;
