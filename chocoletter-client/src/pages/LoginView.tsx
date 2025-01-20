import { useRecoilState } from "recoil";
import { useEffect } from "react";
import chocoletter_login_view_logo from "../assets/images/logo/chocoletter_login_view_logo.png";
// import KakaoLoginButton from "../components/login/button/KakaoLoginButton";

function LoginView() {
  

  return (
    <div className="h-[calc((var(--vh, 1vh) * 100)-8rem)]">
        <div className="h-1/3 flex justify-center items-center">
          <img src={chocoletter_login_view_logo} alt="chocoletter_logo" className="max-h-40" />
        </div>
        {/* <KakaoLoginButton /> */}
    </div>

);
}

export default LoginView;