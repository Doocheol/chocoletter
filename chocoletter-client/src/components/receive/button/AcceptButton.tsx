import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../common/Button";

// webRTC 초대창 수락 버튼
const AcceptButton = () => {
  const navigate = useNavigate();

  const handleAcceptClick = () => {
    navigate("/main/my/before"); // 이동 페이지
  };

  return (
    <div className="text-center">
      <Button onClick={handleAcceptClick}>
        와, 정말 기대돼요! <br />
        2월 14일에 함께 열어봐요 😊
      </Button>
    </div>
  );
};

export default AcceptButton;