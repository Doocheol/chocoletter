// src/pages/MainMyBeforeView.tsx

import React, { useRef, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import html2canvas from "html2canvas";

import { availableGiftsAtom, receivedGiftsAtom } from "../atoms/gift/giftAtoms";
import { isFirstLoginAtom } from "../atoms/auth/userAtoms";

import { FaRegCircleQuestion } from "react-icons/fa6";
import { FaHome, FaComments, FaUserCircle } from "react-icons/fa";
import { FiShare, FiCamera } from "react-icons/fi";

import ShareModal from "../components/main/my/before/modal/ShareModal";
import CaptureModal from "../components/main/my/before/modal/CaptureModal";
import FirstLoginTutorialOverlay from "../components/tutorial/FirstLoginTutorialOverlay";
import { Button } from "../components/common/Button";

// === 뷰포트 높이 보정 훅 ===
import useViewportHeight from "../hooks/useViewportHeight";

// 이미지 리소스 예시
import my_gift_box from "../assets/images/giftbox/my_giftbox_main.png";

const MainMyBeforeView: React.FC = () => {
	const navigate = useNavigate();

	// (1) 주소창 높이 보정 훅
	useViewportHeight();

	// Recoil 상태
	const availableGifts = useRecoilValue(availableGiftsAtom);
	const receivedGifts = useRecoilValue(receivedGiftsAtom);
	const [isFirstLogin, setIsFirstLogin] = useRecoilState(isFirstLoginAtom);

	// 공유 모달
	const [isShareModalOpen, setIsShareModalOpen] = useState(false);

	// 캡처 모달
	const [capturedImage, setCapturedImage] = useState<string | null>(null);
	const [isCaptureModalVisible, setIsCaptureModalVisible] = useState(false);
	const captureRef = useRef<HTMLDivElement>(null);

	// 튜토리얼 아이콘 ref
	const tutorialIconRef = useRef<HTMLButtonElement>(null);

	// 핸들러들
	const handleShare = () => {
		setIsShareModalOpen(true);
	};

	const handleCapture = async () => {
		if (captureRef.current) {
			try {
				setIsCaptureModalVisible(true);
				const canvas = await html2canvas(captureRef.current);
				const imageData = canvas.toDataURL("image/png");
				setCapturedImage(imageData);
			} catch (error) {
				toast.error("캡처 실패!");
				setIsCaptureModalVisible(false);
			}
		}
	};

	const handleHome = () => {
		navigate("/");
		toast.info("홈으로 이동!");
	};

	const handleTutorial = () => {
		toast.info("튜토리얼 아이콘 클릭!");
	};

	const handleChat = () => {
		toast.info("채팅방 아이콘 클릭!");
	};

	const handleProfile = () => {
		toast.info("프로필 아이콘 클릭!");
	};

	const handleMyChocolateBox = () => {
		toast.info("내 초콜릿 박스 아이콘 클릭!");
	};

	return (
		<div className="flex justify-center w-full bg-white">
			{/*
        메인 컨테이너:
        h-[calc(var(--vh)*100)]와 min-h-screen 병행
        + 그라디언트 배경
      */}
			<div className="w-full max-w-sm min-h-screen h-[calc(var(--vh)*100)] flex flex-col bg-gradient-to-b from-[#E6EEFF] to-[#FFEEF2] relative">
				{/** 상단 아이콘 바 (slide-in-bottom 애니메이션) */}
				<div className="mt-4 px-4 flex items-center justify-between slide-in-bottom">
					<button onClick={handleHome}>
						<FaHome className="w-6 h-6" />
					</button>
					<div className="flex items-center gap-4">
						{/* 튜토리얼 아이콘 (ref 연결) */}
						<button onClick={handleTutorial} ref={tutorialIconRef}>
							<FaRegCircleQuestion className="w-6 h-6" />
						</button>
						<button onClick={handleChat}>
							<FaComments className="w-6 h-6" />
						</button>
						<button onClick={handleProfile}>
							<FaUserCircle className="w-6 h-6" />
						</button>
					</div>
				</div>

				{/** 초콜릿 개봉/받은 정보 카드 (jello-vertical) */}
				<div className="mt-6 mx-auto bg-[#6282FF1A] rounded-md w-[258px] jello-vertical">
					<div className="flex flex-col items-center gap-2.5 p-5">
						<div className="text-lg font-semibold text-center">
							개봉 가능한 🍫 : {availableGifts}개
						</div>
						<div className="text-sm text-[#454451]">
							지금까지 받은 🍫 : {receivedGifts}개
						</div>
					</div>
				</div>

				{/** 초콜릿 박스 & 안내 문구 */}
				<div className="mt-8 flex flex-col items-center px-4">
					{/** 캡처 영역 (heartbeat 애니메이션) */}
					<div ref={captureRef} className="heartbeat">
						<button
							onClick={handleMyChocolateBox}
							className="w-[255px] rounded-md flex items-center justify-center"
						>
							<img
								src={my_gift_box}
								alt="내 선물함"
								className="p-2 rounded-full max-h-60"
							/>
						</button>
					</div>

					{/** 안내 문구 (shake-horizontal) */}
					<div className="flex items-start gap-1.5 mt-4 w-[225px] shake-horizontal">
						<FaRegCircleQuestion className="w-3 h-3" />
						<p className="text-xs text-[#222226] leading-snug">
							개봉 가능한 일반 초콜릿이 있다면
							<br />
							박스를 클릭하여 편지를 읽어볼 수 있어요.
						</p>
					</div>
				</div>

				{/*
          공유 안내 문구를
          "공유하기" 버튼 위에만 나타나도록 수정
          (위아래로 움직이는 애니메이션: shake-vertical)
        */}
				<div className="mt-auto mb-6 px-4 flex flex-col items-center gap-2.5">
					<div className="bg-white rounded-md p-2.5 text-sm shake-vertical">
						친구에게 공유해 초콜릿을 요청해보세요!
					</div>

					{/** 하단 액션 버튼들 */}
					<div className="flex w-full gap-2.5">
						{/* 공유하기 버튼 */}
						<button
							onClick={handleShare}
							className="flex-1 h-14 bg-[#6282FF] hover:bg-[#5272EF] text-white flex items-center justify-center rounded-md"
						>
							<FiShare className="w-[18px] h-[18px] mr-2" />
							공유하기
						</button>

						{/* 캡처 버튼 */}
						<button
							onClick={handleCapture}
							className="w-[81px] h-14 flex items-center justify-center bg-white border border-gray-300 rounded-md"
						>
							<FiCamera className="w-6 h-6" />
						</button>
					</div>
				</div>

				{/** 모달 & 튜토리얼 오버레이 */}
				<CaptureModal
					isVisible={isCaptureModalVisible}
					imageSrc={capturedImage}
					onClose={() => setIsCaptureModalVisible(false)}
				/>
				<ShareModal
					isOpen={isShareModalOpen}
					onClose={() => setIsShareModalOpen(false)}
				/>
				{isFirstLogin && (
					<FirstLoginTutorialOverlay
						targetRef={tutorialIconRef}
						onClose={() => setIsFirstLogin(false)}
					/>
				)}
			</div>
		</div>
	);
};

export default MainMyBeforeView;
