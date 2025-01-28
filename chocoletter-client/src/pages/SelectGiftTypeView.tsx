import React from "react";
import { useNavigate } from "react-router-dom";
import { GoBackButton } from "../components/common/GoBackButton";
import { Button } from "../components/common/Button";

function SelectGiftTypeView() {
    const navigate = useNavigate();

    const handleAccept = () => {
        navigate("/settime"); 
    };

    const handleReject = () => {
        navigate("/sentgift");
    };

    return (
        <div className="relative flex flex-col items-center h-screen">
             {/* GoBackButton을 좌측 상단에 고정 */}
             <GoBackButton altText="뒤로가기 버튼" />
            
            <div className="absolute mt-24">
                <h1 className="text-xl font-bold mb-8">
                    2월 14일, 편지를 받는 분과 함께 <br/>
                    달콤한 순간을 나눌 준비가 되셨나요? <br/>
                    같이 개봉해보실래요? 🥰
                </h1> 
                <h3 className="text-sm text-gray-500 mb-12">
                    같이 개봉하는 경우 지정된 시간에 <br/>
                    달콤한 초콜릿을 전해드리고, <br/>
                    지정한 시간에 화면 너머로 <br/>
                    따스한 마음을 나눌 수 있습니다.
                </h3>

                {/* 일반/랜덤 버튼 */}
                <div className="mb-8 text-center">
                    <Button
                        onClick={handleAccept}
                        className="w-[300px] h-[100px] px-1" 
                    >
                        <p className="text-xl">같이 개봉하기🥰</p>
                    </Button>
                </div>
                <div className="mb-8 text-center">
                    <Button
                        onClick={handleReject}
                        className="w-[300px] h-[100px] px-1" 
                    >
                        <p className="text-xl">마음만 전할래요🫣 </p>
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default SelectGiftTypeView;