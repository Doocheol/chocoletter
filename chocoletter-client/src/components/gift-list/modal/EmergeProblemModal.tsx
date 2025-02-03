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
                <p>문제가 발생했습니다!</p>
                <PurpleButton onClick={onClose} className="!bg-chocoletterPurpleBold !py-2 border-solid">확인</PurpleButton>
            </OtherModal>
        </>
    )
}