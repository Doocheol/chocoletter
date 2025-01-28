import React from "react";
import { ImageButton } from "../../common/ImageButton";
import kakao_login_button_2 from "../../../assets/images/button/kakao_login_button_2.svg";

const KakaoLoginButton: React.FC = () => {
  const kakaoAuthUrl = `${import.meta.env.VITE_API_SERVER_URL}/api/v1/auth/kakao`;

  return (
    <a href={kakaoAuthUrl} className="inline-block">
      <ImageButton src={kakao_login_button_2} className="opacity-80" />
    </a>
  );
};

export default KakaoLoginButton;
