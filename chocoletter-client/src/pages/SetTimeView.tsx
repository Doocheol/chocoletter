import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { toast } from "react-toastify";
import { GoBackButton } from "../components/common/GoBackButton";
import MessageSentSuccessfullyModal from "../components/set-time/modal/MessageSentSuccessfullyModal";
import AmPmDial from "../components/set-time/button/AmPmDial";
import HourDial from "../components/set-time/button/HourDial";
import MinuteDial from "../components/set-time/button/MinuteDial";
import { freeLetterState, questionLetterState } from "../atoms/letter/letterAtoms";
import { sendSpecialFreeGift, sendSpecialQuestionGift } from "../services/giftEncryptedApi";
import { getUnboxingSchedule } from "../services/unboxingApi";
import { CantSendMessageModal } from "../components/common/CantSendMessageModal";
import set_time_box_white from "../assets/images/letter/set_time_box_white.svg";
import set_time_box_gray from "../assets/images/letter/set_time_box_gray.svg";
import { ImageButton } from "../components/common/ImageButton";
import set_time_purple_button from "../assets/images/button/set_time_purple_button.svg";
import set_time_gray_button from "../assets/images/button/set_time_gray_button.svg";

const SetTimeView = () => {
    const [disableTimes, setDisableTimes] = useState<string[]>([]);
    const [selectedAmPm, setSelectedAmPm] = useState<string>("오전");
    const [selectedHour, setSelectedHour] = useState<string>("1");
    const [selectedMinute, setSelectedMinute] = useState("00");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);
    const [hasToastShown, setHasToastShown] = useState(false);
    const { giftBoxId } = useParams<{ giftBoxId: string }>();
    const freeLetter = useRecoilValue(freeLetterState);
    const questionLetter = useRecoilValue(questionLetterState);
    const [alreadySent, setAlreadySent] = useState(false);
    const navigate = useNavigate();

    // 12시간제 -> 24시간제 변환
    const convertTo24Hour = (amPm: string, hour: string) => {
        let hour24 = parseInt(hour, 10);
        if (amPm === "오후" && hour24 !== 12) hour24 += 12;
        if (amPm === "오전" && hour24 === 12) hour24 = 0;
        return hour24;
    };

    // 예약 불가능한 시간 불러오기
    useEffect(() => {
        const fetchDisableTimes = async () => {
            try {
                const data = await getUnboxingSchedule(giftBoxId as string);
                if (data && data.unboxingTimes) {
                    setDisableTimes(data.unboxingTimes);
                };
            } catch (error: any) {
                return null;
            }
        };
        fetchDisableTimes();
    }, [giftBoxId]);

    // 예약 가능한 시간인지 확인
    useEffect(() => {
        const hour24 = convertTo24Hour(selectedAmPm, selectedHour);
        const currentTime = `${hour24.toString().padStart(2, "0")}:${selectedMinute}`;
        const disabled = disableTimes.includes(currentTime);
        const toastId = "time-disabled-toast";
        setIsDisabled(disabled);

        if (disabled && !toast.isActive(toastId)) {
            toast.error("해당 시간은 이미 예약되었습니다.", {
                toastId,
                position: "top-center",
                autoClose: 2000,
            });
        }

        if (!disabled) {
            setHasToastShown(false);
        }
    }, [selectedAmPm, selectedHour, selectedMinute, disableTimes, hasToastShown]);

    // 화상통화 일정 요청하기
    const saveHandler = async () => {
        const hour24 = convertTo24Hour(selectedAmPm, selectedHour);
        const unBoxingTime = `${hour24.toString().padStart(2, "0")}:${selectedMinute}`;
        if (disableTimes.includes(unBoxingTime)) return;

        try {
            // 질문 편지인 경우
            if (questionLetter.question) {
                await sendSpecialQuestionGift(
                    giftBoxId as string,
                    questionLetter.nickname,
                    questionLetter.question,
                    questionLetter.answer,
                    unBoxingTime
                );
            // 자유 편지인 경우
            } else {
                await sendSpecialFreeGift(
                    giftBoxId as string,
                    freeLetter.nickname,
                    freeLetter.content,
                    unBoxingTime
                );
            }
            setIsModalOpen(true);
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || "알 수 없는 에러 발생";
            if (errorMessage === "ERR_ALREADY_EXISTS_GIFT") {
                setAlreadySent(true);
            } else {
                new Error(errorMessage);
            }
        }
    };

    // 모달 닫고 페이지 이동
    const closeModalAndNavigate = () => {
        setIsModalOpen(false);
        navigate("/sent-gift");
    };

    return (
        <div className="flex flex-col items-center justify-start min-h-screen min-w-screen relative bg-chocoletterGiftBoxBg overflow-hidden">
        {/* 상단바 */}
        <div className="w-full md:max-w-sm h-[58px] px-4 py-[17px] bg-chocoletterPurpleBold flex flex-col justify-center items-center gap-[15px] fixed z-50">
            <div className="self-stretch justify-between items-center inline-flex">
                <div className="w-6 h-6 flex justify-center items-center">
                    <GoBackButton />
                </div>
                <div className="text-center text-white text-2xl font-normal font-sans leading-snug">
                    시간 선택하기
                </div>
                <div className="w-6 h-6" />
            </div>
        </div>
        {/* 문구 */}
        <div className="mt-24 flex flex-col w-[284px] px-[16px] py-[10px] justify-center items-center gap-[10px] rounded-[11px] bg-white">
            <p className="text-center text-[15px] leading-[22px] tracking-[-0.408px]">
            2월 14일, 설렘 가득한 순간을 함께하세요. <br />
            영상통화로 연결될 시간을 선택해 주세요!
            <br />
            </p>
            <p className="text-center text-[12px] leading-[22px] text-gray-500 tracking-[-0.408px]">
            혹시 상대방이 시간을 거절하더라도 걱정하지 마세요! <br />
            편지는 안전하게 상대방에게 전달됩니다.
            <br />
            </p>
        </div>
        {/* 시간 선택 */}
        <div className="relative w-[252px] h-[252px] flex flex-row items-center mt-[58px] gap-[10px] ">
            <div className="absolute z-10 w-[252px] h-[80px]">
            <img src={isDisabled ? set_time_box_gray : set_time_box_white} alt="" />
            </div>
            <div className="relative z-20 flex flex-row items-center justify-center gap-[10px]">
            <AmPmDial onAmPmChange={setSelectedAmPm} />
            <HourDial onHourChange={setSelectedHour} />
            <div className="text-[40px] leading-[50px] tracking-[-0.408px]"> : </div>
            <MinuteDial onHourChange={setSelectedMinute} />
            </div>
        </div>
        {/* 보내기 버튼 */}
        <div className="mt-[50px]">
            <ImageButton
            onClick={!isDisabled ? saveHandler : undefined}
            src={isDisabled ? set_time_gray_button : set_time_purple_button}
            className={`${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
            />
        </div>
            
        <MessageSentSuccessfullyModal isOpen={isModalOpen} onClose={closeModalAndNavigate} />
        <CantSendMessageModal isOpen={alreadySent} onClose={() => setAlreadySent(false)} />
        </div>
    );
};

export default SetTimeView;
