import React from "react";

import Modal from "../../common/Modal";
import { Button } from "../../common/Button";

interface changeGeneralGiftProps {
    isOpen: boolean;
    onClose: () => void;
}

const changeGeneralGiftModal: React.FC<changeGeneralGiftProps> = ({ isOpen, onClose }) => {
    return (
        <div>
            <Modal isOpen={isOpen} onClose={onClose}>
                모달 테스트
                <Button onClick={onClose}>내 초콜릿 상자로 이동하기</Button>
            </Modal>
        </div>
    )
}

export default changeGeneralGiftModal;