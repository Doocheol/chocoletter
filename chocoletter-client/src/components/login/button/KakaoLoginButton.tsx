import React, { useState } from "react";
import { ImageButton } from "../../common/ImageButton";
import kakao_login_button_2 from "../../../assets/images/button/kakao_login_button_2.svg";
import Loading from "../../common/Loading";
import { useNavigate } from "react-router-dom";
import { getUserInfo } from "../../../services/userInfo";
import { useRecoilValue } from "recoil";
import { giftBoxIdAtom } from "../../../atoms/auth/userAtoms";

const KakaoLoginButton: React.FC = () => {
  const navigate = useNavigate();
  // 로컬 스토리지의 유저 정보(로그인 여부) 확인
  const userInfo = getUserInfo();
  // Recoil의 giftBoxIdAtom 값 (로그인 후 서버 콜백 시 저장되었다고 가정)
  const giftBoxId = useRecoilValue(giftBoxIdAtom);

  // 로딩 표시
  const [isLoading, setIsLoading] = useState(false);

  const kakaoAuthUrl = `${import.meta.env.VITE_API_SERVER_URL}/api/v1/auth/kakao`;

  const handleClick = () => {
    // 이미 로그인 정보가 있다면 (한 번이라도 로그인됨)
    if (userInfo?.accessToken) {
      // giftBoxId가 있다면 /main/my/before/:giftBoxId 로 이동
      // 없다면 기본 /main/my/before 로 이동
      if (giftBoxId) {
        navigate(`/main/my/before/${giftBoxId}`);
      } else {
        navigate("/main/my/before");
      }
    } else {
      // 처음 로그인 -> 백엔드로 리다이렉트
      setIsLoading(true);
      window.location.replace(kakaoAuthUrl);
    }
  };

  return (
    <div>
      <a
        onClick={(e) => {
          e.preventDefault();
          handleClick();
        }}
        className="inline-block cursor-pointer"
      >
        <ImageButton src={kakao_login_button_2} className="opacity-80" />
      </a>

      {/* 로딩 중이면 Loading 컴포넌트 표시 (선택 사항) */}
      {isLoading && <Loading />}
    </div>
  );
};

export default KakaoLoginButton;
