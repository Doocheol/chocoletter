import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import { GoBackButton } from "../components/common/GoBackButton";
import { Button } from "../components/common/Button";
import GeneralLetterForm from "../components/write-letter/GeneralLetterForm";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import login_view_service_title from "../assets/images/logo/login_view_service_title.svg";
import { freeLetterState } from "../atoms/letter/letterAtoms" ;

const WriteGeneralLetterView = () => {
    const [letter, setLetter] = useRecoilState(freeLetterState);
    const { giftBoxId } = useParams();
    const navigate = useNavigate();
    
    const resetLetterState = () => {
        setLetter({
            nickname: "",
            content: "",
            contentLength: 0,
        });
    };
    const handleGoBack = () => {
        resetLetterState(); // 상태 초기화
    };

    const goSelectGiftView = () => {
        if (letter.nickname.length < 1) {
        toast.error("닉네임은 최소 1글자 이상 입력해야 합니다!", {
            position: "top-center",
            autoClose: 2000,
        });
        return;
        }

    if (letter.contentLength < 10) {
      toast.error("메세지는 최소 10글자 이상 작성해야 합니다!", {
        position: "top-center",
        autoClose: 2000,
      });
      return;
    }

    navigate(`/select-gift/${giftBoxId}`);
  };

  return (
    <div className="relative flex flex-col items-center h-screen bg-letter-pink-background">
      <GoBackButton strokeColor="#9E4AFF" altText="뒤로가기 버튼" onClick={handleGoBack} />

      <div className="absolute mt-[41px] m-4">
        {/* 로고 이미지 */}
        <div className="flex flex-col items-center mb-[30px]">
          <img src={login_view_service_title} alt="login_view_service_title" />
        </div>

        <div>
          {/* GeneralLetterForm */}
          <GeneralLetterForm />

          {/* 편지 작성 완료 버튼 */}
          <div className="relative text-center">
            <Button
              onClick={goSelectGiftView}
              className="absolute flex w-[152px] h-[45px] justify-center items-center right-0 gap-2 rounded-[15px] border border-black bg-chocoletterPurpleBold"
            >
              <p className="text-white text-center font-sans text-[21px] leading-[22px] tracking-[-0.408px]">
                다음으로
              </p>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WriteGeneralLetterView;
