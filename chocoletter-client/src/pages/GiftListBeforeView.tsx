import { useEffect, useState } from "react";
import { GoBackMainMyBeforeButton } from "../components/gift-list-before/button/GoBackMainMyBeforeButton";
import { IsOpenGeneralGiftModal } from "../components/gift-list-before/modal/IsOpenGeneralGiftModal";
import { GiftOpenBeforeButton } from "../components/gift-list-before/button/GiftOpenBeforeButton";
import { changeKSTDate } from "../utils/changeKSTDate";

// 초콜릿 더미 데이터
const chocolates = [
    {'giftId': 0, 'giftType': "GENERAL", 'isOpened': true, "unBoxingTime": null},
    {'giftId': 1, 'giftType': "GENERAL", 'isOpened': false, "unBoxingTime": null},
    {'giftId': 2, 'giftType': "SPECIAL", 'isOpened': false, "unBoxingTime": "2025-02-14T11:20:00.000Z"},
    {'giftId': 3, 'giftType': "GENERAL", 'isOpened': false, "unBoxingTime": null},
    {'giftId': 4, 'giftType': "GENERAL", 'isOpened': false, "unBoxingTime": null},
    {'giftId': 5, 'giftType': "GENERAL", 'isOpened': true, "unBoxingTime": null},
    {'giftId': 6, 'giftType': "SPECIAL", 'isOpened': false, "unBoxingTime": "2025-02-14T13:50:00.000Z"},
    {'giftId': 7, 'giftType': "GENERAL", 'isOpened': true, "unBoxingTime": null},
    {'giftId': 8, 'giftType': "GENERAL", 'isOpened': false, "unBoxingTime": null},
    {'giftId': 9, 'giftType': "GENERAL", 'isOpened': false, "unBoxingTime": null},
    {'giftId': 10, 'giftType': "GENERAL", 'isOpened': true, "unBoxingTime": null},
    {'giftId': 11, 'giftType': "SPECIAL", 'isOpened': false, "unBoxingTime": "2025-02-14T18:30:00.000Z"},
]

const GiftListBeforeView = () => {
    const [currentDate, setCurrentDate] = useState('')
    const [isOpenGeneral, setIsOpenGeneral] = useState(true);
    const closeOpenGeneralModal = () => {
        setIsOpenGeneral(false)
    }

    useEffect(() => {
        const interval = setInterval(() => {
            const nowDate = new Date().toISOString();
            const KSTDate = changeKSTDate({'givenDate': nowDate, 'format': 'YYYY-MM-DD HH:mm', 'isISO': 1})
            setCurrentDate(KSTDate)
        }, 1000)

        return () => clearInterval(interval)
    }, [])

    return (
        <div>
            <IsOpenGeneralGiftModal isOpen={isOpenGeneral} onClose={closeOpenGeneralModal} />
            <GoBackMainMyBeforeButton />
            <div className="flex flex-col items-center justify-center min-h-screen">
                <p>나의 초콜릿 박스</p>
                <div className="my-5">
                    <p>개봉 가능한 일반 초콜릿 개수 : n</p>
                </div>
                {/* 초콜릿 상자 */}
                <div className="bg-hrtColorPurple w-88 grid grid-cols-3 gap-4 overflow-y-auto scrollbar-hidden p-4 max-h-[13rem]">
                    {/* api 연동 후 추가 수정 */}
                    {chocolates.map((chocolate) => (
                        <GiftOpenBeforeButton giftId={chocolate.giftId} giftType={chocolate.giftType} isOpened={chocolate.isOpened} unboxingTime={chocolate.unBoxingTime} />
                    ))}
                </div>
                <p className="text-sm mt-5">특별 초콜릿은 2월 14일<br/> 표시된 시각에 개봉 가능합니다!</p>
                <p>{currentDate}</p>
            </div>
        </div>
    )
};

export default GiftListBeforeView;