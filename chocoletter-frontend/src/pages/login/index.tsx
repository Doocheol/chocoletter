import React from "react";
import { useNavigate } from "react-router-dom";
import KakaoLoginButton from "@/components/login/button/KakaoLoginButton";

const Login = () => {
  const navigate = useNavigate();

  const handleLoginSuccess = (isFirstLogin: boolean) => {
    if (isFirstLogin) {
      navigate("/tutorial-focus");
    } else {
      navigate("/main-my-before");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-pink-100 text-gray-800">
      <h1 className="text-4xl font-bold mb-8">Welcome to Chocoletter!</h1>
      <p className="mb-4 text-lg">Send sweet letters to your loved ones.</p>
      <KakaoLoginButton onLoginSuccess={handleLoginSuccess} />
    </div>
  );
};

export default Login;
