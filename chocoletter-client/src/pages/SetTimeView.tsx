import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Button } from "../components/common/Button";
import { GoBackButton } from "../components/common/GoBackButton";
import { GoArrowLeft } from "react-icons/go";
import goBackIcon from "../assets/images/button/go_back_button.png";
import MessageSentSuccessfullyModal from "../components/set-time/modal/MessageSentSuccessfullyModal";
import AmPmButton from "../components/set-time/button/AmPmButton"
import HourDialButton from "../components/set-time/button/HourDialButton"

// 특별 선물 선택 이후, 화상 연결 시간 설정하는 화면
const SetTimeView = () => {
    const [selected, setSelected] = useState<"AM" | "PM">("AM");
    const [selectedHour, setSelectedHour] = useState<string>("01"); // 선택된 시간 상태
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);

    // 선택된 시간을 서버에 저장하기
    const saveHandler = async () => {
        console.log("저장된 값:", selected);
        // await saveSelectionToDatabase(selected); 
    };

    // AM/PM 선택
    const selectAmPmHandler = (value: "AM" | "PM") => {
        setSelected(value); 
    };

    // HourDialButton에서 시간 변경 시 호출
    const handleHourChange = (hour: string) => {
        setSelectedHour(hour);
    };

    // 초콜릿 만들기 버튼 누르면, 카카오톡 전송 완료 모달 띄우기
    const sentGiftHandler = () => {
        setIsModalOpen(true);
    }

    // 모달 닫기 + 페이지 이동
    const closeModalAndNavigate = () => {
        setIsModalOpen(false);
        navigate("/sentgift"); // 원하는 경로로 이동
    };

	return (
        <div className="relative flex flex-col items-center h-screen">
            {/* 모달 컴포넌트 : 카카오톡 전송 완료 안내 & 편지 전송 완료 안내 화면으로 이동 */}
            <MessageSentSuccessfullyModal
                    isOpen={isModalOpen}
                    onClose={closeModalAndNavigate}
            />
            {/* 페이지 콘텐츠 */}
            <GoBackButton icon={<GoArrowLeft />} altText="뒤로가기 버튼" />
            <div className="absolute mt-24 flex flex-col items-center">
                <h1 className="text-xl font-bold mb-12">
                    함께 설렘을 나눌 수 있는 시간이에요!<br />
                    2월 14일, 당신만을 위한<br />
                    특별한 날에 원하는 시각을 설정해주세요 🤩
                </h1>

                {/* 시간 선택  */}
                <div className="flex flex-raw my-12">
                    {/* AmPmButton 컴포넌트 */}
                    <AmPmButton
                        selected={selected}
                        onSelect={selectAmPmHandler} 
                    />

                    {/* HourDialButton 표시 */}
                    <HourDialButton onHourChange={handleHourChange} />

                    {/* <div className="flex flex-col justify-center text-3xl"> : </div> */}

                </div>

                {/* 선택된 시간 표시 */}
                <div className="w-[250px] mb-12 p-4">
                    <p className="text-lg">
                    선택된 시간 : <span className="font-bold">{selectedHour}</span>
                    </p>
                </div>

                {/* 초대장 전송 버튼 */}
                <Button 
                    onClick={() => {
                        sentGiftHandler();
                        saveHandler();
                    }}
                    className="py-5"
                >
                        초콜릿 개봉 초대장 보내기 📮
                </Button>
            </div>
		</div>
	);
};

export default SetTimeView;
