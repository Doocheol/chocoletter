import React from "react";
import Modal from "../../common/Modal";
import { Button } from "../../common/Button";

interface MessageSentSuccessfullyProps {
    isOpen: boolean;
    onClose: () => void;
}

const MessageSentSuccessfullyModal: React.FC<MessageSentSuccessfullyProps> = ({ isOpen, onClose }) => {
    return (
        <div>
            <Modal
            isOpen={isOpen}
            onClose={onClose}
            className="w-[300px] h-[400px]"
            >
                <h1 className="text-xl font-bold mb-4">
                    카카오톡으로 상대방에게 편지를 함께 열어볼 시간을 물어봤어요! 💌
                </h1>
                <h3 className="text-sm mb-12 text-gray-500">
                    상대방이 시간을 수락하면 약속된 시간에 화상으로 연결됩니다.
                    만약 일정이 맞지 않다면, 최대 3번까지 시간을 재설정해서 다시 요청할 수 있어요.
                    발렌타인데이의 특별한 순간을 위해 조금만 더 기다려주세요!✨
                </h3>    
                <Button onClick={onClose}>확인</Button>
            </Modal>
        </div>
    )
}

export default MessageSentSuccessfullyModal;