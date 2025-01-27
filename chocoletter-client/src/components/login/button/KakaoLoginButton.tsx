import React from "react";
import { ImageButton } from "../../common/ImageButton";
import kakao_login_button from "../../../assets/images/button/kakao_login_button.svg";

const KakaoLoginButton: React.FC = () => {
  const kakaoAuthUrl = `${import.meta.env.VITE_API_SERVER_URL}/api/v1/auth/kakao`;

  return (
    <a href={kakaoAuthUrl} className="inline-block">
      <ImageButton
        backgroundImage={kakao_login_button}
        className="w-80 h-12 heartbeat" // 애니메이션 클래스 추가
      />
    </a>
  );
};

export default KakaoLoginButton;
