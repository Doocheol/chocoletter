import { useState } from "react";
import { useRecoilState } from "recoil";
import { useNavigate } from "react-router";
import { Button } from "../../common/Button";
import { PurpleButton } from "../../common/PurpleButton";
import { disPreviewCoin } from "../../../services/giftBoxApi";
import { EmergeProblemModal } from "../../gift-list/modal/EmergeProblemModal";
import { availableGiftsAtom } from "../../../atoms/gift/giftAtoms";

interface CheckLetterUseButtonProps {
    onClick: () => void,
}

export const CheckLetterUseButton = ({ onClick }: CheckLetterUseButtonProps) => {
    const [isPropblemOpen, setIsProblemOpen] = useState(false);
    const [remainOpenCount, setRemainOpenCount] = useRecoilState(availableGiftsAtom)
    const navigate = useNavigate();
    const checkLetterClickHandler = async () => {
        const response = await disPreviewCoin();
        
        if (response?.status === 200) {
            // 전역 힌트 개수 줄임
            setRemainOpenCount((prev) => Math.max(prev - 1, 0))
            // 기존 모달 지우고
            onClick();
            // 편지함으로 이동
            // 이전에서 atom에 giftId는 기록해 두었음.
            navigate('/letter')
            // isOpened를 true로 변경(이부분 없네..?)
        } else {
            // 새로운 모달 띄움(문제 발생)
            console.log(response?.status);
            setIsProblemOpen(true);
        }
    }

    const allModalCloseHandler = () => {
        setIsProblemOpen(false);
        onClick();
    }

    return(
        <>
            <EmergeProblemModal isOpen={isPropblemOpen} onClose={allModalCloseHandler} />
            <PurpleButton onClick={checkLetterClickHandler} className="text-white bg-chocoletterPurpleBold border border-black">
                사용하기
            </PurpleButton>
        </>
    )
}