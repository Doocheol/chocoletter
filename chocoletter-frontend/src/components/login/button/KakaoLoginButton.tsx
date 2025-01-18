import React from "react";
import axios from "axios";
import { ImageButton } from "../../common/ImageButton";

type KakaoLoginButtonProps = {
  onLoginSuccess: (name: string, profileUrl: string, isFirstLogin: boolean) => void;
};

const KakaoLoginButton: React.FC<KakaoLoginButtonProps> = ({ onLoginSuccess }) => {
  const handleKakaoLogin = async () => {
    try {
      // Next.js API Route로 요청
      const response = await axios.get("/api/v1/auth/login");
      const { name, profile_url, is_first_login } = response.data;

      // 부모 컴포넌트로 로그인 성공 데이터 전달
      onLoginSuccess(name, profile_url, is_first_login);
    } catch (error) {
      console.error("Kakao login failed:", error);
      alert("Login failed. Please try again.");
    }
  };

  return (
    <ImageButton
      onClick={handleKakaoLogin}
      backgroundImage="/assets/images/social/kakao_login.png"
      className="w-48 h-12" // 버튼 크기 조정
    >
      {/* 버튼 내 텍스트 추가 시 필요 */}
    </ImageButton>
  );
};

export default KakaoLoginButton;
