import React, { useState, useEffect } from "react";
import { useNavigate, useLocation  } from "react-router-dom";
import { GoBackButton } from "../components/common/GoBackButton";
import LetterInChatModal from "../components/chat-room/modal/LetterInChatModal";
import LetterInChatOpenButton from "../components/chat-room/button/LetterInChatOpenButton";

const ChatRoonView = () => {
    const location = useLocation();
    const sender = location.state?.nickName;
    const roomId = location.state?.roomId;
    const [isOpenLetter, setIsOpenLetter] = useState(false);

    // TODO : 데이터 get
    // 더미데이터
    const Letters = [
        {
            nickName: "예슬", 
            content: "내가 누구게 ?????",
            question: null,
            answer: null
        },
        
        {
            nickName: "준희",
            content: null,
            question: "우리 둘이 함께했던 장소 중에서 가장 기억에 남는 곳은 어디야?",
            answer: "롯데타워"
        }
    ]

    const ReceivedData = Letters.find(letter => letter.nickName === sender);

    return (
        // TODO : 스타일 추후에 파일 따로 빼기
        <div className="flex flex-col items-center justify-start min-h-screen min-w-screen relative bg-chocoletterGiftBoxBg overflow-hidden">
            <LetterInChatModal
                isOpen={isOpenLetter}
                onClose={() => setIsOpenLetter(false)}
                nickName={sender}
                content={ReceivedData?.content ?? ""} 
                question={ReceivedData?.question ?? ""}
                answer={ReceivedData?.answer ?? ""}
            />
            {/* 상단바 */}
            <div className="w-full md:max-w-sm h-[58px] px-4 py-[17px] bg-chocoletterPurpleBold flex flex-col justify-center items-center gap-[15px] fixed z-50">
                <div className="self-stretch justify-between items-center inline-flex">
                    <div className="w-6 h-6 justify-center items-center flex">
                        <GoBackButton />
                    </div>
                    <div className="text-center text-white text-2xl font-normal font-sans leading-snug">{sender}님과의 채팅방</div>
                    <div className="w-6 h-6"><LetterInChatOpenButton onPush={() => setIsOpenLetter(true)} /></div>
                </div>
            </div>
            {/* 채팅 내용 */}
            <div className="w-full md:max-w-[343px] flex flex-col space-y-[15px] justify-start items-stretch mt-[58px] pt-4" >
            </div>
            {/* 입력창  */}
            <div>

            </div>
        </div>
    )
};

export default ChatRoonView;