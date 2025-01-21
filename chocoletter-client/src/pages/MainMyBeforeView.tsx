// src/pages/MainScreen.tsx

import React from "react";
import { useRecoilValue } from "recoil";
import { availableGiftsAtom, receivedGiftsAtom } from "../atoms/gift/giftAtoms";

// React Icons 임포트
import {
	FaHome,
	FaChalkboardTeacher,
	FaComments,
	FaUserCircle,
} from "react-icons/fa";
import { FiShare, FiCamera } from "react-icons/fi";
// import { useNavigate } from "react-router";

const MainMyBeforeView: React.FC = () => {
	const availableGifts = useRecoilValue(availableGiftsAtom);
	const receivedGifts = useRecoilValue(receivedGiftsAtom);

	// const navigate = useNavigate();

	// 버튼 클릭 핸들러 (예시)
	const handleShare = () => {
		// 공유 기능 구현
		alert("공유 버튼 클릭!");
	};

	const handleCapture = () => {
		// 캡처 기능 구현
		alert("캡처 버튼 클릭!");
	};

	const handleHome = () => {
		// 홈으로 이동
		alert("홈 아이콘 클릭!");
	};

	const handleTutorial = () => {
		// 튜토리얼으로 이동
		alert("튜토리얼 아이콘 클릭!");
	};

	const handleChat = () => {
		// 채팅방으로 이동
		alert("채팅방 아이콘 클릭!");
	};

	const handleProfile = () => {
		// 프로필 페이지로 이동
		alert("프로필 아이콘 클릭!");
	};

	const handleMyChocolateBox = () => {
		// 내 초콜릿 박스 페이지로 이동
		alert("내 초콜릿 박스 아이콘 클릭!");
	};

	return (
		<div className="flex flex-col h-screen">
			{/* 헤더 */}
			<header className="flex justify-between items-center p-4 bg-white shadow-md">
				<button onClick={handleHome} className="text-2xl">
					<FaHome />
				</button>
				<button onClick={handleTutorial} className="text-2xl">
					<FaChalkboardTeacher />
				</button>
				<button onClick={handleChat} className="text-2xl">
					<FaComments />
				</button>
				<button onClick={handleProfile} className="text-2xl">
					<FaUserCircle />
				</button>
			</header>

			{/* 본문 */}
			<main className="flex-grow flex flex-col items-center justify-center bg-gray-100">
				<div className="flex space-x-8 mb-8">
					{/* 개봉 가능한 초콜릿 개수 */}
					<div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-md">
						<span className="text-4xl font-bold text-hrtColorPink">
							{availableGifts}
						</span>
						<span className="mt-2 text-lg text-gray-700">
							개봉 가능한 초콜릿
						</span>
					</div>

					{/* 받은 전체 초콜릿 개수 */}
					<div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-md">
						<span className="text-4xl font-bold text-hrtColorPink">
							{receivedGifts}
						</span>
						<span className="mt-2 text-lg text-gray-700">
							받은 전체 초콜릿
						</span>
					</div>
				</div>

				{/* 내 초콜릿 박스 아이콘 */}
				<button
					onClick={handleMyChocolateBox}
					className="flex items-center justify-center w-48 h-48 bg-hrtColorYellow rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300"
				>
					<span className="text-3xl text-hrtColorPink">🍫</span>
				</button>
			</main>

			{/* 하단 */}
			<footer className="flex justify-around items-center p-4 bg-white shadow-inner">
				<button
					onClick={handleShare}
					className="flex flex-col items-center"
				>
					<FiShare className="text-2xl text-gray-700" />
					<span className="text-sm text-gray-700">공유</span>
				</button>
				<button
					onClick={handleCapture}
					className="flex flex-col items-center"
				>
					<FiCamera className="text-2xl text-gray-700" />
					<span className="text-sm text-gray-700">캡처</span>
				</button>
			</footer>
		</div>
	);
};

export default MainMyBeforeView;
