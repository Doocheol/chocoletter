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
            <div className="flex flex-col items-center justify-center min-h-screen min-w-screen relative bg-chocoletterGiftBoxBg overflow-hidden top-0">
                <div className="w-full md:max-w-sm h-[clamp(101px, 18dvh, 140px)] px-4 py-[17px] bg-chocoletterPurpleBold flex-col justify-center items-center gap-[15px] inline-flex fixed top-0 z-50">
                    <div className="self-stretch justify-between items-center inline-flex">
                        <div className="w-6 h-6 justify-center items-center flex overflow-hidden">
                            <GoBackMainMyButton />
                        </div>
                        <div className="text-center text-white text-2xl font-normal font-sans leading-snug">나의 초콜릿 박스</div>
                        <div className="w-6 h-6" />
                    </div>
                    <div className="px-[15px] py-[5px] bg-black/40 rounded-[18px] justify-start items-center gap-1 inline-flex">
                        <div className="text-center text-white text-sm font-normal font-pretendard leading-[18.20px]">현재 개봉 가능한 초콜릿 : {remainOpenCount}개</div>
                    </div>
                </div>
                <GiftList filter={"all"} />
                <div>
                    <p>{currentDate}</p>
                </div>
            </div>
        </div>
    )
};

export default GiftListBeforeView;