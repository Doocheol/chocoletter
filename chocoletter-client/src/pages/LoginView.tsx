import { Link } from "react-router";
import chocoletter_login_view_logo from "../assets/images/logo/chocoletter_login_view_logo.png";
import KakaoLoginButton from "../components/login/button/KakaoLoginButton";
import Onboarding from "../components/onboarding/Onboarding";
import { Button } from "../components/common/Button";

function LoginView() {
	return (
		<div className="h-[calc((var(--vh, 1vh) * 100)-8rem)] flex flex-col items-center justify-center px-4">
			{/* 테스트 페이지 이동 */}
			<div className="w-full flex justify-end mt-1">
				<Link to="/test">
					<Button className="text-xs sm:text-sm text-blue-500 hover:underline px-2 py-1">
						테스트
					</Button>
				</Link>
			</div>

			{/* 로고 이미지 */}
			<div className="flex justify-center items-center mb-8">
				<img
					src={chocoletter_login_view_logo}
					alt="chocoletter_logo"
					className="max-h-40 pt-10 rounded-2xl shadow-lg"
				/>
			</div>

			{/* 서비스 타이틀 및 서브타이틀 */}
			<div className="flex flex-col items-center mb-2">
				<h1 className="text-4xl font-bold text-center">초코레터</h1>
				<h2 className="text-xl text-gray-600">chocoletter</h2>
			</div>

			{/* 로그인 버튼들 */}
			<div className="flex flex-col items-center w-full mb-6 max-w-sm">
				<KakaoLoginButton />
			</div>

			{/* 온보딩 컴포넌트 */}
			<div className="w-full max-w-sm">
				<Onboarding />
			</div>
		</div>
	);
}

export default LoginView;
