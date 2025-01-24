import React from "react";
import Modal from "../../common/Modal";
import { Button } from "../../common/Button";

interface IsOpenGeneralGiftModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const IsOpenGeneralGiftModal: React.FC<IsOpenGeneralGiftModalProps> = ({ isOpen, onClose }) => {
    // const 

    return (
        <Modal isOpen={isOpen} onClose={onClose} >
            <p>초콜릿을 열어 편지를 확인하실건가요❓</p>
            <p>개봉 가능한 초콜릿 수가 차감됩니다❗❣️❗</p>

            <p>현재 개봉 가능한 횟수 : n개</p>
            <div>
                <Button>
                    사용하기
                </Button>
                <Button onClick={onClose}>
                    나중에 열기
                </Button>
            </div>
        </Modal>
    )
}