import React from "react";
import axios from "axios";
import { useSetRecoilState } from "recoil";
import { userNameAtom, userProfileUrlAtom } from "../../../atoms/auth/userAtoms";
import { ImageButton } from "../../common/ImageButton";
import kakao_login_button from "../../../assets/images/button/kakao_login_button.png";

// react-toastify 관련 import
import { toast } from "react-toastify";

type KakaoLoginButtonProps = {
  onLoginSuccess: (isFirstLogin: boolean) => void;
};

const KakaoLoginButton: React.FC<KakaoLoginButtonProps> = ({ onLoginSuccess }) => {
  const setUserName = useSetRecoilState(userNameAtom);
  const setUserProfileUrl = useSetRecoilState(userProfileUrlAtom);

  const handleKakaoLogin = async () => {
    try {
      // const response = await axios.get("/api/v1/auth/login");
      // const { name, profileUrl, isFirstLogin } = response.data;

      //테스트 공간
      const name = "김두철";
      const profileUrl = "https://avatars.githubusercontent.com/u/77449569?v=4";
      const isFirstLogin = true;


      // Recoil 상태 업데이트
      setUserName(name);
      setUserProfileUrl(profileUrl);

      toast.success("로그인에 성공했습니다!");

      // 부모 컴포넌트로 첫 로그인 여부 전달

      onLoginSuccess(isFirstLogin);
    } catch (error) {
      toast.error("로그인에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <ImageButton
      onClick={handleKakaoLogin}
      backgroundImage={kakao_login_button}
      className="w-48 h-12"
    />
  );
};

export default KakaoLoginButton;
