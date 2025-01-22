import React from "react";
import { useNavigate } from "react-router-dom";
import { GoBackButton } from "../components/common/GoBackButton";
import { GoArrowLeft } from "react-icons/go";
import { Button } from "../components/common/Button";

function SelectLetterTypeView() {
    const navigate = useNavigate();

    const handleAccept = () => {
        navigate("/write/general"); 
    };

    const handleReject = () => {
        navigate("/write/question");
    };

    return (
        <div className="relative flex flex-col items-center h-screen">
             {/* GoBackButton을 좌측 상단에 고정 */}
             <GoBackButton icon={<GoArrowLeft />} altText="뒤로가기 버튼" />
            
            <div className="absolute mt-24">
                <h1 className="text-2xl font-bold mb-24">
                    발렌타인데이, <br/>
                    마음을 전할 편지지를 선택하세요!💌
                </h1>

                {/* 일반/랜덤 버튼 */}
                <div className="mb-8 text-center">
                    <Button
                        onClick={handleAccept}
                        className="w-[300px] h-[200px] px-1" 
                    >
                        진심을 담은 당신만의 편지를 작성해 <br/>
                        상대방에게 따뜻한 마음을 전하세요✏️
                    </Button>
                </div>
                <div className="mb-8 text-center">
                    <Button
                        onClick={handleReject}
                        className="w-[300px] h-[200px] px-1" 
                    >
                        랜덤하게 생성된 특별한 메시지로 <br/>
                        색다른 감동을 선사해 보세요🎁
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default SelectLetterTypeView;
