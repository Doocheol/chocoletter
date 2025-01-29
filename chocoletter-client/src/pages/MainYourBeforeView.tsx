import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { isLoginAtom } from "../atoms/auth/userAtoms";

import { FaUserCircle } from "react-icons/fa";

import Backdrop from "../components/common/Backdrop";
import MyPage from "../components/my-page/MyPage";
import { ImageButton } from "../components/common/ImageButton";

import giftbox_before_2 from "../assets/images/giftbox/giftbox_before_2.svg";
import gift_send_button from "../assets/images/button/gift_send_button.svg";
import my_count_background from "../assets/images/main/my_count_background.svg";
import NotLoginModal from "../components/main/your/before/modal/NotLoginModal";

const MainYourBeforeView: React.FC = () => {
  const navigate = useNavigate();

  // 상대방 닉네임 (예시 데이터, 실제 데이터 연동 필요)
  const recipientNickname = "초코레터팀"; // 실제 값은 prop 또는 API를 통해 받아올 수 있음

  // 로그인 여부 확인 (Recoil 전역 상태 사용)
  const isLoggedIn = useRecoilValue(isLoginAtom);

  // 프로필 드롭다운 열림 여부
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // 로그인 필요 모달 상태
  const [isNotLoginModalOpen, setIsNotLoginModalOpen] = useState(false);

  // 프로필 드롭다운 토글
  const handleProfile = () => {
    if (!isLoggedIn) {
      setIsNotLoginModalOpen(true);
      return;
    }
    setIsProfileOpen((prev) => !prev);
  };

  // 초콜릿 보내기 버튼 클릭
  const handleSendGift = () => {
    if (!isLoggedIn) {
      setIsNotLoginModalOpen(true);
      return;
    }
    navigate("/selectletter");
  };

  // 로그인 페이지로 이동
  const handleGoToLogin = () => {
    navigate("/");
  };

  return (
    <div className="flex justify-center w-full">
      {/* 메인 컨테이너 */}
      <div className="w-full max-w-sm min-h-screen h-[calc(var(--vh)*100)] flex flex-col bg-gradient-to-b from-[#E6F5FF] to-[#F4D3FF]">
        {/* 상단 아이콘 바 */}
        <div className="mt-6 ml-6 flex items-center justify-end">
          <button onClick={handleProfile} className="mr-6">
            <FaUserCircle className="w-6 h-6 text-chocoletterPurpleBold hover:text-chocoletterPurple" />
          </button>
        </div>

        {/* 상대방의 선물상자 컨테이너 */}
        <div className="mt-10 mb-10 mx-auto relative">
          {/* 배경 이미지 */}
          <img
            src={my_count_background}
            alt="Background"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="flex flex-col items-center px-10 py-8 relative text-2xl">
            <div className="flex flex-row max-w-sm">
              <div className="mb-1">{recipientNickname}</div>의 선물상자
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center pl-10 mb-6">
          <img src={giftbox_before_2} alt="giftbox_before_2" className="p-2 max-h-60" />
        </div>

        {/* 선물하기 버튼 */}
        <div className="mt-10 px-4 flex flex-row items-center justify-center">
          <ImageButton
            onClick={handleSendGift}
            src={gift_send_button}
            className="flex items-center justify-center heartbeat"
          />
        </div>

        {/* 로그인 필요 모달 */}
        {isNotLoginModalOpen && (
          <NotLoginModal
            isOpen={isNotLoginModalOpen}
            onClose={() => setIsNotLoginModalOpen(false)}
            onLogin={handleGoToLogin}
          />
        )}

        {/* 프로필 모달 */}
        {isProfileOpen && (
          <>
            <Backdrop onClick={() => setIsProfileOpen(false)} />
            <MyPage onClose={() => setIsProfileOpen(false)} />
          </>
        )}
      </div>
    </div>
  );
};

export default MainYourBeforeView;
