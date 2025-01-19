import React from "react";
import axios from "axios";
import { useSetRecoilState } from "recoil";
import { userNameAtom, userProfileUrlAtom } from "@/atoms/userAtoms";
import { ImageButton } from "@/components/common/ImageButton";

type KakaoLoginButtonProps = {
  onLoginSuccess: (isFirstLogin: boolean) => void;
};

const KakaoLoginButton: React.FC<KakaoLoginButtonProps> = ({ onLoginSuccess }) => {
  const setUserName = useSetRecoilState(userNameAtom);
  const setUserProfileUrl = useSetRecoilState(userProfileUrlAtom);

  const handleKakaoLogin = async () => {
    try {
      const response = await axios.get("/api/v1/auth/login");
      const { name, profile_url, is_first_login } = response.data;

      // Recoil 상태 업데이트
      setUserName(name);
      setUserProfileUrl(profile_url);

      // 부모 컴포넌트로 첫 로그인 여부 전달
      onLoginSuccess(is_first_login);
    } catch (error) {
      alert("Login failed. Please try again.");
    }
  };

  return (
    <ImageButton
      onClick={handleKakaoLogin}
      backgroundImage="/kakao_login.png"
      className="w-48 h-12"
    />
  );
};

export default KakaoLoginButton;
