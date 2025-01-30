import React, { useState, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from "recoil";
import { Button } from "../components/common/Button";
import { GoBackButton } from "../components/common/GoBackButton";
import MessageSentSuccessfullyModal from "../components/set-time/modal/MessageSentSuccessfullyModal";
import AmPmDial from "../components/set-time/button/AmPmDial"
import HourDial from "../components/set-time/button/HourDial"
import MinuteDial from "../components/set-time/button/MinuteDial"
import UnboxingSchedule from "../components/set-time/UnboxingSchedule";
import { freeLetterState, questionLetterState } from "../atoms/letter/letterAtoms";
import { sendSpecialFreeGift, sendSpecialQuestionGift } from "../services/giftApi"

// 1. 이미 있는 일정 못선택하게 하기
// 2. 질문 있냐 없냐에 따라 api post
// 3. 초대장 요청

// 특별 선물 선택 이후, 화상 연결 시간 설정하는 화면
const SetTimeView = () => {
    const [unboxingTimes, setUnboxingTimes] = useState<string[] | null>(null);
    const [selectedAmPm, setSelectedAmPm] = useState<string>("오전");
    const [selectedHour, setSelectedHour] = useState<string>("1");
    const [selectedMinute, setSelectedMinute] = useState("00");
    const [disabledMinutes, setDisabledMinutes] = useState<string[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();
    const giftBoxId = 1; // TODO: 주소에서 받아오기
    const freeLetter = useRecoilValue(freeLetterState);
    const questionLetter = useRecoilValue(questionLetterState);
    const letter = questionLetter.question ? questionLetter : freeLetter;

    // Unboxing Schedule 불러오기
    const handleTimeFetched = useCallback((times: string[] | null) => {
        console.log("Fetched unboxingTimes:", times);
        setUnboxingTimes(times);
    }, []); // 빈 배열을 사용하여 함수 객체를 고정

    // 12시간제를 24시간제로 변환
    const convertTo24Hour = (amPm: string, hour: string) => {
        let hour24 = parseInt(hour, 10);
        if (amPm === "오후" && hour24 !== 12) hour24 += 12;
        if (amPm === "오전" && hour24 === 12) hour24 = 0;
        return hour24;
    };

    // 특정 시간에 따른 비활성화된 분 계산
    const calculateDisabledMinutes = (amPm: string, hour: string) => {
        if (!unboxingTimes) return [];
        const hour24 = convertTo24Hour(amPm, hour);
        return unboxingTimes
            .filter((time) => time.startsWith(hour24.toString().padStart(2, "0")))
            .map((time) => time.split(":")[1]); // 비활성화된 분만 추출
    };

    // AM/PM 변경
    const handleAmPmChange = (amPm: string) => {
        setSelectedAmPm(amPm);
        const updatedDisabledMinutes = calculateDisabledMinutes(amPm, selectedHour);
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
        try {
            // 24시간 형식 변환
            const hour24 = convertTo24Hour(selectedAmPm, selectedHour);
            const unBoxingTime = `${hour24.toString().padStart(2, "0")}:${selectedMinute}`;

            console.log("저장된 값:", { unBoxingTime }); // 디버깅 출력

            // 질문이 있는 경우 SpecialQuestionGift API 호출
            if (questionLetter.question) {
                await sendSpecialQuestionGift(
                    giftBoxId,
                    questionLetter.nickname,
                    questionLetter.question,
                    questionLetter.answer,
                    unBoxingTime
                );
            } else {
                // 질문이 없는 경우 SpecialFreeGift API 호출
                await sendSpecialFreeGift(
                    giftBoxId,
                    freeLetter.nickname,
                    freeLetter.content,
                    unBoxingTime
                );
            }

            navigate("/sentgift");
        } catch (error) {
            console.error("Gift sending failed:", error);
        }
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

    // 삭제하기 
    const hour24 = convertTo24Hour(selectedAmPm, selectedHour);
const unBoxingTime = `${hour24.toString().padStart(2, "0")}:${selectedMinute}`;

    return (
        <div className="flex flex-col items-center justify-start min-h-screen min-w-screen relative bg-chocoletterGiftBoxBg overflow-hidden">
            {/* 모달 컴포넌트 : 카카오톡 전송 완료 안내 & 편지 전송 완료 안내 화면으로 이동 */}
            <MessageSentSuccessfullyModal
                isOpen={isModalOpen}
                onClose={closeModalAndNavigate}
            />
            
            {/* 상단 bar */}
            <div className="w-full md:max-w-sm h-[58px] px-4 py-[17px] bg-chocoletterPurpleBold flex flex-col justify-center items-center gap-[15px] fixed z-50">
                <div className="self-stretch justify-between items-center inline-flex">
                    <div className="w-6 h-6 justify-center items-center flex">
                        <GoBackButton />
                    </div>
                    <div className="text-center text-white text-2xl font-normal font-sans leading-snug">시간 선택하기</div>
                    <div className="w-6 h-6" />
                </div>
            </div>

            {/* 화면 문구 */}
            <div className="mt-24 flex w-[284px] px-[16px] py-[10px] justify-center items-center gap-[10px] rounded-[11px] bg-white">
                <p className="text-center font-sans text-[15px] leading-[22px] tracking-[-0.408px]">
                    함께 설렘을 나눌 수 있는 시간이에요. <br />
                    2월 14일, 당신만을 위한 특별한 날에<br />
                    원하시는 시각을 설정해 주세요!😊
                </p>
            </div>

            {/* 추후 삭제!! 선택된 시간 표시 */}
            {/* <div className="flex flex-col items-center p-4 w-[300px]">
                <p className="text-gray-700 text-sm text-center font-semibold">(확인용 추후 삭제 예정) <br/> 선택된 시간</p>
                <p className="text-gray-500 text-sm mb-2">2025년 2월 14일</p>
                <div className="flex gap-2 text-3xl font-bold text-chocoletterPurpleBold">
                    <span>{selectedAmPm}</span>
                    <span>{selectedHour}</span>
                    <span>시</span>
                    <span>{selectedMinute}</span>
                    <span>분</span>
                </div>
            </div> */}

            {/* JSON 형태로 전체 상태 보기 */}
            <div className="mt-4 p-4 bg-gray-200 border rounded">
            <h3 className="text-lg font-bold mb-2">Recoil 상태 확인</h3>
            <pre className="text-sm">{JSON.stringify({ ...letter, unBoxingTime }, null, 2)}</pre>
            </div>
            
            {/* 다이얼 */}
            {/* TODO : mt-[78px] */}
            <div className="relative w-[252px] h-[252px] flex flex-row items-center mt-[20px] gap-[10px] ">
                {/* 흰색 박스 */}
                <div className="absolute z-10 w-[252px] h-[80px] bg-white rounded-[10px] border border-black"></div>
                
                {/* 다이얼 */}
                <div className="relative z-20 flex flex-row items-center justify-center gap-[10px]">
                    <AmPmDial onAmPmChange={handleAmPmChange} />
                    <HourDial onHourChange={handleHourChange} />
                    <div className="text-[40px] leading-[50px] tracking-[-0.408px]"> : </div>
                    <MinuteDial onHourChange={handleMinuteChange} />
                </div>
            </div>


            {/* 초콜릿 보내기 */}
            <div className="mt-[50px]">
                <Button 
                    onClick={() => {
                        sentGiftHandler();
                        saveHandler();
                    }}
                    className="flex w-[186px] h-[56px] justify-center items-center gap-[8px] shrink-0 rounded-[15px] border border-black bg-chocoletterPurpleBold text-white"
                >
                    <p className="text-white text-center font-sans text-[21px] leading-[22px] tracking-[-0.408px]">초콜릿 보내기 📮</p>
                </Button>
            </div>
        </div>
        // <div className="relative flex flex-col items-center h-screen">
        //     {/* UnboxingSchedule: 데이터만 로드 */}
        //     <UnboxingSchedule giftBoxId={1} onTimeFetched={handleTimeFetched} />
            // >
        //     {/* 페이지 콘텐츠 */}
        //     <GoBackButton altText="뒤로가기 버튼" />
        //     <div className="absolute mt-24 flex flex-col items-center">
        //         {/* 시간 선택  */}
        //         <div className="h-[250px] flex flex-raw my-8">
        //             {/* AmPmButton */}
        //             <AmPmButton selected={selectedAmPm} onSelect={handleAmPmChange} />

        //             {/* HourDialButton */}
        //             <HourDialButton onHourChange={handleHourChange} />

        //             {/* MinuteButton */}
        //             <MinuteButton
        //                 selected={selectedMinute}
        //                 onSelect={handleMinuteChange}
        //                 disabledMinutes={disabledMinutes} // 비활성화된 분 전달
        //             />

        //             {/* <div className="flex flex-col justify-center text-3xl"> : </div> */}

        //         </div>

        //     </div>
		// </div>
	);
};

export default SetTimeView;
