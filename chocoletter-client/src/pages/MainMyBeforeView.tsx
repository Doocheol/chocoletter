import React, { useEffect, useRef, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
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

// === 공통 Dropdown
import Dropdown from "../components/common/Dropdown";
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
import choco_asset_1 from "../assets/images/main/choco_asset_1.svg";
import tool_tip from "../assets/images/main/tool_tip.svg";
import my_count_background from "../assets/images/main/my_count_background.svg";

import { getGiftList } from "../services/giftApi";

const MainMyBeforeView: React.FC = () => {
  const navigate = useNavigate();

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

  const handleChat = () => {
    setIsChatModalOpen(true); // 채팅 모달 열기
    // toast.info("채팅방 아이콘 클릭!");
  };

  // 프로필 드롭다운 토글
  const handleProfile = () => {
    setIsProfileOpen((prev) => !prev);
  };

  const handleMyChocolateBox = () => {
    navigate("/gift/list/before");

    // toast.info("내 초콜릿 박스 아이콘 클릭!");
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
        <div className="mt-6 mr-6 flex items-center justify-end ">
          <div className="flex items-center gap-7">
            {/**
              튜토리얼 아이콘
              - ref={tutorialIconRef}는 button에 달고
              - 애니메이션은 자식 <span>에만 적용
            */}
            {/**
              튜토리얼 아이콘과 텍스트를 감싸는 div
              ref={tutorialContainerRef}를 부모 div에 할당
            */}
            <div className="flex flex-col items-center">
              <button onClick={handleTutorial} ref={tutorialIconRef}>
                <img src={tutorial_icon} className="w-6 h-6" />
              </button>
              {/* "튜토리얼" 텍스트는 오버레이 내에서만 표시되므로 여기서 제거 */}
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
              <div className="text-2xl font-normal text-center">개봉 가능한&nbsp;</div>
              <img src={choco_asset_1} className="w-7 h-7" />
              <div className="text-2xl font-normal text-center">&nbsp;:&nbsp;</div>
              <div className="text-2xl font-normal text-center text-chocoletterPurpleBold">
                {availableGifts}
              </div>
              <div className="text-2xl font-normal text-center">개</div>
            </div>
            <div className="flex flew-row">
              <div className="text-sm text-gray-500 text-center">지금까지 받은&nbsp;</div>
              <img src={choco_asset_1} className="h-4 w-4" />
              <div className="text-sm text-gray-500 text-center">&nbsp;:&nbsp;</div>
              <div className="text-sm text-center text-chocoletterPurple">{receivedGifts}</div>
              <div className="text-sm text-gray-500 text-center">개</div>
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
              <img src={giftbox_before_2} alt="giftbox_before_2" className="p-2 max-h-60" />
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

        {/* 채팅 모달 */}
        <ChatModal isOpen={isChatModalOpen} onClose={() => setIsChatModalOpen(false)} />

        {/* 튜토리얼 모달 */}
        <TutorialModal isOpen={isTutorialModalOpen} onClose={() => setIsTutorialModalOpen(false)} />
      </div>
    </div>
  );
};

export default MainMyBeforeView;
