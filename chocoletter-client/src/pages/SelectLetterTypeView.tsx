import React from "react";
import { useNavigate } from "react-router-dom";
import { GoBackButton } from "../components/common/GoBackButton";
import { Button } from "../components/common/Button";
import blue from "../assets/images/letter/letter_blue.svg"
import pink from "../assets/images/letter/letter_pink.svg"

function SelectLetterTypeView() {
    const navigate = useNavigate();

    const handleAccept = () => {
        navigate("/write/general"); 
    };

    const handleReject = () => {
        navigate("/write/question");
    };

    return (
        <div className="flex flex-col items-center justify-start min-h-screen min-w-screen relative bg-chocoletterGiftBoxBg overflow-hidden">
            {/* 상단 bar */}
            <div className="w-full md:max-w-sm h-[58px] px-4 py-[17px] bg-chocoletterPurpleBold flex flex-col justify-center items-center gap-[15px] fixed z-50">
                <div className="self-stretch justify-between items-center inline-flex">
                    <div className="w-6 h-6 justify-center items-center flex">
                        <GoBackButton />
                    </div>
                    <div className="text-center text-white text-2xl font-normal font-sans leading-snug">편지지 선택하기</div>
                    <div className="w-6 h-6" />
                </div>
            </div>

            <div className="absolute mt-24">

                {/* 일반/랜덤 버튼 */}
                <div className="flex flex-col items-center justify-center m-4 gap-[30px]">
                    <h1 className="text-2xl font-bold">
                        발렌타인데이, <br/>
                        마음을 전할 편지지를 선택하세요!💌
                    </h1>
                    <Button
                        onClick={handleAccept}
                        className="w-[364px] h-p-[132px] inline-flex p-[15px_25px] items-center gap-[27px] rounded-[20px] border border-black bg-white" 
                    >
                        <img src={pink} alt="일반 편지지 이미지" className="w-[100px] h-[100px] flex-shrink-0 rounded-[10px] border-[1px] border-black object-cover"></img>
                        <div className="flex flex-col gap-[14px] text-left ">
                            <p className="self-stretch text-[18px] leading-[22px] tracking-[-0.408px]">일반 편지지</p>
                            <p className="self-stretch font-[Pretendard] text-[13px] leading-[140%]">진심을 담은 자유 형식의 편지를 작성해 상대방에게 마음을 전하세요✏️</p>
                        </div>
                    </Button>
                    <Button
                        onClick={handleReject}
                        className="w-[364px] h-p-[132px] inline-flex p-[15px_25px] items-center gap-[27px] rounded-[20px] border border-black bg-white" 
                    >
                        <img src={blue} alt="랜덤 질문 편지지 이미지" className="w-[100px] h-[100px] flex-shrink-0 rounded-[10px] border-[1px] border-black object-cover"></img>
                        <div className="flex flex-col gap-[14px] text-left ">
                            <p className="self-stretch text-[18px] leading-[22px] tracking-[-0.408px]">랜덤 질문 편지지</p>
                            <p className="self-stretch font-[Pretendard] text-[13px] leading-[140%]">랜덤하게 생성된 질문에 답하며 색다른 감동을 선사해 보세요🎁</p>
                        </div>
                        </Button>
                </div>
            </div>
        </div>
    );
}

export default SelectLetterTypeView;
 