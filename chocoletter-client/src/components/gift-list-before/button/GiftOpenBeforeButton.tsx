import React, {useState} from "react";
import { AnnounceDontOpenModal } from "../modal/announceDontOpenModal";
import { Button } from "../../common/Button";

interface GiftOpenBeforeButtonProps {
    giftId: number;
}

export const GiftOpenBeforeButton: React.FC<GiftOpenBeforeButtonProps> = () => {
    const [isRTC, setIsRTC] = useState(false);
    // 임시 초콜릿
    const chocoType = 'Special'

    // 1. 안 열린 일반 초콜릿
    // 횟수를 사용하는 모달로 안내

    // 2. 열린 일반 초콜릿
    // 바로 편지로 이동

    // 3. RTC 초콜릿
    // 열지 못한다는 안내 모달로 이동
    const openRTC = () => {
        setIsRTC(true);
    }

    const closeRTCModal = () => {
        setIsRTC(false);
    }

    // 버튼 onClick 메서드
    const giftOpenButtonClickHandler = () => {
        if (chocoType === 'Special') {
            openRTC();
        }
    }

    return (
        <div>
            <AnnounceDontOpenModal isOpen={isRTC} onClose={closeRTCModal} />
            <Button onClick={giftOpenButtonClickHandler}>버튼</Button>
        </div>
    )
}