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
      // URL의 쿼리 파라미터로 전달된 사용자 정보 추출
      const urlParams = new URLSearchParams(window.location.search);
      const accessToken = urlParams.get("accessToken");
      const userName = urlParams.get("userName");
      const userProfileUrl = urlParams.get("userProfileUrl");
      const isFirstLoginParam = urlParams.get("isFirstLogin");
      const shareCode = urlParams.get("shareCode"); // 이제 shareCode를 받음

      if (!accessToken || !userName || !shareCode) {
        throw new Error("필수 로그인 정보가 누락되었습니다.");
        removeUserInfo();
        toast.error("다시 로그인해주세요!");
      }

      const isFirstLogin = isFirstLoginParam === "true";
      setIsFirstLogin(isFirstLogin);

      // 사용자 정보 객체 생성
      const userInfo: MyUserInfo = {
        userName,
        accessToken,
        shareCode,
      };

      // 사용자 정보 저장 (로컬 스토리지)
      saveUserInfo(userInfo);

      // Recoil 상태 업데이트
      setIsLogin(true);
      setUserName(userName); // 서버에서 실제 이름을 제공하는 경우, 해당 값을 사용
      setUserProfileUrl(userProfileUrl || "");
      setShareCode(shareCode);

      const location = useLocation() as { state: { redirect?: string } };
      const redirectPath = location.state?.redirect;
      if (redirectPath) {
        navigate(redirectPath);
      }

      // isFirstLogin이 true면, 먼저 /select-giftbox로 이동
      if (isFirstLogin) {
        navigate("/select-giftbox");
      } else {
        // 그 외에는 shareCode를 기반으로 메인 페이지로 이동
        if (shareCode) {
          navigate(`/${shareCode}`);
        } else {
          navigate("/");
          removeUserInfo();
          toast.error("다시 로그인해주세요!");
        }
      }
    };

    handleLogin();
  }, [navigate, setIsLogin, setUserName, setUserProfileUrl, setIsFirstLogin, setShareCode]);

  return <Loading />; // 로딩 컴포넌트 렌더링
};

export default KakaoLoginCallback;
