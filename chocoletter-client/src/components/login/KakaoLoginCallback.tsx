// KakaoLoginCallback.tsx (일부)
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
  memberIdAtom,
  isGiftBoxSelectedAtom,
  giftBoxNumAtom,
} from "../../atoms/auth/userAtoms";
import {
  generateAndStoreKeyPairForMember,
  getMemberPrivateKey,
  getMemberPublicKey,
} from "../../utils/keyManager";
import { arrayBufferToBase64, registerFixedSymmetricKey } from "../../utils/encryption";
import { getGiftBoxName } from "../../services/giftBoxApi";

const getGiftBoxNumFill = async (giftBoxId: string) => {
  try {
    const res = await getGiftBoxName(giftBoxId);
    return res;
  } catch (err) {
    console.error(err, "선물상자 정보 로그인에서 불러오기 실패");
  }
};

const KakaoLoginCallback: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const setIsLogin = useSetRecoilState(isLoginAtom);
  const setUserName = useSetRecoilState(userNameAtom);
  const setUserProfileUrl = useSetRecoilState(userProfileUrlAtom);
  const setIsFirstLogin = useSetRecoilState(isFirstLoginAtom);
  const setGiftBoxId = useSetRecoilState(giftBoxIdAtom);
  const setMemberId = useSetRecoilState(memberIdAtom);
  const setIsGiftBoxSelected = useSetRecoilState(isGiftBoxSelectedAtom);
  const setGiftBoxNum = useSetRecoilState(giftBoxNumAtom);

  useEffect(() => {
    const handleLogin = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const accessToken = urlParams.get("accessToken");
      const userName = urlParams.get("userName");
      const userProfileUrl = urlParams.get("userProfileUrl");
      const isFirstLoginParam = urlParams.get("isFirstLogin");
      const giftBoxId = urlParams.get("giftBoxId");
      const memberId = urlParams.get("memberId");

      if (!accessToken || !userName || !giftBoxId || !memberId) {
        removeUserInfo();
        setIsLogin(false);
        if (!toast.isActive("require-login-toast")) {
                  toast.error("다시 로그인해주세요.", {
                    toastId: "require-login-toast",
                    position: "top-center",
                    autoClose: 2000,
                  });
                }
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
      setMemberId(memberId);
      console.log(memberId);

      // memberId 기반 키 페어 생성 및 저장
      await generateAndStoreKeyPairForMember(memberId);
      console.log("키 페어 생성 완료");

      // // 생성된 공개키와 개인키를 불러와서 Base64로 export 후 콘솔에 출력 (테스트 용도)
      // const publicKey = await getMemberPublicKey(memberId);
      // const privateKey = await getMemberPrivateKey(memberId);
      // console.log("불러온 publicKey:", publicKey, "불러온 privateKey:", privateKey);

      // if (publicKey && privateKey) {
      //   try {
      //     // 공개키 export (spki 형식)
      //     const exportedPublicKey = await window.crypto.subtle.exportKey("spki", publicKey);
      //     const publicKeyB64 = arrayBufferToBase64(exportedPublicKey);
      //     // 개인키 export (pkcs8 형식)
      //     const exportedPrivateKey = await window.crypto.subtle.exportKey("pkcs8", privateKey);
      //     const privateKeyB64 = arrayBufferToBase64(exportedPrivateKey);

      //     console.log("Generated Public Key (Base64):", publicKeyB64);
      //     console.log("Generated Private Key (Base64):", privateKeyB64);
      //   } catch (exportError) {
      //     console.error("키 export 에러:", exportError);
      //   }
      // } else {
      //   console.error("키 페어가 정상적으로 로드되지 않았습니다.");
      // }

      // 로컬에 저장된 공개키 불러오기
      const publicKeyCryptoKey = await getMemberPublicKey(memberId);
      if (!publicKeyCryptoKey) {
        throw new Error("공개키 로딩 실패");
      }
      // 내보내기하여 Base64 문자열로 변환
      const exportedPublicKey = await window.crypto.subtle.exportKey("spki", publicKeyCryptoKey);
      const publicKeyB64 = arrayBufferToBase64(exportedPublicKey);

      // 서버에 공개키 등록
      await registerFixedSymmetricKey(publicKeyB64);

      const giftBoxInfo = await getGiftBoxNumFill(giftBoxId);
      if (!giftBoxInfo) {
        throw new Error("Failed to load gift box information");
        navigate("/");
      }
      const { type } = giftBoxInfo;

      const redirectPath = localStorage.getItem("redirect");
      if (redirectPath) {
        if (type !== 0) {
          setGiftBoxNum(type);
          setIsGiftBoxSelected(true);
        }
        navigate(redirectPath);
        localStorage.removeItem("redirect");
        return;
      }
      if (type === 0) {
        navigate("/select-giftbox");
        return;
      }

      setGiftBoxNum(type);
      setIsGiftBoxSelected(true);
      navigate(`/main/${giftBoxId}`);
    };

    handleLogin();
  }, [
    navigate,
    location,
    setIsLogin,
    setUserName,
    setUserProfileUrl,
    setIsFirstLogin,
    setMemberId,
    setGiftBoxId,
    setIsGiftBoxSelected,
    setGiftBoxNum,
  ]);

  return <Loading />;
};

export default KakaoLoginCallback;
