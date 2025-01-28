import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { toast } from "react-toastify";
import Loading from "../common/Loading";
import { MyUserInfo } from "../../types/user";
import { saveUserInfo } from "../../services/userApi";
import {
  isFirstLoginAtom,
  isLoginAtom,
  userNameAtom,
  userProfileUrlAtom,
} from "../../atoms/auth/userAtoms";

const KakaoLoginCallback: React.FC = () => {
  const navigate = useNavigate();
  const setIsLogin = useSetRecoilState(isLoginAtom);
  const setUserName = useSetRecoilState(userNameAtom);
  const setUserProfileUrl = useSetRecoilState(userProfileUrlAtom);
  const setIsFirstLogin = useSetRecoilState(isFirstLoginAtom);

  useEffect(() => {
    const handleLogin = async () => {
      try {
        // URL의 쿼리 파라미터로 전달된 사용자 정보 추출
        const urlParams = new URLSearchParams(window.location.search);
        const accessToken = urlParams.get("accessToken");
        const userName = urlParams.get("userName");
        const userProfileUrl = urlParams.get("userProfileUrl");
        const isFirstLoginParam = urlParams.get("isFirstLogin");

        if (!accessToken || !userName) {
          throw new Error("필수 로그인 정보가 누락되었습니다.");
        }

        const isFirstLogin = isFirstLoginParam === "true";
        setIsFirstLogin(isFirstLogin);

        // 사용자 정보 객체 생성
        const userInfo: MyUserInfo = {
          userName,
          accessToken,
        };

        // 사용자 정보 저장 (로컬 스토리지)
        saveUserInfo(userInfo);

        // Recoil 상태 업데이트
        setIsLogin(true);
        setUserName(userName); // 서버에서 실제 이름을 제공하는 경우, 해당 값을 사용
        setUserProfileUrl(userProfileUrl || "");

        // 로그인 성공 토스트 메시지
        toast.success("로그인 성공!");
        navigate("/main/my/before"); // 홈 페이지로 이동
      } catch (error: any) {
        toast.error("로그인 실패!");
        navigate("/"); // 로그인 페이지로 이동
      }
    };

    handleLogin();
  }, [navigate, setIsLogin, setUserName, setUserProfileUrl, setIsFirstLogin]);

  return <Loading />; // 로딩 컴포넌트 렌더링
};

export default KakaoLoginCallback;
