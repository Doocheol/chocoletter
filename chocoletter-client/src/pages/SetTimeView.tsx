import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Button } from "../components/common/Button";
import { GoBackButton } from "../components/common/GoBackButton";
import { GoArrowLeft } from "react-icons/go";
import MessageSentSuccessfullyModal from "../components/set-time/modal/MessageSentSuccessfullyModal";
import AmPmButton from "../components/set-time/button/AmPmButton"
import HourDialButton from "../components/set-time/button/HourDialButton"
import MinuteButton from "../components/set-time/button/MinuteButton"

// 특별 선물 선택 이후, 화상 연결 시간 설정하는 화면
const SetTimeView = () => {
    const [selectedAmPm, setselectedAmPm] = useState<"AM" | "PM">("AM");
    const [selectedHour, setSelectedHour] = useState<string>("01");
    const [selectedMinute, setSelectedMinute] = useState("00"); // 초기 분 설정
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);

    // AM/PM 선택
    const handleAmPmChange = (value: "AM" | "PM") => {
        setselectedAmPm(value); 
    };

    // HourDialButton에서 시간 변경 시 호출
    const handleHourChange = (hour: string) => {
        setSelectedHour(hour);
    };

    // HourDialButton에서 시간 변경 시 호출
    const handleMinuteChange = (hour: string) => {
        setSelectedMinute(hour);
        
    };

    // 24시 형태로 변환
    const convertTo24Hour = (hour: string, minute: string, amPm: "AM" | "PM") => {
    let hourNumber = parseInt(hour, 10); // 문자열 "01", "02" 등을 숫자로 변환
    if (amPm === "PM" && hourNumber !== 12) {
        hourNumber += 12; // 오후(PM)이고 12시가 아니라면 12를 더함
    } else if (amPm === "AM" && hourNumber === 12) {
        hourNumber = 0; // 오전(AM)이고 12시라면 0시로 변환
    }
    return hourNumber.toString().padStart(2, "0"); // 항상 2자리로 반환
    };

    // 선택된 시간 데이터를 조합하여 서버로 전송 가능한 형태로 생성
    const createUnBoxingTime = () => {
        const hour24 = convertTo24Hour(selectedHour, selectedMinute, selectedAmPm);
        return `${hour24}:${selectedMinute}`; // "21:50" 형태로 반환
    };

    // 선택된 시간을 서버에 저장하기
    const saveHandler = async () => {
        const unBoxingTime = createUnBoxingTime();
        console.log("저장된 값:", { unBoxingTime }); // 출력 확인
        // TODO: await send~~({ unBoxingTime }); 
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
                <div className="h-[300px] flex flex-raw my-12">
                    {/* AmPmButton 컴포넌트 */}
                    <AmPmButton selected={selectedAmPm} onSelect={handleAmPmChange} 
                    />

                    {/* HourDialButton 표시 */}
                    <HourDialButton onHourChange={handleHourChange} />

                    {/* MinuteButton 표시 */}
                    <MinuteButton selected={selectedMinute} onSelect={handleMinuteChange} />

                    {/* <div className="flex flex-col justify-center text-3xl"> : </div> */}

                </div>

                {/* 선택된 시간 표시 */}
                <div className="w-[300px] mb-12 p-4">
                    <p className="text-lg font-bold">
                        선택된 시간 : {" "}
                        <span>
                            {selectedHour}시 {selectedMinute}분 {selectedAmPm}
                        </span>
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
