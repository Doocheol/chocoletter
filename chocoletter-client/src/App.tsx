import { useEffect } from "react";
// import { useState } from "react";
import "./styles/App.css";
import { BrowserRouter, Route, Routes } from "react-router";
import LoginView from "./pages/LoginView";
// import { isLoginAtom } from "./atoms/auth/userAtoms";
// import { useRecoilValue } from "recoil";
import ErrorPage from "./pages/ErrorPage";
import { WaitingRoomView } from "./pages/VideoWaitingRoomView";
import { VideoRoomView } from "./pages/VideoRoomView";
import ReceiveView from "./pages/ReceiveView";
import LetterView from "./pages/LetterView";
import SelectGiftTypeView from "./pages/SelectGiftTypeView"
import SelectLetterTypeView from "./pages/SelectLetterTypeView";
import { ToastContainer } from "react-toastify";
import MainMyBeforeView from "./pages/MainMyBeforeView";

declare global {
	interface Window {
		Kakao: any;
	}
}

function App() {
	// const isLogin = useRecoilValue(isLoginAtom);

	// if (isLogin) {

	// } else {

	// }

	function setScreenSize() {
		let vh = window.innerHeight * 0.01;
		document.documentElement.style.setProperty("--vh", `${vh}px`); //"--vh"라는 속성으로 정의해준다.
	}

	useEffect(() => {
		setScreenSize();
	}, []);

	return (
		<div className="App bg-hrtColorBackground text-hrtColorOutline">
			<BrowserRouter>
				<Routes>
					<Route index element={<LoginView />} />
					<Route path="/*" element={<ErrorPage />} />
					<Route
						path="/main/my/before"
						element={<MainMyBeforeView />}
					/>
					<Route path="/receive" element={<ReceiveView />} />
					<Route path="/letter" element={<LetterView />} />
					<Route path="/selectgift" element={<SelectGiftTypeView />} />
					<Route path="/selectletter" element={<SelectLetterTypeView />} />
					<Route
						path="/video/waiting-room/:sessionIdInit"
						element={<WaitingRoomView />}
					/>
					<Route path="/video/room" element={<VideoRoomView />} />
				</Routes>
			</BrowserRouter>
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
