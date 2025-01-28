import { useRecoilValue } from "recoil";
import { selectedGiftTypeAtom } from "../atoms/gift/giftAtoms";
import { FilterButton } from "../components/gift-list-event/button/FilterButton";
import { GoBackMainMyButton } from "../components/gift-list/button/GoBackMainMyButton";
import { GiftList } from "../components/gift-list/GiftList";

const GiftListEventView = () => {
    const filterType = useRecoilValue(selectedGiftTypeAtom)

    return (
        <div>
            <div className="flex flex-col items-center justify-center lg:min-h-screen min-w-screen relative bg-chocoletterGiftBoxBg overflow-hidden top-0">
                <div className="w-full h-[clamp(101px, 18dvh, 140px)] md:max-w-sm px-4 py-[17px] bg-chocoletterPurpleBold flex-col justify-center items-center gap-[15px] inline-flex fixed top-0">
                    <div className="self-stretch justify-between items-center inline-flex">
                        <div className="w-6 h-6 justify-center items-center flex overflow-hidden">
                            <GoBackMainMyButton />
                        </div>
                        <div className="text-center text-white text-2xl font-normal font-sans leading-snug">나의 초콜릿 박스</div>
                        <div className="w-6 h-6" />
                    </div>
                    <div className="px-[15px] py-[5px] bg-black/40 rounded-[18px] justify-start items-center gap-1 inline-flex">
                        <FilterButton />
                    </div>
                </div>
                <GiftList filter={filterType} />
            </div>
        </div>
    )
}

export default GiftListEventView;