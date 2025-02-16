import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { GoBackButton } from "../components/common/GoBackButton";
import { freeLetterState, questionLetterState } from "../atoms/letter/letterAtoms";
import { useRecoilValue } from "recoil";
import { BsEnvelopeHeart, BsEnvelopeOpenHeart } from "react-icons/bs";
import { CantSendMessageModal } from "../components/common/CantSendMessageModal";
import { ImageButton } from "../components/common/ImageButton";
import special_gift_button from "../assets/images/button/special_gift_button.svg";
import general_gift_button from "../assets/images/button/general_gift_button.svg";
import { sendGeneralFreeGift, sendGeneralQuestionGift } from "../services/giftEncryptedApi";

function SelectGiftTypeView() {
    const freeLetter = useRecoilValue(freeLetterState);
    const questionLetter = useRecoilValue(questionLetterState);
    const [isFirstIcon, setIsFirstIcon] = useState(true);
    const navigate = useNavigate();
    const { giftBoxId } = useParams<{ giftBoxId: string }>();
    const [alreadySent, setAlreadySent] = useState(false);

    // 특별/일반 선물 선택 시, 특별 선물인 경우 특별 선물 작성 페이지로 이동
    const handleAccept = () => {
        navigate(`/set-time/${giftBoxId}`);
    };

    // 특별/일반 선물 선택 시, 일반 선물인 경우 일반 선물 작성 페이지로 이동
    const handleReject = async () => {
        try {
            if (questionLetter.question) {
                // 질문 편지인 경우
                await sendGeneralQuestionGift(
                    giftBoxId as string,
                    questionLetter.nickname,
                    questionLetter.question,
                    questionLetter.answer
                );
            } else {
                // 일반 편지인 경우
                await sendGeneralFreeGift(
                    giftBoxId as string,
                    freeLetter.nickname,
                    freeLetter.content
                );
            }
                navigate(`/sent-gift`);
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || "알 수 없는 에러 발생";
            if (errorMessage === "ERR_ALREADY_EXISTS_GIFT") {
                setAlreadySent(true);
            } else {
                new Error(errorMessage);
            }
        }
    };

    // 아이콘 애니메이션: 0.5초마다 아이콘 변경
    useEffect(() => {
        const interval = setInterval(() => {
            setIsFirstIcon((prev) => !prev);
        }, 500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col items-center justify-start min-h-screen min-w-screen relative bg-chocoletterGiftBoxBg overflow-hidden">
            {/* 상단바 */}
            <div className="w-full md:max-w-sm h-[58px] px-4 py-[17px] flex flex-col justify-center items-center gap-[15px] fixed z-50">
                <div className="self-stretch justify-between items-center inline-flex">
                    <div className="w-6 h-6 justify-center items-center flex">
                        <GoBackButton strokeColor="#9E4AFF" altText="뒤로가기 버튼" />
                    </div>
                    <div className="text-center text-white text-2xl font-normal font-sans leading-snug"></div>
                    <div className="w-6 h-6" />
                </div>
            </div>

            <div className="absolute mt-24">
                <div className="flex flex-col items-center justify-center m-4 gap-[30px]">
                    {/* 아이콘 & 문구 */}
                    <div className="w-[291px] h-[75px] flex flex-col px-[15px] gap-[20px] justify-center items-center mt-[30px] mb-[100px]">
                        <div className="flex flex-col justify-center items-center gap-[15px] ">
                            <div style={{ textAlign: "center", marginTop: "50px" }}>
                            {isFirstIcon ? (
                                <BsEnvelopeHeart className="text-chocoletterPurpleBold text-[40px] transition-opacity duration-500" />
                            ) : (
                                <BsEnvelopeOpenHeart className="text-chocoletterPurpleBold text-[40px] transition-opacity duration-500" />
                            )}
                            </div>
                            <p className="text-2xl font-bold text-center">
                                상대방과 함께  <br/> 편지를 열어보실래요?
                            </p>
                        </div>                        
                        <p className="self-stretch text-[13px] leading-[140%] text-center ">
                            원하는 시간을 상대방에게 요청하여, <br/>
                            2월 14일에 영상통화로 만나보세요!
                        </p>
                    </div>
                    {/* 버튼 */}
                    <div className="flex flex-col items-center gap-[15px]">
                        <ImageButton
                                onClick={handleAccept}
                                src={special_gift_button}
                                // className="w-[81px] h-14 flex items-center justify-center rounded-[15px] border border-black group"
                        />
                        <ImageButton
                            onClick={handleReject}
                            src={general_gift_button}
                            // className="w-[81px] h-14 flex items-center justify-center rounded-[15px] border border-black group"
                        />
                    </div>
                </div>
            </div>
            <CantSendMessageModal isOpen={alreadySent} onClose={() => setAlreadySent(false)} />
        </div>
  );
}

export default SelectGiftTypeView;
