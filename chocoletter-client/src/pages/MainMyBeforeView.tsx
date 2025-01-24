import React, { useRef, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { availableGiftsAtom, receivedGiftsAtom } from "../atoms/gift/giftAtoms";
import { FaRegCircleQuestion } from "react-icons/fa6";
import { FaHome, FaComments, FaUserCircle } from "react-icons/fa";
import { FiShare, FiCamera } from "react-icons/fi";
import ShareModal from "../components/main/my/before/modal/ShareModal";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import html2canvas from "html2canvas";
import { Button } from "../components/common/Button";
import CaptureModal from "../components/main/my/before/modal/CaptureModal";
import { isFirstLoginAtom } from "../atoms/auth/userAtoms";
import FirstLoginTutorialOverlay from "../components/tutorial/FirstLoginTutorialOverlay";

const MainMyBeforeView: React.FC = () => {
	const navigate = useNavigate();
	const availableGifts = useRecoilValue(availableGiftsAtom);
	const receivedGifts = useRecoilValue(receivedGiftsAtom);

	// 모달 상태 관리
	const [isShareModalOpen, setIsShareModalOpen] = useState(false);

	// 튜토리얼 여부 (recoil-persist로 관리)
	const [isFirstLogin, setIsFirstLogin] = useRecoilState(isFirstLoginAtom);

	// 캡처 상태 관리
	const [capturedImage, setCapturedImage] = useState<string | null>(null);
	const [isCaptureModalVisible, setIsCaptureModalVisible] = useState(false);
	const captureRef = useRef<HTMLDivElement>(null);

	// 튜토리얼 아이콘에 연결할 ref
	const tutorialIconRef = useRef<HTMLButtonElement>(null);

	// 버튼 클릭 핸들러 (예시)
	const handleShare = () => {
		setIsShareModalOpen(true);
	};

	const handleCapture = async () => {
		if (captureRef.current) {
			try {
				setIsCaptureModalVisible(true); // 모달 표시 (로딩 상태)
				const canvas = await html2canvas(captureRef.current);
				const imageData = canvas.toDataURL("image/png");
				setCapturedImage(imageData);
			} catch (error) {
				// console.error("캡처 중 오류가 발생했습니다:", error);
				toast.error("캡처 실패!");
				setIsCaptureModalVisible(false); // 에러 시 모달 닫기
			}
		}
	};

	const downloadImage = (uri: string, filename: string) => {
		const link = document.createElement("a");
		link.href = uri;
		link.download = filename;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
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

				<button
					ref={tutorialIconRef}
					onClick={handleTutorial}
					className="text-2xl"
				>
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
				<div ref={captureRef}>
					<button
						onClick={handleMyChocolateBox}
						className="flex items-center justify-center w-24 h-24 bg-hrtColorYellow shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-full"
					>
						<span className="text-4xl text-hrtColorPink">🍫</span>
					</button>
				</div>
				<div className="text-base text-gray-700 mt-6 px-4 text-center">
					개봉 가능한 일반 초콜릿이 있으면 박스를 클릭하여 편지를 읽어
					볼 수 있어요!
				</div>
			</div>

			{/* 하단 */}
			<div className="flex justify-around items-center px-6 py-4 bg-white shadow-inner safe-bottom">
				<Button
					onClick={handleShare}
					className="flex flex-col items-center space-y-1"
				>
					<FiShare className="text-2xl text-gray-700" />
					<span className="text-sm text-gray-700">공유</span>
				</Button>
				{/* 공통 Button 컴포넌트 사용하여 캡처 버튼 변경 */}
				<Button
					onClick={handleCapture}
					className="flex flex-col items-center space-y-1"
				>
					<FiCamera className="text-2xl text-gray-700" />
					<span className="text-sm text-gray-700">캡처</span>
				</Button>
			</div>

			{/* 캡처 모달 */}
			<CaptureModal
				isVisible={isCaptureModalVisible}
				imageSrc={capturedImage}
				onClose={() => setIsCaptureModalVisible(false)}
			/>

			<ShareModal
				isOpen={isShareModalOpen}
				onClose={() => setIsShareModalOpen(false)}
			/>

			{/*
        최초 로그인(튜토리얼 미시청)이라면 오버레이 표시.
        닫으면 isFirstLogin을 false로 변경해, 다시는 표시되지 않게 함.
      */}
			{isFirstLogin && (
				<FirstLoginTutorialOverlay
					targetRef={tutorialIconRef}
					onClose={() => setIsFirstLogin(false)}
				/>
			)}
		</div>
	);
};

export default MainMyBeforeView;
