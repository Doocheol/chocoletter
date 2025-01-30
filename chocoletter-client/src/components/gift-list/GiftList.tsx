import React from "react";
import { GiftOpenButton } from "./button/GiftOpenButton";
import { useFetchChocolates } from "../../hooks/useGetChocolates";
import Loading from "../common/Loading";
import classes from "../../styles/outGiftBoxChoco.module.css"

// 초콜릿 더미 데이터
const dummyChocolates = [
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
    {'giftId': 12, 'giftType': "GENERAL", 'isOpened': false, "unBoxingTime": null},
    {'giftId': 13, 'giftType': "GENERAL", 'isOpened': true, "unBoxingTime": null},
    {'giftId': 14, 'giftType': "SPECIAL", 'isOpened': false, "unBoxingTime": "2025-02-14T18:40:00.000Z"},
    {'giftId': 15, 'giftType': "GENERAL", 'isOpened': false, "unBoxingTime": null},
    {'giftId': 16, 'giftType': "GENERAL", 'isOpened': true, "unBoxingTime": null},
    {'giftId': 17, 'giftType': "SPECIAL", 'isOpened': false, "unBoxingTime": "2025-02-14T18:50:00.000Z"},
    {'giftId': 18, 'giftType': "GENERAL", 'isOpened': false, "unBoxingTime": null},
    {'giftId': 19, 'giftType': "GENERAL", 'isOpened': true, "unBoxingTime": null},
    {'giftId': 20, 'giftType': "SPECIAL", 'isOpened': false, "unBoxingTime": "2025-02-14T19:00:00.000Z"},
]

type FilterType = 'all' | 'general' | 'special'
interface GiftListProps {
    filter: FilterType,
}

export const GiftList: React.FC<GiftListProps> = ({filter}) => {
    const { data: chocolates, isLoading } = useFetchChocolates(filter);

    if (isLoading) {
        return <Loading />; // 로딩 상태 표시
    }
    console.log(chocolates)
    return (
        <div className={`w-full grid grid-cols-3 gap-4 overflow-y-auto scrollbar-hidden px-4 py-4 mt-[110px]`}>
            {/* api 연동 후 추가 수정 */}
            {chocolates.map((chocolate) => (
                <GiftOpenButton key={chocolate.giftId} giftId={chocolate.giftId} giftType={chocolate.giftType} isOpened={chocolate.isOpened} unboxingTime={chocolate.unBoxingTime}/>
            ))}
        </div>
    )
};
