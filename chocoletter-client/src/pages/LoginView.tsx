import chocoletter_login_view_logo from "../assets/images/logo/chocoletter_login_view_logo.png";
import KakaoLoginButton from "../components/login/button/KakaoLoginButton";
import Onboarding from "../components/onboarding/Onboarding";

function LoginView() {
	return (
		<div className="h-[calc((var(--vh, 1vh) * 100)-8rem)] flex flex-col items-center justify-center px-4">
			{/* 로고 이미지 */}
			<div className="flex justify-center items-center mb-8">
				<img
					src={chocoletter_login_view_logo}
					alt="chocoletter_logo"
					className="max-h-40 pt-10 rounded-2xl shadow-lg"
				/>
			</div>

			{/* 서비스 타이틀 및 서브타이틀 */}
			<div className="flex flex-col items-center mb-6">
				<h1 className="text-4xl font-bold text-center">초코레터</h1>
				<h2 className="text-xl text-gray-600 mt-2">chocoletter</h2>
			</div>

			{/* 로그인 버튼들 */}
			<div className="flex flex-col items-center space-y-4 w-full max-w-sm">
				<KakaoLoginButton />
			</div>

			{/* 온보딩 컴포넌트 */}
			<div className="mt-8 w-full max-w-sm">
				<Onboarding />
			</div>
		</div>
	);
}

export default LoginView;
