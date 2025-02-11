import { OtherModal } from "../../common/OtherModal";
import { PurpleButton } from "../../common/PurpleButton";

interface LetterEncryptedNoneModalProps {
    isOpen: boolean;
}

export const LetterEncryptedNoneModal: React.FC<LetterEncryptedNoneModalProps> = ({ isOpen }) => {
    const onClose = () => {
        // Do something
    };

    return(
        <>
            <OtherModal isOpen={isOpen} onClose={onClose} >
                <p></p>
                <PurpleButton />
            </OtherModal>
        </>
    )
};