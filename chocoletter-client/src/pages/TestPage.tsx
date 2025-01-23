import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/common/Button";

const TestPage: React.FC = () => {
	const navigate = useNavigate();

	// 모든 경로 목록을 배열로 관리
	const routes = [
		{ path: "/", label: "LoginView (/)" },
		{
			path: "/main/my/before",
			label: "MainMyBeforeView (/main/my/before)",
		},
		{ path: "/receive", label: "ReceiveView (/receive)" },
		{ path: "/letter", label: "LetterView (/letter)" },
		{
			path: "/selectletter",
			label: "SelectLetterTypeView (/selectletter)",
		},
		{
			path: "/write/general",
			label: "WriteGeneralLetterView (/write/general)",
		},
		{
			path: "/write/question",
			label: "WriteQuestionLetterView (/write/question)",
		},
		{ path: "/sentgift", label: "SentGiftView (/sentgift)" },
		{ path: "/selectgift", label: "SelectGiftTypeView (/selectgift)" },
		{
			path: "/video/waiting-room/12345",
			label: "WaitingRoomView (/video/waiting-room/12345)",
		},
		{ path: "/video/room", label: "VideoRoomView (/video/room)" },
		{ path: "/reset-time", label: "ResetTimeView (/reset-time)" },
		{ path: "/set-time", label: "SetTimeView (/set-time)" },
		{ path: "/rejected", label: "RejectedView (/rejected)" },
		{ path: "/error", label: "ErrorPage (/error)" },
		{ path: "/*", label: "Wildcard Route (/*) - ErrorPage" },
	];

	// 버튼 클릭 시 해당 경로로 이동
	const handleNavigation = (path: string) => {
		navigate(path);
	};

	return (
		<div className="flex flex-col min-h-full-vh bg-gray-100 p-4">
			{/* 헤더 */}
			<div className="flex justify-center items-center mb-6">
				<h1 className="text-2xl font-bold text-hrtColorPink">
					Test Page
				</h1>
			</div>

			{/* 버튼 컨테이너 */}
			<div className="flex flex-wrap justify-center gap-4">
				{routes.map((route, index) => (
					<Button
						key={index}
						onClick={() => handleNavigation(route.path)}
						className="w-full sm:w-48"
					>
						{route.label}
					</Button>
				))}
			</div>
		</div>
	);
};

export default TestPage;
