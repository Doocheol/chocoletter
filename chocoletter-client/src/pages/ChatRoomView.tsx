import React, { useState, useEffect } from "react";
import { useNavigate, useLocation  } from "react-router-dom";
import { GoBackButton } from "../components/common/GoBackButton";
import LetterInVideoModal from "../components/video-waiting-room/modal/LetterInVideoModal";
import LetterInVideoOpenButton from "../components/video-waiting-room/button/LetterInVideoOpenButton";

const ChatRoonView = () => {
    const location = useLocation();
    const nickName = location.state?.nickName;
    const [isOpenLetter, setIsOpenLetter] = useState(false);

    return (
        // TODO : 스타일 추후에 파일 따로 빼기
        <div className="flex flex-col items-center justify-start min-h-screen min-w-screen relative bg-chocoletterGiftBoxBg overflow-hidden">
            <LetterInVideoModal
                isOpen={isOpenLetter}
                onPush={() => setIsOpenLetter(false)}
                sender="송신자"
                receiver="수신자"
            />
            {/* 나의 채팅방 목록 */}
            <div className="w-full md:max-w-sm h-[58px] px-4 py-[17px] bg-chocoletterPurpleBold flex flex-col justify-center items-center gap-[15px] fixed z-50">
                <div className="self-stretch justify-between items-center inline-flex">
                    <div className="w-6 h-6 justify-center items-center flex">
                        <GoBackButton />
                    </div>
                    <div className="text-center text-white text-2xl font-normal font-sans leading-snug">{nickName}</div>
                    <div className="w-6 h-6"><LetterInVideoOpenButton onPush={() => setIsOpenLetter(true)} /></div>
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