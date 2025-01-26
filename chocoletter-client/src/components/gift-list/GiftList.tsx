import React from "react";
import { GiftOpenButton } from "./button/GiftOpenButton";
import { useFetchChocolates } from "../../hooks/useGetChocolates";
import Loading from "../common/Loading";

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

    return (
        <div className="bg-hrtColorPurple w-88 grid grid-cols-3 gap-4 overflow-y-auto scrollbar-hidden p-4 max-h-[13rem]">
            {/* api 연동 후 추가 수정 */}
            {dummyChocolates.map((chocolate) => (
                <GiftOpenButton key={chocolate.giftId} giftId={chocolate.giftId} giftType={chocolate.giftType} isOpened={chocolate.isOpened} unboxingTime={chocolate.unBoxingTime}/>
            ))}
        </div>
    )
};
