import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { useRecoilValue } from "recoil";
import { toast } from "react-toastify"; 
import { Button } from "../components/common/Button";
import { GoBackButton } from "../components/common/GoBackButton";
import MessageSentSuccessfullyModal from "../components/set-time/modal/MessageSentSuccessfullyModal";
import AmPmDial from "../components/set-time/button/AmPmDial"
import HourDial from "../components/set-time/button/HourDial"
import MinuteDial from "../components/set-time/button/MinuteDial"
import UnboxingSchedule from "../components/set-time/UnboxingSchedule";
import { freeLetterState, questionLetterState } from "../atoms/letter/letterAtoms";
import { sendSpecialFreeGift, sendSpecialQuestionGift } from "../services/giftApi"
import { getUnboxingSchedule, sendUnboxingTime } from "../services/unboxingApi";

// 1. 이미 있는 일정 못선택하게 하기
// 2. 질문 있냐 없냐에 따라 api post ⭕
// 3. 초대장 요청

// 특별 선물 선택 이후, 화상 연결 시간 설정하는 화면
const SetTimeView = () => {
    const [disableTimes, setDisableTimes] = useState<string[]>([]);
    const [selectedAmPm, setSelectedAmPm] = useState<string>("오전");
    const [selectedHour, setSelectedHour] = useState<string>("1");
    const [selectedMinute, setSelectedMinute] = useState("00");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);
    const [hasToastShown, setHasToastShown] = useState(false); // 토스트 상태
    const { giftBoxId } = useParams<{ giftBoxId: string }>();
    const freeLetter = useRecoilValue(freeLetterState);
    const questionLetter = useRecoilValue(questionLetterState);
    const letter = questionLetter.question ? questionLetter : freeLetter;
    const navigate = useNavigate();

    // 이미 설정된 Unboxing Schedule 불러오기
    useEffect(() => {
        const fetchDisableTimes = async () => {
            try {
                const data = await getUnboxingSchedule(giftBoxId as string);
                if (data && data.unboxingTimes) {
                    setDisableTimes(data.unboxingTimes);
                    console.log("Fetched disableTimes:", data.unboxingTimes);
                } else {
                    console.error("No unboxing times received from API");
                }
            } catch (error) {
                console.error("Error fetching unboxing times:", error);
            }
        };

        fetchDisableTimes();
    }, [giftBoxId]);

    // 12시간제를 24시간제로 변환
    const convertTo24Hour = (amPm: string, hour: string) => {
        let hour24 = parseInt(hour, 10);
        if (amPm === "오후" && hour24 !== 12) hour24 += 12;
        if (amPm === "오전" && hour24 === 12) hour24 = 0;
        return hour24;
    };

    // 현재 선택된 시간 체크
    useEffect(() => {
        const hour24 = convertTo24Hour(selectedAmPm, selectedHour);
        const currentTime = `${hour24.toString().padStart(2, "0")}:${selectedMinute}`;
        const disabled = disableTimes.includes(currentTime);

        setIsDisabled(disabled);

        const toastId = "time-disabled-toast"; 

        if (disabled && !toast.isActive(toastId)) {
            toast.error("해당 시간은 이미 예약되었습니다.", {
                toastId, // 고유 ID를 설정해 중복 방지
                position: "bottom-center",
                autoClose: 3000,
                hideProgressBar: true,
                pauseOnHover: false,
                draggable: true,
                style: {
                    backgroundColor: "#2C2F33",
                    color: "#FFFFFF",
                    borderRadius: "8px",
                    padding: "16px",
                    fontSize: "14px", 
                    fontWeight: "bold",
                    textAlign: "center",
                    marginBottom: "100px",
                    maxWidth: "300px",
                },
            });
        }

        if (!disabled) {
            setHasToastShown(false);
        }
    }, [selectedAmPm, selectedHour, selectedMinute, disableTimes, hasToastShown]);
        
    // 선택된 시간을 서버에 저장하기
    const saveHandler = async () => {
        const hour24 = convertTo24Hour(selectedAmPm, selectedHour);
        const unBoxingTime = `${hour24.toString().padStart(2, "0")}:${selectedMinute}`;
        if (disableTimes.includes(unBoxingTime)) return;

        try {
            // console.log("저장된 값:", { unBoxingTime }); // 디버깅 출력

            // `sendUnboxingTime` API 호출
            // const response = await sendUnboxingTime(giftId, unBoxingTime);
            // if (response) {
            //     console.log("Unboxing Time 전송 성공:", response);
            // } else {
            //     throw new Error("Unboxing Time 전송 실패");
            // }

            // 질문이 있는 경우 SpecialQuestionGift API 호출
            if (questionLetter.question) {
                await sendSpecialQuestionGift(
                    giftBoxId as string,
                    questionLetter.nickname,
                    questionLetter.question,
                    questionLetter.answer,
                    unBoxingTime
                );
            } else {
                // 질문이 없는 경우 SpecialFreeGift API 호출
                console.log(giftBoxId, freeLetter.nickname, freeLetter.content, unBoxingTime)
                await sendSpecialFreeGift(
                    giftBoxId as string,
                    freeLetter.nickname,
                    freeLetter.content,
                    unBoxingTime
                );
            }
            setIsModalOpen(true); // 카카오톡 전송 완료 모달 띄우기
        } catch (error) {
            console.error("Gift sending failed:", error);
        }
    };

    // 모달 닫기 + 페이지 이동
    const closeModalAndNavigate = () => {
        setIsModalOpen(false);
        navigate("/sent-gift"); // 원하는 경로로 이동
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

            {/* 추후 삭제!! JSON 형태로 전체 상태 보기 */}
            {/* <div className="mt-4 p-4 bg-gray-200 border rounded">
            <h3 className="text-lg font-bold mb-2">Recoil 상태 확인</h3>
            <pre className="text-sm">{JSON.stringify({ ...letter, unBoxingTime }, null, 2)}</pre>
            </div> */}
            
            {/* 시간 선택 다이얼 */}
            {/* TODO : mt-[78px] */}
            <div className="relative w-[252px] h-[252px] flex flex-row items-center mt-[78px] gap-[10px] ">
                {/* 박스 색상 변경 */}
                <div
                    className={`absolute z-10 w-[252px] h-[80px] rounded-[10px] border border-black ${
                        isDisabled ? "bg-gray-300" : "bg-white"
                    }`}
                ></div>

                {/* 시간 선택 다이얼 */}
                <div className="relative z-20 flex flex-row items-center justify-center gap-[10px]">
                    <AmPmDial onAmPmChange={setSelectedAmPm} />
                    <HourDial onHourChange={setSelectedHour} />
                    <div className="text-[40px] leading-[50px] tracking-[-0.408px]"> : </div>
                    <MinuteDial onHourChange={setSelectedMinute} />
                </div>
            </div>


            {/* 초콜릿 보내기 */}
            <div className="mt-[50px]">
                <Button 
                    onClick={saveHandler}
                    className="flex w-[186px] h-[56px] justify-center items-center gap-[8px] shrink-0 rounded-[15px] border border-black bg-chocoletterPurpleBold text-white"
                >
                    <span className="text-white text-center font-sans text-[21px] leading-[22px] tracking-[-0.408px]">초콜릿 보내기 📮</span>
                </Button>
            </div>
        </div>
	);
};

export default SetTimeView;
