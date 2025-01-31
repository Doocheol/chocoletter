import React, { useEffect, useRef, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { useNavigate, useParams } from "react-router-dom";
import html2canvas from "html2canvas";

import { availableGiftsAtom, receivedGiftsAtom } from "../atoms/gift/giftAtoms";
import { giftBoxIdAtom, isFirstLoginAtom } from "../atoms/auth/userAtoms";

import { FaUserCircle } from "react-icons/fa";
import { AiOutlineExclamationCircle } from "react-icons/ai";

import ShareModal from "../components/main/my/before/modal/ShareModal";
import CaptureModal from "../components/main/my/before/modal/CaptureModal";
import FirstLoginTutorialOverlay from "../components/tutorial/FirstLoginTutorialOverlay";
import ChatModal from "../components/main/my/before/modal/ChatModal"; // ChatModal 임포트
import TutorialModal from "../components/main/my/before/modal/TutorialModal"; // TutorialModal 임포트

// === 프로필 드롭다운 내용
import MyPage from "../components/my-page/MyPage";

// === 뷰포트 높이 보정 훅 ===
import useViewportHeight from "../hooks/useViewportHeight";

// 이미지 리소스 예시
import giftbox_before_2 from "../assets/images/giftbox/giftbox_before_2.svg";
import Backdrop from "../components/common/Backdrop";
import share_button from "../assets/images/button/share_button.svg";
import { ImageButton } from "../components/common/ImageButton";
import capture_button from "../assets/images/button/capture_button.svg";
import tutorial_icon from "../assets/images/main/tutorial_icon.svg";
import chat_icon from "../assets/images/main/chat_icon.svg";
import choco_asset from "../assets/images/main/choco_asset.svg";
import tool_tip from "../assets/images/main/tool_tip.svg";
import my_count_background from "../assets/images/main/my_count_background.svg";
import bell_icon from "../assets/images/main/bell_icon.svg";
import calendar_icon from "../assets/images/main/calendar_icon.svg";

import CalendarModal from "../components/main/my/before/modal/CalendarModal";
import { countMyGiftBox } from "../services/giftBoxApi";

const MainMyBeforeView: React.FC = () => {
	const navigate = useNavigate();

	// (1) URL 파라미터 (ex: /main/my/before/123 -> giftBoxId = "123")
	const { giftBoxId } = useParams<{ giftBoxId?: string }>();

	// (2) 만약 giftBoxIdAtom을 쓴다면 Recoil에서 읽기
	const savedGiftBoxId = useRecoilValue(giftBoxIdAtom);

	// (1) 주소창 높이 보정 훅
	useViewportHeight();

	// Recoil 상태
	const availableGifts = useRecoilValue(availableGiftsAtom);
	const receivedGifts = useRecoilValue(receivedGiftsAtom);
	const [isFirstLogin, setIsFirstLogin] = useRecoilState(isFirstLoginAtom);

	// Recoil 상태 업데이트를 위한 setter
	const setAvailableGifts = useSetRecoilState(availableGiftsAtom);
	const setReceivedGifts = useSetRecoilState(receivedGiftsAtom);

	// 공유 모달
	const [isShareModalOpen, setIsShareModalOpen] = useState(false);

	// 캡처 모달
	const [capturedImage, setCapturedImage] = useState<string | null>(null);
	const [isCaptureModalVisible, setIsCaptureModalVisible] = useState(false);
	const captureRef = useRef<HTMLDivElement>(null);

	const [isTutorialModalOpen, setIsTutorialModalOpen] = useState(false); // 새로운 상태 추가

	// 튜토리얼 아이콘 ref
	const tutorialIconRef = useRef<HTMLButtonElement>(null);

	// 프로필 드롭다운 열림 여부
	const [isProfileOpen, setIsProfileOpen] = useState(false);

	const [isChatModalOpen, setIsChatModalOpen] = useState(false); // 새로운 상태 추가

	// (추가됨) 캘린더 모달
	const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);

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
				// toast.error("캡처 실패!");
				setIsCaptureModalVisible(false);
			}
		}
	};

	// const handleHome = () => {
	//   navigate("/");
	//   toast.info("홈으로 이동!");
	// };

	const handleTutorial = () => {
		setIsTutorialModalOpen(true); // 튜토리얼 모달 열기
		// toast.info("튜토리얼 아이콘 클릭!");
	};

	// (추가됨) 캘린더 모달 열기
	const handleCalendar = () => {
		setIsCalendarModalOpen(true);
	};

	const handleNotification = () => {
		navigate("/my-box");
	};

	const handleChat = () => {
		setIsChatModalOpen(true); // 채팅 모달 열기
		// toast.info("채팅방 아이콘 클릭!");
	};

	// 프로필 드롭다운 토글
	const handleProfile = () => {
		setIsProfileOpen((prev) => !prev);
	};

	const handleMyChocolateBox = () => {
		navigate("/gift-list/before");

		// toast.info("내 초콜릿 박스 아이콘 클릭!");
	};

	// 실제 giftBoxId(number)로 변환
	let finalGiftBoxId: number | null = null;
	if (giftBoxId) {
		const parsed = parseInt(giftBoxId, 10);
		if (!isNaN(parsed)) {
			finalGiftBoxId = parsed;
		}
	}

	// 만약 Recoil 저장분도 고려한다면, 아래 로직 이용:
	if (!finalGiftBoxId && savedGiftBoxId) {
		finalGiftBoxId = savedGiftBoxId;
	}

	// 예: mount 시점에 gift 개수 호출
	useEffect(() => {
		if (finalGiftBoxId === null) {
			console.log(
				"giftBoxId가 없거나 잘못된 형식이므로, 기본 박스 로직 or 안내"
			);
			// 여기서 navigate("/error")하거나,
			// 혹은 그냥 '내 박스'로 동작시킬 수 있음
		} else {
			console.log("최종 giftBoxId:", finalGiftBoxId);
			// 이 박스에 대한 로직 (getGiftBoxDetail(finalGiftBoxId) 등)
		}

		async function fetchGiftCount() {
			try {
				const { giftCount, canOpenGiftCount } = await countMyGiftBox();
				// canOpenGiftCount -> available
				setAvailableGifts(canOpenGiftCount);
				// giftCount -> received
				setReceivedGifts(giftCount);
			} catch (err) {
				console.error("Gift Box count API 실패:", err);
			}
		}

		fetchGiftCount();
	}, [finalGiftBoxId, setAvailableGifts, setReceivedGifts]);

	return (
		<div className="flex justify-center w-full bg-white">
			{/*
        메인 컨테이너:
        h-[calc(var(--vh)*100)]와 min-h-screen 병행
        + 그라디언트 배경
      */}
			<div className="w-full max-w-sm min-h-screen h-[calc(var(--vh)*100)] flex flex-col bg-gradient-to-b from-[#E6F5FF] to-[#F4D3FF]">
				{/** 상단 아이콘 바 (slide-in-bottom 애니메이션) */}
				<div className="mt-6 ml-6 flex items-center justify-between ">
					<div className="flex items-center gap-6">
						<button onClick={handleTutorial} ref={tutorialIconRef}>
							<img src={tutorial_icon} className="w-6 h-6" />
						</button>
						<button onClick={handleCalendar}>
							<img src={calendar_icon} className="w-7 h-7" />
						</button>
					</div>

					<div className="flex items-center gap-6 mr-6">
						<div className="flex flex-col items-center">
							<button onClick={handleNotification}>
								<img src={bell_icon} className="w-7 h-7" />
							</button>
						</div>

						<button onClick={handleChat}>
							<img src={chat_icon} className="w-6 h-6" />
						</button>
						<button onClick={handleProfile}>
							<FaUserCircle className="w-6 h-6 text-chocoletterPurpleBold hover:text-chocoletterPurple" />
						</button>
					</div>
				</div>

				{/** 초콜릿 개봉/받은 정보 카드 (jello-vertical) */}
				<div className="mt-6 mx-auto relative">
					{/* 배경 이미지 */}
					<img
						src={my_count_background}
						alt="Background"
						className="absolute inset-0 w-full h-full object-cover"
					/>{" "}
					<div className="flex flex-col items-center gap-2.5 px-9 py-4 relative">
						<div className="flex flew-row">
							<div className="text-2xl font-normal text-center">
								개봉 가능한&nbsp;
							</div>
							<img src={choco_asset} className="w-7 h-7" />
							<div className="text-2xl font-normal text-center">
								&nbsp;:&nbsp;
							</div>
							<div className="text-2xl font-normal text-center text-chocoletterPurpleBold">
								{availableGifts}
							</div>
							<div className="text-2xl font-normal text-center">
								개
							</div>
						</div>
						<div className="flex flew-row">
							<div className="text-sm text-gray-500 text-center">
								지금까지 받은&nbsp;
							</div>
							<img src={choco_asset} className="h-4 w-4" />
							<div className="text-sm text-gray-500 text-center">
								&nbsp;:&nbsp;
							</div>
							<div className="text-sm text-center text-chocoletterPurple">
								{receivedGifts}
							</div>
							<div className="text-sm text-gray-500 text-center">
								개
							</div>
						</div>
					</div>
				</div>

				{/** 초콜릿 박스 & 안내 문구 */}
				<div className="mt-8 flex flex-col items-center px-4">
					{/** 캡처 영역 (heartbeat 애니메이션) */}
					<div ref={captureRef} className="heartbeat">
						<button
							onClick={handleMyChocolateBox}
							className="w-[255px] pl-8 flex items-center justify-center"
						>
							<img
								src={giftbox_before_2}
								alt="giftbox_before_2"
								className="p-2 max-h-60"
							/>
						</button>
					</div>

					{/** 안내 문구 (shake-horizontal) */}
					<div className="flex items-start pl-4 gap-1.5 mt-1 mb-3 w-[225px]">
						<AiOutlineExclamationCircle className="w-3 h-3 text-gray-500" />
						<p className="text-xs text-gray-500 leading-snug">
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
				{/*
          공유 안내 문구를
          "공유하기" 버튼 위에만 나타나도록 수정
          (위아래로 움직이는 애니메이션: shake-vertical)
        */}
				<div className="mt-14 px-4 flex flex-row items-center gap-2.5">
					{/* 공유하기 버튼을 감싸는 relative div */}
					<div className="relative group">
						{/* 툴팁 */}
						<div className="absolute bottom-full mb-1 left-4 w-max">
							<img src={tool_tip} />
						</div>

						{/* 공유하기 버튼 */}
						<ImageButton
							onClick={handleShare}
							src={share_button}
							className="flex h-14 w-[270px] items-center justify-center hover:bg-chocoletterPurple rounded-[15px] border border-black group"
						/>

						{/* <button
              onClick={handleShare}
              className="flex h-14 w-[270px] items-center justify-center gap-2 bg-chocoletterPurpleBold hover:bg-chocoletterPurple rounded-[15px] border border-black group"
              aria-label="공유하기"
            >
              <FiShare className="w-6 h-6 text-white" />
              <span className="font-display-1 text-white text-xl">공유하기</span>
            </button> */}
					</div>

					{/* 캡처 버튼 */}
					<ImageButton
						onClick={handleCapture}
						src={capture_button}
						className="w-[81px] h-14 flex items-center justify-center rounded-[15px] border border-black group"
					/>
					{/* <button
            onClick={handleCapture}
            className="w-[81px] h-14 flex items-center justify-center bg-white hover:bg-chocoletterPurple rounded-[15px] border border-black group"
            aria-label="캡처"
          >
            <FiCamera className="w-6 h-6 text-black text-opacity-80" />
          </button> */}
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

				{isProfileOpen && (
					<>
						<Backdrop onClick={() => setIsProfileOpen(false)} />
						<MyPage onClose={() => setIsProfileOpen(false)} />
					</>
				)}

				{/* 채팅 모달 */}
				<ChatModal
					isOpen={isChatModalOpen}
					onClose={() => setIsChatModalOpen(false)}
				/>

				{/* 튜토리얼 모달 */}
				<TutorialModal
					isOpen={isTutorialModalOpen}
					onClose={() => setIsTutorialModalOpen(false)}
				/>

				{/* 새로 추가된 CalendarModal */}
				<CalendarModal
					isOpen={isCalendarModalOpen}
					onClose={() => setIsCalendarModalOpen(false)}
				/>
			</div>
		</div>
	);
};

export default MainMyBeforeView;
