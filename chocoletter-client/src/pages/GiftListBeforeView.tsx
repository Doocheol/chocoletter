import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { GoBackMainMyButton } from "../components/gift-list/button/GoBackMainMyButton";
import { changeKSTDate } from "../utils/changeKSTDate";
import { GiftList } from "../components/gift-list/GiftList";
import { countMyGiftBox } from "../services/giftBoxApi";
import { availableGiftsAtom } from "../atoms/gift/giftAtoms";

const GiftListBeforeView = () => {
    const [currentDate, setCurrentDate] = useState('')
    const [remainOpenCount, setRemainOpenCount] = useRecoilState(availableGiftsAtom)

    useEffect(() => {
        const interval = setInterval(() => {
            const nowDate = new Date().toISOString();
            const KSTDate = changeKSTDate({'givenDate': nowDate, 'format': 'YYYY-MM-DD HH:mm' })
            setCurrentDate(KSTDate)
        }, 1000)

        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        const getCanOpenGiftCount = async () => {
            try {
                const response = await countMyGiftBox();
                setRemainOpenCount(response.canOpenGiftCount)
            } catch (err) {
                console.log(err)
            }
        }

        getCanOpenGiftCount();
    }, [remainOpenCount, setRemainOpenCount])

    return (
        <div>
            <GoBackMainMyButton />
            <div className="flex flex-col items-center justify-center min-h-screen">
                <p>나의 초콜릿 박스</p>
                <div className="my-5">
                    <p>개봉 가능한 일반 초콜릿 개수 : {remainOpenCount}</p>
                </div>
                <GiftList filter={"all"} />
                <p className="text-sm mt-5">특별 초콜릿은 2월 14일<br/> 표시된 시각에 개봉 가능합니다!</p>
                <p>{currentDate}</p>
            </div>
        </div>
    )
};

export default GiftListBeforeView;