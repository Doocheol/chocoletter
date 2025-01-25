import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Button } from "../components/common/Button";
import { GoBackButton } from "../components/common/GoBackButton";
import { GoArrowLeft } from "react-icons/go";
import goBackIcon from "../assets/images/button/go_back_button.png";
import MessageSentSuccessfullyModal from "../components/set-time/modal/MessageSentSuccessfullyModal";
import AmPmButton from "../components/set-time/button/AmPmButton";

// 이 부분은 연습 페이지입니다. 기존 (혹은 추후) LetterViewrk 가 모두 대체할 예정이므로, 안 봐도 됩니다.
const ExamplePage = () => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAmPm, setSelectedAmPm] = useState<"AM" | "PM">("AM");


    // 초콜릿 만들기 버튼 누르면, 카카오톡 전송 완료 모달 띄우기
    const showGiftSuccessModalHandler = () => {
        setIsModalOpen(true);
    }
    
    // unboxingTime 저장하기 
    const sendGiftHandler = async () => {
        // console.log("저장된 값:", selected);
        // 자유 편지지
        // await sendSpecialGeneralLetter(selected); 

        // 랜덤 편지지
        // await sendSpecialQuestionLetter(selected); 
    };

    // 모달 닫기 + 페이지 이동
    const closeModalAndNavigate = () => {
        setIsModalOpen(false);
        navigate("/sentgift"); // 원하는 경로로 이동
    };


	return (
        <div className="relative flex flex-col items-center h-screen">
            {/* 모달 컴포넌트 : 카카오톡 전송 완료 안내 & 편지 전송 완료 안내 화면으로 이동동 */}
            <MessageSentSuccessfullyModal
                    isOpen={isModalOpen}
                    onClose={closeModalAndNavigate}
            />
            {/* 페이지 콘텐츠 */}
            <GoBackButton icon={<GoArrowLeft />} altText="뒤로가기 버튼" />
            <div className="absolute mt-24">
                {/* AmPmSelector 컴포넌트 */}
                <AmPmButton
                    selected={selectedAmPm} 
                    onSelect={(value) => setSelectedAmPm(value)} 
                />
                {/* <h1 className="text-center">현재 페이지</h1> */}
                <Button
                    onClick={() => {
                        showGiftSuccessModalHandler();
                        sendGiftHandler();
                    }}
                    className="py-5">
                    초콜릿 개봉 초대장 보내기 📮
                </Button>
            </div>
		</div>
	);
};

export default ExamplePage;
