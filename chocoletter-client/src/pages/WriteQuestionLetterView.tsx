import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoBackButton } from "../components/common/GoBackButton";
import { Button } from "../components/common/Button";
import QuestionLetterForm from "../components/write-letter/QuestionLetterForm";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import login_view_service_title from "../assets/images/logo/login_view_service_title.svg";

// 편지지 선택 뷰 이후, 랜덤 질문 형식 편지지 작성 화면
const WriteQuestionLetterView = () => {
  const [nickname, setNickname] = useState("");
  const [content, setContent] = useState("");
  const [contentLength, setContentLength] = useState(0);
  const navigate = useNavigate();

    const goBackMainMyEvent = () => {
        if (nickname.length < 1) {
            // 닉네임이 1글자 미만일 경우
            toast.error("닉네임은 최소 1글자 이상 입력해야 합니다!", {
                position: "top-center",
                autoClose: 2000,
            });
            return; 
        }

        if (contentLength < 10) {
            // 메세지가 10글자 미만일 경우
            toast.error("메세지는 최소 10글자 이상 작성해야 합니다!", {
                position: "top-center",
                autoClose: 2000,
            });
            return; 
        }


        navigate("/selectgift");
    };

  return (
    <div className="relative flex flex-col items-center h-screen">
      {/* 뒤로 가기 버튼 */}
      <GoBackButton strokeColor="#9E4AFF" altText="뒤로가기 버튼" />

	return (
		<div className="relative flex flex-col items-center h-screen bg-letter-blue-background">

            <GoBackButton strokeColor="#9E4AFF" altText="뒤로가기 버튼" />
            
            <div className="absolute mt-[41px] m-4">
                {/* 로고 이미지  */}
                <div className="flex flex-col items-center mb-[30px]">
                    <img src={login_view_service_title} alt="login_view_service_title" className="" />
                </div>

                <div>
                    {/* QuestionLetterForm */}
                    <QuestionLetterForm
                        setNickname={setNickname}
                        setContent={setContent}
                        onContentChange={(length) => setContentLength(length)}
                    />
                    {/* 편지 작성 완료 버튼 - 초콜릿 선택 화면으로 이동 */}
                    <div className="relatvie text-center">
                        <Button
                            onClick={goBackMainMyEvent}
                            className="absolute flex w-[152px] h-[45px] justify-center items-center right-0 gap-2 rounded-[15px] border border-black chocoletterPurpleBold"
                        >
                            <p className="text-white text-center font-sans text-[21px] leading-[22px] tracking-[-0.408px]">다음으로</p>
                        </Button>
                    </div>
                </div>
            </div>
		</div>
	);
};

export default WriteQuestionLetterView;
