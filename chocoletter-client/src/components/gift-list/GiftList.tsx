import React, { useState, useMemo } from "react";
import { GiftOpenButton } from "./button/GiftOpenButton";
import { getGiftList } from "../../services/giftApi";

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

interface GiftListProps {
    filter: 'all' | 'general' | 'special'
}

export const GiftList: React.FC<GiftListProps> = ({filter}) => {
    // const [cachedData, setCachedData] = useState<{ [key: string]: any[]}>({});
    // const [chocolates, setChocolates] = useState<any[]>([]);
    // const [isLoading, setIsLoading] = useState(false);
    // api
    // 전체
//     const getChocolates = async () => {
//         setIsLoading(true)
//         const chocolates = getGiftList(filter);
//     }

//     // Debounce 타이머를 관리하기 위한 ref
//     const debounceTimer = useRef<NodeJS.Timeout | null>(null);

//   // Throttle 타이머를 관리하기 위한 ref
//     const throttleTimer = useRef<number>(0);

//   // Debouncing 함수 구현
//     const debouncedFetchGifts = (filter: string) => {
//         // 이전 타이머를 취소
//         if (debounceTimer.current) {
//         clearTimeout(debounceTimer.current);
//         }

//     // 새 타이머 설정
//         debounceTimer.current = setTimeout(async () => {
//             if (cachedData[filter]) {
//                 setChocolates(cachedData[filter]);
//                 return;
//             }

//         const data = await fetchGifts(filter);
//         setCachedData((prev) => ({ ...prev, [filter]: data }));
//         setChocolates(data);
//         }, 300); // 300ms 디바운스
//     };

//     // Throttling 함수 구현
//     const throttledFetchGifts = async (filter: string) => {
//         const now = Date.now();

//         // 마지막 호출 시간이 현재 시간보다 오래되었으면 실행
//         if (now - throttleTimer.current > 1000) { // 1초 스로틀링
//         throttleTimer.current = now;

//         if (cachedData[filter]) {
//             setChocolates(cachedData[filter]);
//             return;
//         }

//         const data = await fetchGifts(filter);
//         setCachedData((prev) => ({ ...prev, [filter]: data }));
//         setChocolates(data);
//         }
//     };

//     // 필터 변경 시 Debouncing 또는 Throttling 함수 호출
//     useEffect(() => {
//         debouncedFetchGifts(filter); // 또는 throttledFetchGifts(filter)
//     }, [filter]);

    // const App = () => {
    // const [filter, setFilter] = useState<"all" | "general" | "special">("all");

    return (
        <div className="bg-hrtColorPurple w-88 grid grid-cols-3 gap-4 overflow-y-auto scrollbar-hidden p-4 max-h-[13rem]">
            {/* api 연동 후 추가 수정 */}
            {dummyChocolates.map((chocolate) => (
                <GiftOpenButton key={chocolate.giftId} giftId={chocolate.giftId} giftType={chocolate.giftType} isOpened={chocolate.isOpened} unboxingTime={chocolate.unBoxingTime}/>
            ))}
        </div>
    )
};
