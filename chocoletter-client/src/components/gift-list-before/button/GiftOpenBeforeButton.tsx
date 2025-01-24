import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnnounceDontOpenModal } from "../modal/announceDontOpenModal";
import { IsOpenGeneralGiftModal } from "../modal/IsOpenGeneralGiftModal";
import { Button } from "../../common/Button";
import { getGiftDetail } from "../../../services/giftApi";

interface GiftOpenBeforeButtonProps {
    giftId: number;
    isOpened: boolean;
}

export const GiftOpenBeforeButton: React.FC<GiftOpenBeforeButtonProps> = ({ giftId, isOpened }) => {
    const [isRTC, setIsRTC] = useState(false);
    const [isNonOpen, setIsNonOpen] = useState(false);
    const navigate = useNavigate();
    // 임시 초콜릿
    const chocoType = 'Special'

    // 초콜릿 정보 가져오기
    const getGiftDetailCall = async () => {
        const res = await getGiftDetail(giftId)
        return res.data;
    }

    // 1. 안 열린 일반 초콜릿
    // 횟수를 사용하는 모달로 안내

    // 2. 열린 일반 초콜릿
    // 바로 편지로 이동

    // 3. RTC 초콜릿
    // 열지 못한다는 안내 모달로 이동

    const closeRTCModal = () => {
        setIsRTC(false);
    }

    const closeGeneralModal = () => {
        setIsNonOpen(false);
    }

    // 버튼 onClick 메서드
    const giftOpenButtonClickHandler = async () => {
        const giftData = await getGiftDetailCall();
        // 나중에 giftData.chocoType으로 변경경
        if (chocoType === 'Special') {
            setIsRTC(true);
        } else {
            if (isOpened) {
                navigate('/letter', { state: {
                    nickName: giftData.nickName,
                    content: giftData.content,
                    question: giftData.question,
                    answer: giftData.answer,
                }})
            } else {
                setIsNonOpen(true);
            }
        }
    }

    return (
        <div>
            <AnnounceDontOpenModal isOpen={isRTC} onClose={closeRTCModal} />
            <IsOpenGeneralGiftModal isOpen={isNonOpen} onClose={closeGeneralModal} />
            <Button onClick={giftOpenButtonClickHandler}>버튼</Button>
        </div>
    )
}