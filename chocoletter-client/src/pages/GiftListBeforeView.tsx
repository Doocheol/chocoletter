import { useEffect, useState } from "react";
import moment from 'moment-timezone';
import { GoBackMainMyBeforeButton } from "../components/gift-list-before/button/GoBackMainMyBeforeButton";
import { IsOpenGeneralGiftModal } from "../components/gift-list-before/modal/IsOpenGeneralGiftModal";
import { GiftOpenBeforeButton } from "../components/gift-list-before/button/GiftOpenBeforeButton";

const GiftListBeforeView = () => {
    const [currentDate, setCurrentDate] = useState('')
    const [isOpenGeneral, setIsOpenGeneral] = useState(true);
    const closeOpenGeneralModal = () => {
        setIsOpenGeneral(false)
    }

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentDate(moment().tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss'))
        }, 1000)

        return () => clearInterval(interval)
    }, [])

    return (
        <div>
            <IsOpenGeneralGiftModal isOpen={isOpenGeneral} onClose={closeOpenGeneralModal} />
            <GoBackMainMyBeforeButton />
            <div>
                <p>나의 초콜릿 박스</p>
                <div>
                    <p>개봉 가능한 일반 초콜릿 개수 : n</p>
                </div>
                {/* 초콜릿 상자 */}
                <div className="bg-hrtColorPurple ">
                    <div>
                        {/* 여기 api 연동 후 바꾸세요. 미래의 나 */}
                        <GiftOpenBeforeButton giftId={1} isOpened={true} />
                    </div>
                </div>
                <p>RTC 초콜릿은 2월 14일 표시되니 시각에 개봉 가능합니다!</p>
                <p>{currentDate}</p>
            </div>
        </div>
    )
};

export default GiftListBeforeView;