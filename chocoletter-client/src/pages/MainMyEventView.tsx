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
import giftbox_event_1 from "../assets/images/giftbox/giftbox_event_1.svg";
import Backdrop from "../components/common/Backdrop";
import tutorial_icon from "../assets/images/main/tutorial_icon.svg";
import chat_icon from "../assets/images/main/chat_icon.svg";
import open_text from "../assets/images/main/open_text.svg";
import bell_icon from "../assets/images/main/bell_icon.svg";
import calendar_icon from "../assets/images/main/calendar_icon.svg";

import { getGiftList } from "../services/giftApi";
import CalendarModal from "../components/main/my/before/modal/CalendarModal";
import { countMyGiftBox, getGiftBoxName } from "../services/giftBoxApi";
import { getAlarmCount } from "../services/alarmApi";

const MainMyEventView: React.FC = () => {
	const navigate = useNavigate();

	// (1) 주소창 높이 보정 훅
	useViewportHeight();

	const { giftBoxId: urlGiftBoxId } = useParams<{ giftBoxId?: string }>();
	const savedGiftBoxId = useRecoilValue(giftBoxIdAtom);

	// Recoil 상태
	const [isFirstLogin, setIsFirstLogin] = useRecoilState(isFirstLoginAtom);

	const availableGifts = useRecoilValue(availableGiftsAtom);
	const receivedGifts = useRecoilValue(receivedGiftsAtom);

	// Recoil 상태 업데이트를 위한 setter
	const setAvailableGifts = useSetRecoilState(availableGiftsAtom);
	const setReceivedGifts = useSetRecoilState(receivedGiftsAtom);

	// 로딩 상태들 (API 호출 또는 모달 전환 중)
	const [isGiftCountLoading, setIsGiftCountLoading] =
		useState<boolean>(false);
	const [isAlarmCountLoading, setIsAlarmCountLoading] =
		useState<boolean>(false);
	const [isGiftShapeLoading, setIsGiftShapeLoading] =
		useState<boolean>(false);
	const [shapeNum, setShapeNum] = useState("12");

	const [isTutorialModalOpen, setIsTutorialModalOpen] = useState(false); // 새로운 상태 추가

	// 튜토리얼 아이콘 ref
	const tutorialIconRef = useRef<HTMLButtonElement>(null);

	// 프로필 드롭다운 열림 여부
	const [isProfileOpen, setIsProfileOpen] = useState(false);

	const [isChatModalOpen, setIsChatModalOpen] = useState(false); // 새로운 상태 추가

	// (추가됨) 캘린더 모달
	const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);

	// 알림 개수 상태
	const [alarmCount, setAlarmCount] = useState<number>(0);

	// 핸들러들

	// 알림 아이콘 클릭 시 알림 모달을 여는 핸들러 (여기서는 모달 오픈 동작만 처리)
	const [isNotificationOpen, setIsNotificationOpen] = useState(false);

	const handleNotification = () => {
		setAlarmCount(0);
		setIsNotificationOpen(true);
	};

	const handleTutorial = () => {
		setIsTutorialModalOpen(true); // 튜토리얼 모달 열기
		// toast.info("튜토리얼 아이콘 클릭!");
	};

	// (추가됨) 캘린더 모달 열기
	const handleCalendar = () => {
		setIsCalendarModalOpen(true);
	};

	const handleChat = () => {
		navigate("/chat/list");
	};

	// 프로필 드롭다운 토글
	const handleProfile = () => {
		setIsProfileOpen((prev) => !prev);
	};

	const handleMyChocolateBox = () => {
		navigate("/gift-list/event");
	};

	useEffect(() => {
		if (urlGiftBoxId && savedGiftBoxId) {
			if (urlGiftBoxId !== savedGiftBoxId) {
				console.warn(
					"URL의 shareCode와 저장된 shareCode가 일치하지 않습니다."
				);
				navigate("/error");
			}
		} else if (!urlGiftBoxId && savedGiftBoxId) {
			navigate(`/main/${savedGiftBoxId}`);
		} else if (urlGiftBoxId && !savedGiftBoxId) {
			console.warn(
				"URL에 shareCode는 있으나 저장된 shareCode가 없습니다."
			);
			navigate("/error");
		} else {
			console.warn("shareCode 정보가 없습니다.");
			navigate("/");
		}
	}, [urlGiftBoxId, savedGiftBoxId, navigate]);

	// 선물상자 이미지 API 호출
	useEffect(() => {
		async function fetchGiftShape() {
			setIsGiftShapeLoading(true);
			try {
				if (urlGiftBoxId) {
					const { name, type, fillLevel } = await getGiftBoxName(
						urlGiftBoxId
					);
					setShapeNum(String(type) + String(fillLevel));
				} else {
					throw new Error("Gift Box ID is undefined");
				}
			} catch (err) {
				console.error("Gift Box name API 실패:", err);
			} finally {
				setIsGiftShapeLoading(false);
			}
		}
		fetchGiftShape();
	}, [urlGiftBoxId, setIsGiftShapeLoading]);

	// 선물 개수 API 호출 (로딩 포함)
	useEffect(() => {
		async function fetchGiftCount() {
			setIsGiftCountLoading(true);
			try {
				const { giftCount, canOpenGiftCount } = await countMyGiftBox();
				setAvailableGifts(canOpenGiftCount);
				setReceivedGifts(giftCount);
			} catch (err) {
				console.error("Gift Box count API 실패:", err);
			} finally {
				setIsGiftCountLoading(false);
			}
		}
		fetchGiftCount();
	}, [setAvailableGifts, setReceivedGifts]);

	// 알림 개수 API 호출 (로딩 포함)
	useEffect(() => {
		async function fetchAlarmCount() {
			setIsAlarmCountLoading(true);
			try {
				const count = await getAlarmCount();
				setAlarmCount(count);
			} catch (err) {
				console.error("알림 개수 불러오기 실패:", err);
			} finally {
				setIsAlarmCountLoading(false);
			}
		}
		if (!isNotificationOpen) {
			fetchAlarmCount();
		}
	}, [isNotificationOpen]);

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

				{/** 초콜릿 박스 & 안내 문구 */}
				<div className="mt-36 flex flex-col items-center px-4">
					{/** 캡처 영역 (heartbeat 애니메이션) */}
					<div className="heartbeat">
						<button
							onClick={handleMyChocolateBox}
							className="w-[255px] pl-8 flex items-center justify-center"
						>
							<img
								src={giftbox_event_1}
								alt="giftbox_before_2"
								className="p-2 max-h-60"
							/>
						</button>
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
				<div className="mt-2 flex flex-row justify-center items-center gap-2.5">
					<img src={open_text} alt="open_text" className="" />
				</div>

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

export default MainMyEventView;
