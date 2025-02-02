import React, { useEffect, useRef, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { useNavigate, useParams } from "react-router-dom";
import html2canvas from "html2canvas";

import { availableGiftsAtom, receivedGiftsAtom } from "../atoms/gift/giftAtoms";
import { isFirstLoginAtom, giftBoxNumAtom, giftBoxIdAtom } from "../atoms/auth/userAtoms";

import { FaUserCircle } from "react-icons/fa";
import { AiOutlineExclamationCircle } from "react-icons/ai";

import ShareModal from "../components/main/my/before/modal/ShareModal";
import CaptureModal from "../components/main/my/before/modal/CaptureModal";
import FirstLoginTutorialOverlay from "../components/tutorial/FirstLoginTutorialOverlay";
import ChatModal from "../components/main/my/before/modal/ChatModal";
import TutorialModal from "../components/main/my/before/modal/TutorialModal";

import MyPage from "../components/my-page/MyPage";
import useViewportHeight from "../hooks/useViewportHeight";

// 선물상자 이미지 자산 임포트 (giftBoxNum에 따라 표시할 이미지)
import giftbox_before_1 from "../assets/images/giftbox/giftbox_before_1.svg";
import giftbox_before_2 from "../assets/images/giftbox/giftbox_before_2.svg";
import giftbox_before_3 from "../assets/images/giftbox/giftbox_before_3.svg";
import giftbox_before_4 from "../assets/images/giftbox/giftbox_before_4.svg";
import giftbox_before_5 from "../assets/images/giftbox/giftbox_before_5.svg";

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

  // URL 파라미터에서 shareCode 읽기 (예: /main/my/before/abc123)
  const { giftBoxId: urlGiftBoxId } = useParams<{ giftBoxId?: string }>();
  // Recoil에 저장된 shareCode
  const savedGiftBoxId = useRecoilValue(giftBoxIdAtom);
  // Recoil에 저장된 giftBoxNum (선물상자 번호)
  const giftBoxNum = useRecoilValue(giftBoxNumAtom);

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

  const [isTutorialModalOpen, setIsTutorialModalOpen] = useState(false);
  const tutorialIconRef = useRef<HTMLButtonElement>(null);

  // 프로필 드롭다운 열림 여부
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);

  // giftBoxNum이 없으면 선물상자 선택 페이지로 리다이렉트
  useEffect(() => {
    if (!giftBoxNum) {
      navigate("/select-giftbox");
    }
  }, [giftBoxNum, navigate]);

  // URL 파라미터와 Recoil에 저장된 shareCode를 비교하는 로직
  useEffect(() => {
    if (urlGiftBoxId && savedGiftBoxId) {
      if (urlGiftBoxId !== savedGiftBoxId) {
        console.warn("URL의 shareCode와 저장된 shareCode가 일치하지 않습니다.");
        navigate("/error");
      }
    } else if (!urlGiftBoxId && savedGiftBoxId) {
      navigate(`/${savedGiftBoxId}`);
    } else if (urlGiftBoxId && !savedGiftBoxId) {
      console.warn("URL에 shareCode는 있으나 저장된 shareCode가 없습니다.");
      navigate("/error");
    } else {
      console.warn("shareCode 정보가 없습니다.");
      navigate("/");
    }
  }, [urlGiftBoxId, savedGiftBoxId, navigate]);

  // giftBoxNum에 따른 선물상자 이미지 매핑 (선택한 선물상자 번호에 따라 이미지 변경)
  const giftBoxImages: { [key: number]: string } = {
    1: giftbox_before_1,
    2: giftbox_before_2,
    3: giftbox_before_3,
    4: giftbox_before_4,
    5: giftbox_before_5,
  };

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
        setIsCaptureModalVisible(false);
      }
    }
  };

  const handleTutorial = () => {
    setIsTutorialModalOpen(true);
  };

  const handleCalendar = () => {
    setIsCalendarModalOpen(true);
  };

  const handleNotification = () => {
    navigate("/my-box");
  };

  const handleChat = () => {
    setIsChatModalOpen(true);
  };

  const handleProfile = () => {
    setIsProfileOpen((prev) => !prev);
  };

  const handleMyChocolateBox = () => {
    navigate("/gift-list/before");
  };

  useEffect(() => {
    async function fetchGiftCount() {
      try {
        const { giftCount, canOpenGiftCount } = await countMyGiftBox();
        setAvailableGifts(canOpenGiftCount);
        setReceivedGifts(giftCount);
      } catch (err) {
        console.error("Gift Box count API 실패:", err);
      }
    }
    fetchGiftCount();
  }, [setAvailableGifts, setReceivedGifts]);

  return (
    <div className="flex justify-center w-full bg-white">
      <div className="w-full max-w-sm min-h-screen h-[calc(var(--vh)*100)] flex flex-col bg-gradient-to-b from-[#E6F5FF] to-[#F4D3FF]">
        {/* 상단 아이콘 바 */}
        <div className="mt-6 ml-6 flex items-center justify-between ">
          <div className="flex items-center gap-6">
            <button onClick={handleTutorial} ref={tutorialIconRef}>
              <img src={tutorial_icon} className="w-6 h-6" alt="tutorial icon" />
            </button>
            <button onClick={handleCalendar}>
              <img src={calendar_icon} className="w-7 h-7" alt="calendar icon" />
            </button>
          </div>

          <div className="flex items-center gap-6 mr-6">
            <div className="flex flex-col items-center">
              <button onClick={handleNotification}>
                <img src={bell_icon} className="w-7 h-7" alt="notification icon" />
              </button>
            </div>

            <button onClick={handleChat}>
              <img src={chat_icon} className="w-6 h-6" alt="chat icon" />
            </button>
            <button onClick={handleProfile}>
              <FaUserCircle className="w-6 h-6 text-chocoletterPurpleBold hover:text-chocoletterPurple" />
            </button>
          </div>
        </div>

        {/* 초콜릿 개봉/받은 정보 카드 */}
        <div className="mt-6 mx-auto relative">
          <img
            src={my_count_background}
            alt="Background"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="flex flex-col items-center gap-2.5 px-9 py-4 relative">
            <div className="flex flex-row">
              <div className="text-2xl font-normal text-center">개봉 가능한&nbsp;</div>
              <img src={choco_asset} className="w-7 h-7" alt="choco asset" />
              <div className="text-2xl font-normal text-center">&nbsp;:&nbsp;</div>
              <div className="text-2xl font-normal text-center text-chocoletterPurpleBold">
                {availableGifts}
              </div>
              <div className="text-2xl font-normal text-center">개</div>
            </div>
            <div className="flex flex-row">
              <div className="text-sm text-gray-500 text-center">지금까지 받은&nbsp;</div>
              <img src={choco_asset} className="h-4 w-4" alt="choco asset" />
              <div className="text-sm text-gray-500 text-center">&nbsp;:&nbsp;</div>
              <div className="text-sm text-center text-chocoletterPurple">{receivedGifts}</div>
              <div className="text-sm text-gray-500 text-center">개</div>
            </div>
          </div>
        </div>

        {/* 초콜릿 박스 & 안내 문구 */}
        <div className="mt-8 flex flex-col items-center px-4">
          {/* 캡처 영역 */}
          <div ref={captureRef} className="heartbeat">
            <button
              onClick={handleMyChocolateBox}
              className="w-[255px] pl-8 flex items-center justify-center"
            >
              {/*
                giftBoxNum에 따른 이미지를 보여줍니다.
                giftBoxNum이 Recoil에 없으면 위 useEffect에서 이미 /select-giftbox로 이동합니다.
              */}
              <img
                src={giftBoxImages[giftBoxNum]}
                alt={`giftbox_before_${giftBoxNum}`}
                className="p-2 max-h-60"
              />
            </button>
          </div>

          {/* 안내 문구 */}
          <div className="flex items-start pl-4 gap-1.5 mt-1 mb-3 w-[225px]">
            <AiOutlineExclamationCircle className="w-3 h-3 text-gray-500" />
            <p className="text-xs text-gray-500 leading-snug">
              개봉 가능한 일반 초콜릿이 있다면
              <br />
              박스를 클릭하여 편지를 읽어볼 수 있어요.
            </p>
          </div>
        </div>

        {/* 공유 및 캡처 버튼 영역 */}
        <div className="mt-14 px-4 flex flex-row items-center gap-2.5">
          <div className="relative group">
            <div className="absolute bottom-full mb-1 left-4 w-max">
              <img src={tool_tip} alt="tooltip" />
            </div>
            <ImageButton
              onClick={handleShare}
              src={share_button}
              className="flex h-14 w-[270px] items-center justify-center hover:bg-chocoletterPurple rounded-[15px] border border-black group"
            />
          </div>
          <ImageButton
            onClick={handleCapture}
            src={capture_button}
            className="w-[81px] h-14 flex items-center justify-center rounded-[15px] border border-black group"
          />
        </div>

        {/* 모달 & 튜토리얼 오버레이 */}
        <CaptureModal
          isVisible={isCaptureModalVisible}
          imageSrc={capturedImage}
          onClose={() => setIsCaptureModalVisible(false)}
        />
        <ShareModal isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} />
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

        <ChatModal isOpen={isChatModalOpen} onClose={() => setIsChatModalOpen(false)} />
        <TutorialModal isOpen={isTutorialModalOpen} onClose={() => setIsTutorialModalOpen(false)} />
        <CalendarModal isOpen={isCalendarModalOpen} onClose={() => setIsCalendarModalOpen(false)} />
      </div>
    </div>
  );
};

export default MainMyBeforeView;
