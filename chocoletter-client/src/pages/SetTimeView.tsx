import React, { useState, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import { Button } from "../components/common/Button";
import { GoBackButton } from "../components/common/GoBackButton";
import { GoArrowLeft } from "react-icons/go";
import MessageSentSuccessfullyModal from "../components/set-time/modal/MessageSentSuccessfullyModal";
import AmPmButton from "../components/set-time/button/AmPmButton"
import HourDialButton from "../components/set-time/button/HourDialButton"
import MinuteButton from "../components/set-time/button/MinuteButton"
import UnboxingSchedule from "../components/set-time/UnboxingSchedule";

// 특별 선물 선택 이후, 화상 연결 시간 설정하는 화면
const SetTimeView = () => {
    const [unboxingTimes, setUnboxingTimes] = useState<string[] | null>(null);
    const [selectedAmPm, setSelectedAmPm] = useState<"AM" | "PM">("AM");
    const [selectedHour, setSelectedHour] = useState<string>("01");
    const [selectedMinute, setSelectedMinute] = useState("00");
    const [disabledMinutes, setDisabledMinutes] = useState<string[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    // Unboxing Schedule 불러오기
    const handleTimeFetched = useCallback((times: string[] | null) => {
        console.log("Fetched unboxingTimes:", times);
        setUnboxingTimes(times);
    }, []); // 빈 배열을 사용하여 함수 객체를 고정

    // 12시간제를 24시간제로 변환
    const convertTo24Hour = (amPm: "AM" | "PM", hour: string) => {
        let hour24 = parseInt(hour, 10);
        if (amPm === "PM" && hour24 !== 12) hour24 += 12;
        if (amPm === "AM" && hour24 === 12) hour24 = 0;
        return hour24;
    };

    // 특정 시간에 따른 비활성화된 분 계산
    const calculateDisabledMinutes = (amPm: "AM" | "PM", hour: string) => {
        if (!unboxingTimes) return [];
        const hour24 = convertTo24Hour(amPm, hour);
        return unboxingTimes
            .filter((time) => time.startsWith(hour24.toString().padStart(2, "0")))
            .map((time) => time.split(":")[1]); // 비활성화된 분만 추출
    };

    // AM/PM 변경
    const handleAmPmChange = (value: "AM" | "PM") => {
        setSelectedAmPm(value);
        const updatedDisabledMinutes = calculateDisabledMinutes(value, selectedHour);
        setDisabledMinutes(updatedDisabledMinutes); // 새로운 비활성화된 분 업데이트
        setSelectedMinute("00"); // 선택된 분 초기화
    };

    // Hour 변경
    const handleHourChange = (hour: string) => {
        setSelectedHour(hour);
        const updatedDisabledMinutes = calculateDisabledMinutes(selectedAmPm, hour);
        setDisabledMinutes(updatedDisabledMinutes); // 새로운 비활성화된 분 업데이트
        setSelectedMinute("00"); // 선택된 분 초기화
    };

    // Minute 변경
    const handleMinuteChange = (minute: string) => {
        setSelectedMinute(minute);
    };

    // 선택된 시간을 서버에 저장하기
    const saveHandler = async () => {
        const hour24 = convertTo24Hour(selectedAmPm, selectedHour);
        const unBoxingTime = `${hour24.toString().padStart(2, "0")}:${selectedMinute}`;
        // console.log("저장된 값:", { unBoxingTime }); // 출력 확인
        // TODO: await send~~({ unBoxingTime });
    };

    // 초콜릿 만들기 버튼 누르면, 카카오톡 전송 완료 모달 띄우기
    const sentGiftHandler = () => {
        setIsModalOpen(true);
    };

    // 모달 닫기 + 페이지 이동
    const closeModalAndNavigate = () => {
        setIsModalOpen(false);
        navigate("/sentgift"); // 원하는 경로로 이동
    };

	return (
        <div className="relative flex flex-col items-center h-screen">
            {/* UnboxingSchedule: 데이터만 로드 */}
            <UnboxingSchedule giftBoxId={1} onTimeFetched={handleTimeFetched} />
            
            {/* 모달 컴포넌트 : 카카오톡 전송 완료 안내 & 편지 전송 완료 안내 화면으로 이동 */}
            <MessageSentSuccessfullyModal
                    isOpen={isModalOpen}
                    onClose={closeModalAndNavigate}
            />
            {/* 페이지 콘텐츠 */}
            <GoBackButton altText="뒤로가기 버튼" />
            <div className="absolute mt-24 flex flex-col items-center">
                <h1 className="text-xl font-bold mb-12">
                    함께 설렘을 나눌 수 있는 시간이에요!<br />
                    2월 14일, 당신만을 위한<br />
                    특별한 날에 원하는 시각을 설정해주세요 🤩
                </h1>

                {/* 시간 선택  */}
                <div className="h-[250px] flex flex-raw my-8">
                    {/* AmPmButton */}
                    <AmPmButton selected={selectedAmPm} onSelect={handleAmPmChange} />

                    {/* HourDialButton */}
                    <HourDialButton onHourChange={handleHourChange} />

                    {/* MinuteButton */}
                    <MinuteButton
                        selected={selectedMinute}
                        onSelect={handleMinuteChange}
                        disabledMinutes={disabledMinutes} // 비활성화된 분 전달
                    />

                    {/* <div className="flex flex-col justify-center text-3xl"> : </div> */}

                </div>

                {/* 선택된 시간 표시 */}
                <div className="flex flex-col items-center bg-blue-50 p-4 rounded-lg shadow-md w-[300px] mb-12">
                    <p className="text-gray-700 text-sm font-semibold">선택된 시간</p>
                    <p className="text-gray-500 text-sm mb-2">2025년 2월 14일</p>
                    <div className="flex gap-2 text-3xl font-bold text-blue-600">
                        <span>{selectedHour}</span>
                        <span>시</span>
                        <span>{selectedMinute}</span>
                        <span>분</span>
                        <span>{selectedAmPm}</span>
                    </div>
                </div>
                {/* <div className="w-[300px] mb-12 p-4">
                    <p className="text-lg font-bold">
                        선택된 시간 <br />
                        2월 14일 {" "}
                        <span>
                            {selectedHour}시 {selectedMinute}분 {selectedAmPm}
                        </span>
                    </p>
                </div> */}

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
