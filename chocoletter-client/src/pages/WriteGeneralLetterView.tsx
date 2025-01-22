import React from "react";
import { useNavigate } from "react-router-dom";
import { GoBackButton } from "../components/common/GoBackButton";
import { GoArrowLeft } from "react-icons/go";
import { Button } from "../components/common/Button";
import chocoletter_login_view_logo from "../assets/images/logo/chocoletter_login_view_logo.png";

// 편지지 선택 뷰 이후, 자유 형식 편지지 작성 화면
const WriteGeneralLetterView = () => {
    const navigate = useNavigate();

    const goBackMainMyEvent = () => {
        navigate('/selectgift')  // 초콜릿 종류 선택 화면으로 이동동
    }
	return (
		<div className="relative flex flex-col items-center h-screen">
             {/* GoBackButton을 좌측 상단에 고정 */}
             <GoBackButton icon={<GoArrowLeft />} altText="뒤로가기 버튼" />
            
            <div className="absolute mt-24">
                <div className="h-1/3 flex justify-center items-center mb-24">
                    <img
                        src={chocoletter_login_view_logo}
                        alt="chocoletter_login_view_logo"
                        className="max-h-40"
                    />
                </div>

			    <h1 className="text-center">현재 페이지</h1>

                <div className="mb-8 text-center">
                    <Button
                        onClick={goBackMainMyEvent}
                        className="w-[300px] h-[50px] px-1 mb-4" 
                    >
                        편지 작성 완료!✏️
                    </Button>
                </div>
            </div>
		</div>
	);
};

export default WriteGeneralLetterView;
