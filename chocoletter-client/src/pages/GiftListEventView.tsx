import { useRecoilValue } from "recoil";
import { selectedGiftTypeAtom } from "../atoms/gift/giftAtoms";
import { FilterButton } from "../components/gift-list-event/button/FilterButton";
import { GoBackMainMyButton } from "../components/gift-list/button/GoBackMainMyButton";
import { GiftList } from "../components/gift-list/GiftList";

const GiftListEventView = () => {
    const filterType = useRecoilValue(selectedGiftTypeAtom)

    return (
        <div>
            <GoBackMainMyButton />
            <div className="flex flex-col items-center justify-center min-h-screen w-[393px] h-[852px] relative bg-chocoletterGiftBoxBg overflow-hidden">
                <p>나의 초콜릿 박스</p>
                <FilterButton />
                <GiftList filter={filterType} />
                <p className="text-sm mt-5">표시된 시각 5분 전! 카톡 알림을 통해 입장해주세요~</p>
            </div>
        </div>
    )
}

export default GiftListEventView;