import { OtherModal } from "../../common/OtherModal";
import { PurpleButton } from "../../common/PurpleButton";

interface EmergeProblemProps {
    isOpen: boolean,
    onClose: () => void,
}

export const EmergeProblemModal = ({ isOpen, onClose }: EmergeProblemProps) => {  
    return (
        <>
            <OtherModal isOpen={isOpen} onClose={onClose}>
                <div className="text-center">
                    <p className="pb-3">횟수가 부족해요!</p>
                    <p>사람들에게 편지를 더 받아서</p>
                    <p>초콜릿을 열어보세요💕</p>
                </div>
                <PurpleButton onClick={onClose} className="!bg-chocoletterPurpleBold !py-2 border-solid">확인</PurpleButton>
            </OtherModal>
        </>
    )
}