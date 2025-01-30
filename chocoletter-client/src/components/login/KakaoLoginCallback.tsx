import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { toast } from "react-toastify";
import Loading from "../common/Loading";
import { MyUserInfo } from "../../types/user";
import { saveUserInfo } from "../../services/userApi";
import {
  giftBoxIdAtom,
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
  const setGiftBoxId = useSetRecoilState(giftBoxIdAtom);

  useEffect(() => {
    const handleLogin = async () => {
      // URL의 쿼리 파라미터로 전달된 사용자 정보 추출
      const urlParams = new URLSearchParams(window.location.search);
      const accessToken = urlParams.get("accessToken");
      const userName = urlParams.get("userName");
      const userProfileUrl = urlParams.get("userProfileUrl");
      const isFirstLoginParam = urlParams.get("isFirstLogin");
      const giftBoxIdStr = urlParams.get("giftBoxId"); // 예: "123"

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

      // giftBoxId를 number로 파싱 (문자열일 수도 있으므로)
      let giftBoxIdNum = null;
      if (giftBoxIdStr) {
        const parsed = parseInt(giftBoxIdStr, 10);
        if (!isNaN(parsed)) {
          giftBoxIdNum = parsed;
        }
      }

      if (giftBoxIdNum !== null) {
        setGiftBoxId(giftBoxIdNum);
      }

      // giftBoxId가 있다면 /main/my/before/:giftBoxId 로 이동
      if (giftBoxIdNum) {
        navigate(`/main/my/before/${giftBoxIdNum}`);
      } else {
        // giftBoxId 없거나 파싱 실패 시, 다른 fallback 경로로
        navigate("/"); // 0 등으로 표시 or navigate("/error");
      }
    };

    handleLogin();
  }, [navigate, setIsLogin, setUserName, setUserProfileUrl, setIsFirstLogin]);

  return <Loading />; // 로딩 컴포넌트 렌더링
};

export default KakaoLoginCallback;
