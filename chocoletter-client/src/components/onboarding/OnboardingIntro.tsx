import { useState, useEffect, useRef } from "react";

import onboarding_intro_choco_1 from "../../assets/images/logo/onboarding_intro_choco_1.svg";
import onboarding_intro_choco_2 from "../../assets/images/logo/onboarding_intro_choco_2.svg";
import onboarding_intro_choco_3 from "../../assets/images/logo/onboarding_intro_choco_3.svg";
import onboarding_intro_text_1 from "../../assets/images/logo/onboarding_intro_text_1.svg";
import onboarding_intro_text_2 from "../../assets/images/logo/onboarding_intro_text_2.svg";
import onboarding_intro_text_3 from "../../assets/images/logo/onboarding_intro_text_3.svg";
import login_view_move_to_teambox from "../../assets/images/button/login_view_move_to_teambox.svg";

import { GoToTopButton } from "../login/button/GoToTopButton";

import login_view_down_arrow from "../../assets/images/button/login_view_down_arrow.svg";

function OnboardingIntro() {
  const [scrollPosition, setScrollPosition] = useState(0);
  const updateScroll = () => {
    setScrollPosition(window.scrollY || document.documentElement.scrollTop);
  };

  const introRef = useRef<HTMLDivElement>(null);
  const onMoreClick = () => {
    introRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    window.addEventListener("scroll", updateScroll);
    return () => window.removeEventListener("scroll", updateScroll);
  }, []);

  return (
    <div className="flex flex-col w-full">
      {/* 첫 번째 소개 이미지 */}

      <div
        className={`flex justify-center items-center pt-2 ${
          scrollPosition < 90 ? "shake-vertical" : "scale-out-center hidden"
        }`}
        onClick={onMoreClick}
        ref={introRef}
      >
        <img src={login_view_down_arrow} alt="login_view_down_arrow" className="p-2 max-h-24" />
      </div>

      {/* 서비스 소개 제목 */}
      <div className={`pt-1 mb-1 ${scrollPosition > 90 ? "slide-in-bottom" : "collapse"}`}>
        <span className="flex justify-center items-center my-2">
          <p className="border-b border-chocoletterPurple w-1/4 my-4"></p>
          <p className="mx-4 text-sm text-chocoletterPurple textShadow-none">초코레터! 알아보기!</p>
          <p className="border-b border-chocoletterPurple w-1/4 my-4"></p>
        </span>
      </div>

      {/* 서비스 설명 */}
      <div className={`mb-6 ${scrollPosition > 110 ? "slide-in-bottom" : "collapse"}`}>
        {/* <span className="text-xl flex justify-center text-white items-center textShadow ">
          <p className="mr-1 white text-hrtColorPink pr-2">익명 편지 서비스</p>
          <p className="mr-1 purple ">초코레터!</p>
        </span>
        <span className="text-lg flex flex-col justify-center text-white items-center textShadow my-2 ">
          <p className="mr-1 purple pr-2">초콜릿 서비스는</p>
          <p className="mr-1 white text-hrtColorPink">발렌타인데이인 2월 14일에</p>
          <p className="mr-1 purple">모든 편지를 확인 가능해요!</p>
        </span> */}

        {/* 두 번째 소개 이미지 */}
        <div className="flex flex-col items-center mx-8">
          <img
            src={onboarding_intro_choco_1}
            alt="onboarding_intro_choco_1"
            className="p-2 max-h-64"
          />
          <img
            src={onboarding_intro_text_1}
            alt="onboarding_intro_text_1"
            className="p-2 max-h-64"
          />
        </div>
      </div>

      {/* 추가 서비스 기능 설명 */}
      <div className={`mb-5 ${scrollPosition > 220 ? "slide-in-bottom" : "collapse"}`}>
        <div className="flex flex-col items-center mx-8">
          {/* 세 번째 소개 이미지 */}
          <img
            src={onboarding_intro_choco_2}
            alt="onboarding_intro_choco_2"
            className="p-2 max-h-64"
          />
          <img
            src={onboarding_intro_text_2}
            alt="onboarding_intro_text_2"
            className="p-2 max-h-64"
          />
        </div>
      </div>

      <div className={`${scrollPosition > 400 ? "slide-in-bottom" : "collapse"}`}>
        <div className="flex flex-col items-center mx-8">
          {/* 세 번째 소개 이미지 */}
          <img
            src={onboarding_intro_choco_3}
            alt="onboarding_intro_choco_3"
            className="p-2 max-h-64"
          />
          <img
            src={onboarding_intro_text_3}
            alt="onboarding_intro_text_3"
            className="p-2 max-h-64"
          />
        </div>
      </div>

      {/* 페이지 상단으로 가기 버튼 */}
      <div
        className={`px-8 mb-4 flex justify-end ${
          scrollPosition > 500 ? "slide-in-bottom" : "collapse"
        }`}
      >
        <GoToTopButton
        // className="mb-" // 버튼의 너비와 높이 조정
        // scrollThreshold={600} // 필요에 따라 조정
        />
      </div>

      {/* 초콜릿 상자 보러가기 링크 */}
      <a
        className={`mx-4 mb-14 ml-10 heartbeat
          ${scrollPosition > 510 ? "slide-in-bottom" : "collapse"} `}
        href="https://www.chocolate-letter.com/"
      >
        <img
          src={login_view_move_to_teambox}
          alt="login_view_move_to_teambox"
          // className="p-2 max-h-64"
        />
        {/* <p className="py-2 text-hrtColorPink">"초코레터"팀의 초콜릿 박스 보러가기</p> */}
      </a>
    </div>
  );
}

export default OnboardingIntro;
