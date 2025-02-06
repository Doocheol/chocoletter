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
} from "../../atoms/auth/userAtoms";
import { generateAndStoreKeyPairForMember, getMemberPublicKey } from "../../utils/keyManager";
import { arrayBufferToBase64, registerFixedSymmetricKey } from "../../utils/encryption";

const KakaoLoginCallback: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const setIsLogin = useSetRecoilState(isLoginAtom);
  const setUserName = useSetRecoilState(userNameAtom);
  const setUserProfileUrl = useSetRecoilState(userProfileUrlAtom);
  const setIsFirstLogin = useSetRecoilState(isFirstLoginAtom);
  const setGiftBoxId = useSetRecoilState(giftBoxIdAtom);
  const setMemberId = useSetRecoilState(memberIdAtom);

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
      setMemberId(memberId);
      // console.log(memberId);

      // memberId 기반 키 페어 생성 및 저장
      await generateAndStoreKeyPairForMember(memberId);
      // console.log("키 페어 생성 완료");

      // 주석 시작
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
      // 테스트 코드 예시
      // try {
      //   const testMessage = "test";
      //   const encoder = new TextEncoder();
      //   const testData = encoder.encode(testMessage);
      //   if (publicKey) {
      //     const encryptedTest = await window.crypto.subtle.encrypt(
      //       { name: "RSA-OAEP" },
      //       publicKey,
      //       testData
      //     );
      //     if (privateKey) {
      //       const decryptedTestBuffer = await window.crypto.subtle.decrypt(
      //         { name: "RSA-OAEP" },
      //         privateKey,
      //         encryptedTest
      //       );
      //       const decryptedTest = new TextDecoder().decode(decryptedTestBuffer);
      //       console.log(
      //         "키 매칭 테스트 결과:",
      //         decryptedTest === testMessage ? "매칭됨" : "매칭 안 됨"
      //       );
      //     } else {
      //       console.error("키 매칭 테스트 실패: privateKey is null");
      //     }
      //   } else {
      //     console.error("키 매칭 테스트 실패: publicKey is null");
      //   }
      // } catch (e) {
      //   console.error("키 매칭 테스트 실패:", e);
      // }
      //주석끝

      // 주석시작
      // console.log("암호화/복호화 테스트 시작");

      // (async () => {
      //   // 키 페어 생성
      //   const keyPair = await window.crypto.subtle.generateKey(
      //     {
      //       name: "RSA-OAEP",
      //       modulusLength: 2048,
      //       publicExponent: new Uint8Array([1, 0, 1]),
      //       hash: "SHA-256",
      //     },
      //     true,
      //     ["encrypt", "decrypt"]
      //   );

      //   const plainText = "테스트 메시지";
      //   const encoder = new TextEncoder();
      //   const data = encoder.encode(plainText);

      //   // 암호화
      //   const encryptedBuffer = await window.crypto.subtle.encrypt(
      //     { name: "RSA-OAEP" },
      //     keyPair.publicKey,
      //     data
      //   );
      //   console.log("암호화된 데이터:", new Uint8Array(encryptedBuffer));

      //   // 복호화
      //   const decryptedBuffer = await window.crypto.subtle.decrypt(
      //     { name: "RSA-OAEP" },
      //     keyPair.privateKey,
      //     encryptedBuffer
      //   );
      //   const decryptedText = new TextDecoder().decode(decryptedBuffer);
      //   console.log("복호화된 메시지:", decryptedText);
      // })();
      //주석끝

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

      const redirectPath = localStorage.getItem("redirect");
      if (redirectPath) {
        navigate(redirectPath);
        localStorage.removeItem("redirect");
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
    location,
    setIsLogin,
    setUserName,
    setUserProfileUrl,
    setIsFirstLogin,
    setMemberId,
    setGiftBoxId,
  ]);

  return <Loading />;
};
