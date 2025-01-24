import { useState } from "react";
import { GoBackMainMyBeforeButton } from "../components/gift-list-before/button/GoBackMainMyBeforeButton";
import { IsOpenGeneralGiftModal } from "../components/gift-list-before/modal/IsOpenGeneralGiftModal";

const GiftListBeforeView = () => {
    const [isOpenGeneral, setIsOpenGeneral] = useState(true);
    const closeOpenGeneralModal = () => {
        setIsOpenGeneral(false)
    }

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
                    <p>qq</p>
                </div>
                <p>RTC 초콜릿은 2월 14일 표시되니 시각에 개봉 가능합니다!</p>
            </div>
        </div>
    )
};

export default GiftListBeforeView;