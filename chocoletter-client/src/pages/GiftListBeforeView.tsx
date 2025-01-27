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
            <div className="flex flex-col items-center justify-center min-h-screen min-w-screen relative bg-chocoletterGiftBoxBg overflow-hidden">
                <div className="w-full h-[101px] px-4 py-[17px] bg-chocoletterPurpleBold flex-col justify-center items-center gap-[15px] inline-flex fixed top-0">
                    <GoBackMainMyButton />
                    <div className="self-stretch justify-between items-center inline-flex">
                        <div className="w-6 h-6 justify-center items-center flex overflow-hidden">
                            <div className="w-6 h-6 relative flex-col justify-start items-start flex overflow-hidden" />
                        </div>
                        <div className="text-center text-white text-2xl font-normal font-sans leading-snug">나의 초콜릿 박스</div>
                        <div className="w-6 h-6 relative overflow-hidden">
                            <div className="w-6 h-6 left-0 top-0 absolute" />
                            <div className="w-6 h-6 left-0 top-0 absolute justify-center items-center inline-flex">
                                <div className="w-6 h-6 relative flex-col justify-start items-start flex overflow-hidden" />
                            </div>
                        </div>
                    </div>
                    <div className="px-[15px] py-[5px] bg-black/40 rounded-[18px] justify-start items-center gap-1 inline-flex">
                        <div className="text-center text-white text-[13px] font-normal font-['Pretendard'] leading-[18.20px]">현재 개봉 가능한 초콜릿 : </div>
                        <div className="justify-start items-center flex">
                            <div className="text-center text-white text-[13px] font-normal font-['Pretendard'] leading-[18.20px]">{remainOpenCount}</div>
                            <div className="text-center text-white text-[13px] font-normal font-['Pretendard'] leading-[18.20px]">개</div>
                        </div>
                    </div>
                </div>
                <GiftList filter={"all"} />
                <p className="text-sm mt-5">특별 초콜릿은 2월 14일<br/> 표시된 시각에 개봉 가능합니다!</p>
                <p>{currentDate}</p>
            </div>
        </div>
    )
};

export default GiftListBeforeView;