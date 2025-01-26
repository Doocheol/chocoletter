import Modal from "../../common/Modal";
import { Button } from "../../common/Button";

interface EmergeProblemProps {
    isOpen: boolean,
    onClose: () => void,
}

export const EmergeProblemModal = ({ isOpen, onClose }: EmergeProblemProps) => {  
    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose}>
                <p>문제가 발생했습니다!</p>
                <Button onClick={onClose}>확인</Button>
            </Modal>
        </>
    )
}