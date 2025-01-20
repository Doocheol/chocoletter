import { useRecoilState } from "recoil";
import { useEffect } from "react";
import chocoletter_login_view_logo from "../assets/images/logo/chocoletter_login_view_logo.png";
import KakaoLoginButton from "../components/login/button/KakaoLoginButton";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function LoginView() {
  

  const navigate = useNavigate();

  const handleLoginSuccess = (isFirstLogin: boolean) => {
    if (isFirstLogin) {
      toast.error("첫 로그인입니다. 튜토리얼을 진행해주세요.");
      // navigate("/tutorial-focus");
    } else {
      toast.error("로그인에 성공했습니다.");
      // navigate("/main-my-before");
    }
  };


  return (
    <div className="h-[calc((var(--vh, 1vh) * 100)-8rem)]">
        <div className="h-1/3 flex justify-center items-center">
          <img src={chocoletter_login_view_logo} alt="chocoletter_logo" className="max-h-40" />
        </div>
        <KakaoLoginButton onLoginSuccess={handleLoginSuccess}/>
    </div>

);
}

export default LoginView;