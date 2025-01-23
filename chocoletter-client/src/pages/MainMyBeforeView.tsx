import React, { useState } from "react";
import { useRecoilValue } from "recoil";
import { availableGiftsAtom, receivedGiftsAtom } from "../atoms/gift/giftAtoms";
import { FaRegCircleQuestion } from "react-icons/fa6";
import { FaHome, FaComments, FaUserCircle } from "react-icons/fa";
import { FiShare, FiCamera } from "react-icons/fi";
import ShareModal from "../components/main/my/before/modal/ShareModal";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const MainMyBeforeView: React.FC = () => {
	const navigate = useNavigate();

	const availableGifts = useRecoilValue(availableGiftsAtom);
	const receivedGifts = useRecoilValue(receivedGiftsAtom);

	// 모달 상태 관리
	const [isShareModalOpen, setIsShareModalOpen] = useState(false);

	// 버튼 클릭 핸들러 (예시)
	const handleShare = () => {
		setIsShareModalOpen(true);
	};

	const handleCapture = () => {
		// 캡처 기능 구현
		alert("캡처 버튼 클릭!");
	};

	const handleHome = () => {
		navigate("/");
		toast.info("홈으로 이동!");
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
		<div className="flex flex-col min-h-full-vh">
			{/* 헤더 */}
			<div className="flex justify-between items-center px-6 py-4 bg-white shadow-md safe-top">
				<button onClick={handleHome} className="text-2xl">
					<FaHome />
				</button>
				<button onClick={handleTutorial} className="text-2xl">
					<FaRegCircleQuestion />
				</button>
				<button onClick={handleChat} className="text-2xl">
					<FaComments />
				</button>
				<button onClick={handleProfile} className="text-2xl">
					<FaUserCircle />
				</button>
			</div>

			{/* 본문 */}
			<div className="flex-grow flex flex-col items-center justify-center bg-gray-100 px-4 py-6">
				<div className="flex flex-col items-center justify-center mb-6 space-y-4">
					{/* 개봉 가능한 초콜릿 개수 */}
					<div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md w-full max-w-sm">
						<span className="text-3xl font-bold text-hrtColorPink">
							{availableGifts}
						</span>
						<span className="mt-3 text-lg text-gray-700">
							개봉 가능 초콜릿
						</span>
					</div>

					{/* 받은 전체 초콜릿 개수 */}
					<div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md w-full max-w-sm">
						<span className="text-3xl font-bold text-hrtColorPink">
							{receivedGifts}
						</span>
						<span className="mt-3 text-lg text-gray-700">
							받은 전체 초콜릿
						</span>
					</div>
				</div>

				{/* 내 초콜릿 박스 아이콘 */}
				<button
					onClick={handleMyChocolateBox}
					className="flex items-center justify-center w-24 h-24 bg-hrtColorYellow shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-full"
				>
					<span className="text-4xl text-hrtColorPink">🍫</span>
				</button>
				<div className="text-base text-gray-700 mt-6 px-4 text-center">
					개봉 가능한 일반 초콜릿이 있으면 박스를 클릭하여 편지를 읽어
					볼 수 있어요!
				</div>
			</div>

			{/* 하단 */}
			<div className="flex justify-around items-center px-6 py-4 bg-white shadow-inner safe-bottom">
				<button
					onClick={handleShare}
					className="flex flex-col items-center space-y-1"
				>
					<FiShare className="text-2xl text-gray-700" />
					<span className="text-sm text-gray-700">공유</span>
				</button>
				<button
					onClick={handleCapture}
					className="flex flex-col items-center space-y-1"
				>
					<FiCamera className="text-2xl text-gray-700" />
					<span className="text-sm text-gray-700">캡처</span>
				</button>
			</div>

			<ShareModal
				isOpen={isShareModalOpen}
				onClose={() => setIsShareModalOpen(false)}
			/>
		</div>
	);
};

export default MainMyBeforeView;
