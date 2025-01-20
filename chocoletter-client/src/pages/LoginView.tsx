import { useRecoilState } from "recoil";
import { useEffect } from "react";
import chocoletter_login_view_logo from "../assets/images/logo/chocoletter_login_view_logo.png";
import KakaoLoginButton from "../components/login/button/KakaoLoginButton";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function LoginView() {
	const navigate = useNavigate();

	const handleLoginSuccess = (isFirstLogin: boolean) => {
		if (isFirstLogin) {
			toast.info("첫 로그인입니다. 튜토리얼을 진행해주세요."); // 변경: info 메시지
			// navigate("/tutorial-focus");
		} else {
			toast.success("로그인에 성공했습니다."); // 변경: success 메시지
			// navigate("/main-my-before");
		}
	};

	const handleLoginFailure = (error: any) => {
		const errorMessage =
			error.response?.data?.message ||
			"로그인에 실패했습니다. 다시 시도해주세요.";
		toast.error(errorMessage);
	};

	return (
		<div className="h-[calc((var(--vh, 1vh) * 100)-8rem)]">
			<div className="h-1/3 flex justify-center items-center">
				<img
					src={chocoletter_login_view_logo}
					alt="chocoletter_logo"
					className="max-h-40"
				/>
			</div>
			<KakaoLoginButton
				onLoginSuccess={handleLoginSuccess}
				onLoginFailure={handleLoginFailure} // onLoginFailure 전달
			/>
		</div>
	);
}

export default LoginView;
