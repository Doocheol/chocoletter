import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { toast } from "react-toastify";
import Loading from "../common/Loading";
import { MyUserInfo } from "../../types/user";
import { removeUserInfo, saveUserInfo } from "../../services/userApi";
import {
  isFirstLoginAtom,
  isLoginAtom,
  shareCodeAtom,
  userNameAtom,
  userProfileUrlAtom,
} from "../../atoms/auth/userAtoms";

const KakaoLoginCallback: React.FC = () => {
  const navigate = useNavigate();
  const setIsLogin = useSetRecoilState(isLoginAtom);
  const setUserName = useSetRecoilState(userNameAtom);
  const setUserProfileUrl = useSetRecoilState(userProfileUrlAtom);
  const setIsFirstLogin = useSetRecoilState(isFirstLoginAtom);
  const setShareCode = useSetRecoilState(shareCodeAtom);

  useEffect(() => {
    const handleLogin = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const accessToken = urlParams.get("accessToken");
      const userName = urlParams.get("userName");
      const userProfileUrl = urlParams.get("userProfileUrl");
      const isFirstLoginParam = urlParams.get("isFirstLogin");
      const shareCode = urlParams.get("shareCode");

      if (!accessToken || !userName || !shareCode) {
        removeUserInfo();
        toast.error("필수 로그인 정보가 누락되었습니다. 다시 로그인해주세요!");
        navigate("/login");
        return;
      }

      const isFirstLogin = isFirstLoginParam === "true";
      setIsFirstLogin(isFirstLogin);

      const userInfo: MyUserInfo = {
        userName,
        accessToken,
        shareCode,
      };

      saveUserInfo(userInfo);

      setIsLogin(true);
      setUserName(userName);
      setUserProfileUrl(userProfileUrl || "");
      setShareCode(shareCode);

      const locationState = useLocation().state as { redirect?: string } | null;
      const redirectPath = locationState?.redirect;
      if (redirectPath) {
        navigate(redirectPath);
        return;
      }

      if (isFirstLogin) {
        navigate("/select-giftbox");
        return;
      }

      if (shareCode) {
        navigate(`/${shareCode}`);
        return;
      } else {
        removeUserInfo();
        toast.error("다시 로그인해주세요!");
        navigate("/");
        return;
      }
      // 에러 발생 시 추가 처리 필요함
    };

    handleLogin();
  }, [navigate, setIsLogin, setUserName, setUserProfileUrl, setIsFirstLogin, setShareCode]);

  return <Loading />; // 로딩 컴포넌트 렌더링
};

export default KakaoLoginCallback;
