import { useNavigate } from "react-router";
import { Button } from "../components/common/Button";

export default function ErrorPage() {
	const navigate = useNavigate();

	const handleGoHome = () => {
		navigate("/");
	};

	return (
		<div className="flex items-center justify-center min-h-screen">
			<div className="text-center">
				<h1 className="text-xl font-bold">
					페이지를 찾을 수 없습니다. 껄껄
				</h1>
				<Button onClick={handleGoHome} className="bg-white">홈으로 이동</Button>
			</div>
		</div>
	);
}
