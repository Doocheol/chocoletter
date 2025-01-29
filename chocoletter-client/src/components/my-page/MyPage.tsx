import React, { useEffect, useRef } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { isLoginAtom, userNameAtom, userProfileUrlAtom } from "../../atoms/auth/userAtoms";
import { receivedGiftsAtom, sentGiftsAtom } from "../../atoms/gift/giftAtoms";

import { FaUserCircle, FaHome } from "react-icons/fa"; // 사용자 아이콘 및 홈 아이콘
import { FiLogOut } from "react-icons/fi"; // 로그아웃 아이콘
import home_icon from "../../assets/images/main/home_icon.svg"; // 홈 아이콘

/**
 * 프로필 드롭다운 내용
 */
interface MyPageProps {
  onClose: () => void;
}

const MyPage: React.FC<MyPageProps> = ({ onClose }) => {
  const [isLogin, setIsLogin] = useRecoilState(isLoginAtom);
  const userName = useRecoilValue(userNameAtom);
  const userProfileUrl = useRecoilValue(userProfileUrlAtom);

  // 보낸/받은 초콜릿
  const sentGifts = useRecoilValue(sentGiftsAtom);
  const receivedGifts = useRecoilValue(receivedGiftsAtom);

  const navigate = useNavigate();

  const handleLogout = () => {
    setIsLogin(false);
    toast.info("로그아웃 되었습니다.");
    onClose(); // 로그아웃 후 닫기
  };

  const handleHome = () => {
    navigate("/");
    toast.info("홈으로 이동!");
    onClose(); // 홈으로 이동 후 MyPage 닫기
  };

  const dropdownRef = useRef<HTMLDivElement>(null);

  // 바깥 클릭 감지
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div
      ref={dropdownRef}
      className="fixed top-16 left-1/2 transform -translate-x-1/2 px-6 py-4 bg-white shadow-lg rounded-xl z-50 w-80 max-w-md"
    >
      <div className="relative flex flex-col gap-4">
        {/* 홈 버튼 */}
        <button
          onClick={handleHome}
          className="absolute top-2 right-2 text-chocoletterPurpleBold hover:text-chocoletterPurpleDark"
          aria-label="홈"
        >
          <img src={home_icon} className="w-6 h-6" />
        </button>

        {/* 프로필 영역 */}
        <div className="flex items-center mt-2 mb-2 ml-1">
          {userProfileUrl ? (
            <img
              src={userProfileUrl}
              alt="프로필 사진"
              className="w-10 h-10 rounded-full object-cover mr-3"
            />
          ) : (
            <FaUserCircle className="w-6 h-6 text-gray-400 mr-3" />
          )}
          <div>
            <div className="text-xl font-bold text-gray-800">{userName || "초코레터"}</div>
          </div>
        </div>

        {/* 통계: 보낸 왼쪽, 받은 오른쪽 */}
        <div className="bg-gray-100 text-center text-md text-black font-light rounded-full pt-1 mb-2">
          <div className="flex justify-center items-center text-md gap-14 mb-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-thin text-black">보낸 개수</span>
              <span className="font-bold text-chocoletterPurpleBold">{sentGifts}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-thin text-black">받은 개수</span>
              <span className="font-bold text-chocoletterPurpleBold">{receivedGifts}</span>
            </div>
          </div>
        </div>

        {/* 로그아웃 버튼 */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center py-2 bg-chocoletterPurpleBold hover:bg-chocoletterPurple text-white rounded-xl border border-black"
          aria-label="로그아웃"
        >
          <FiLogOut className="w-5 h-5 mr-2" />
          초코레터 떠나기
        </button>
      </div>
    </div>
  );
};

export default MyPage;
