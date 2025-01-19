import React from "react";
import { useRouter } from "next/router";
import Layout from "@/components/common/Layout";
import KakaoLoginButton from "@/components/login/button/KakaoLoginButton";

const Home = () => {
  const router = useRouter();

  // 첫 로그인 여부에 따라 라우팅
  const handleLoginSuccess = (isFirstLogin: boolean) => {
    if (isFirstLogin) {
      router.push("/tutorial/focus"); // 첫 로그인 시 튜토리얼 페이지로 이동
    } else {
      router.push("/main/my/before"); // 기존 사용자 메인 페이지로 이동
    }
  };

  return (
    <Layout>
      초코레터에 오신 것을 환영합니다!
      <KakaoLoginButton onLoginSuccess={handleLoginSuccess} />
    </Layout>
  );
};

export default React.memo(Home);
