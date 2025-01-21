import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../common/Button";

// webRTC 초대창 거절 버튼
const RejectButton = () => {
    const navigate = useNavigate();

    const handleAcceptClick = () => {
        navigate("/main/my/before"); // 이동 페이지
    };

    return (
        <div className="text-center">
            <Button 
                onClick={handleAcceptClick}
                className="w-[300px] h-[100px]" // 픽셀 단위를 명시
            >
                그때는 어려울 것 같아요. <br />
                다른 시간에 함께 할 수 있을까요?😥
            </Button>
        </div>
    );
};

export default RejectButton;