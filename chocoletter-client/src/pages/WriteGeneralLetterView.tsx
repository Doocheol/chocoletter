import React from "react";
import { useNavigate } from "react-router-dom";
import { GoBackButton } from "../components/common/GoBackButton";
import { GoArrowLeft } from "react-icons/go";
import { Button } from "../components/common/Button";

// 이 부분은 연습 페이지입니다. 기존 (혹은 추후) LetterViewrk 가 모두 대체할 예정이므로, 안 봐도 됩니다.
const WriteGeneralLetterView = () => {
	return (
		<div className="relative flex flex-col items-center h-screen">
             {/* GoBackButton을 좌측 상단에 고정 */}
             <GoBackButton icon={<GoArrowLeft />} altText="뒤로가기 버튼" />
            
            <div className="absolute mt-24">

			<h1 className="text-center">현재 페이지</h1>
            </div>
		</div>
	);
};

export default WriteGeneralLetterView;
