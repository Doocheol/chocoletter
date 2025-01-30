import React, { useEffect, useRef, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";

import { availableGiftsAtom, receivedGiftsAtom } from "../atoms/gift/giftAtoms";
import { isFirstLoginAtom } from "../atoms/auth/userAtoms";

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

const MainMyEventView: React.FC = () => {
  const navigate = useNavigate();

  // (1) 주소창 높이 보정 훅
  useViewportHeight();

  // Recoil 상태
  const [isFirstLogin, setIsFirstLogin] = useRecoilState(isFirstLoginAtom);

  // Recoil 상태 업데이트를 위한 setter
  const setAvailableGifts = useSetRecoilState(availableGiftsAtom);
  const setReceivedGifts = useSetRecoilState(receivedGiftsAtom);

  const [isTutorialModalOpen, setIsTutorialModalOpen] = useState(false); // 새로운 상태 추가

  // 튜토리얼 아이콘 ref
  const tutorialIconRef = useRef<HTMLButtonElement>(null);

  // 프로필 드롭다운 열림 여부
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const [isChatModalOpen, setIsChatModalOpen] = useState(false); // 새로운 상태 추가

  // (추가됨) 캘린더 모달
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);

  // 핸들러들

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
    navigate("/gift/list/event");
  };

  // 데이터 fetching 및 Recoil 상태 업데이트
  useEffect(() => {
    const fetchGifts = async () => {
      try {
        // 'available'과 'received' 타입의 선물 리스트를 가져옵니다.
        const [availableData, receivedData] = await Promise.all([
          getGiftList("available"),
          getGiftList("received"),
        ]);

        // 데이터가 성공적으로 반환되었는지 확인
        if (availableData && availableData.gifts) {
          setAvailableGifts(availableData.gifts.length);
        } else {
          setAvailableGifts(0);
        }

        if (receivedData && receivedData.gifts) {
          setReceivedGifts(receivedData.gifts.length);
        } else {
          setReceivedGifts(0);
        }
      } catch (error) {
        console.error("Gift 데이터를 불러오는 중 오류 발생:", error);
        // 필요시 에러 핸들링 추가 (예: 사용자에게 알림)
      }
    };

    fetchGifts();
  }, [setAvailableGifts, setReceivedGifts]);

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
              <img src={giftbox_event_1} alt="giftbox_before_2" className="p-2 max-h-60" />
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
        <ChatModal isOpen={isChatModalOpen} onClose={() => setIsChatModalOpen(false)} />

        {/* 튜토리얼 모달 */}
        <TutorialModal isOpen={isTutorialModalOpen} onClose={() => setIsTutorialModalOpen(false)} />

        {/* 새로 추가된 CalendarModal */}
        <CalendarModal isOpen={isCalendarModalOpen} onClose={() => setIsCalendarModalOpen(false)} />
      </div>
    </div>
  );
};

export default MainMyEventView;
