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
  giftBoxIdAtom,
  userNameAtom,
  userProfileUrlAtom,
} from "../../atoms/auth/userAtoms";

const KakaoLoginCallback: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation(); // useLocation는 최상위에서 호출합니다.
  const setIsLogin = useSetRecoilState(isLoginAtom);
  const setUserName = useSetRecoilState(userNameAtom);
  const setUserProfileUrl = useSetRecoilState(userProfileUrlAtom);
  const setIsFirstLogin = useSetRecoilState(isFirstLoginAtom);
  const setGiftBoxId = useSetRecoilState(giftBoxIdAtom);

  useEffect(() => {
    const handleLogin = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const accessToken = urlParams.get("accessToken");
      const userName = urlParams.get("userName");
      const userProfileUrl = urlParams.get("userProfileUrl");
      const isFirstLoginParam = urlParams.get("isFirstLogin");
      const giftBoxId = urlParams.get("giftBoxId");

      if (!accessToken || !userName || !giftBoxId) {
        removeUserInfo();
        setIsLogin(false);

        toast.error("다시 로그인해주세요!");
        navigate("/");
        return;
      }

      const isFirstLogin = isFirstLoginParam === "true";
      setIsFirstLogin(isFirstLogin);

      const userInfo: MyUserInfo = {
        userName,
        accessToken,
        giftBoxId,
      };

      saveUserInfo(userInfo);

      setIsLogin(true);
      setUserName(userName);
      setUserProfileUrl(userProfileUrl || "");
      setGiftBoxId(giftBoxId);

      // 최상위에서 선언한 location을 사용합니다.
      const redirectPath = (location.state as { redirect?: string } | null)?.redirect;
      if (redirectPath) {
        navigate(redirectPath);
        return;
      }

      if (isFirstLogin) {
        navigate("/select-giftbox");
        return;
      }

      navigate(`/main/${giftBoxId}`);
    };

    handleLogin();
  }, [
    navigate,
    location, // location을 의존성 배열에 추가합니다.
    setIsLogin,
    setUserName,
    setUserProfileUrl,
    setIsFirstLogin,
    setGiftBoxId,
  ]);

  return <Loading />;
};

export default KakaoLoginCallback;
