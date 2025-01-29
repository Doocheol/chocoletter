import React from "react";
import Modal from "../../common/Modal";
import { Button } from "../../common/Button";
import readLetterIcon from "../../../assets/images/letter/letter_icon.svg"

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
                className="flex w-[361px] p-[20px_23px] flex-col items-center justify-center gap-[24px]"
            >
                <img src={readLetterIcon} alt="편지 보기 아이콘" />
                <p className="text-center font-sans text-[18px] leading-[22px] tracking-[-0.408px]">
                    발렌타인데이의 설렘을 담아 편지를 보냈어요. 💌
                </p>
                <p className="text-center font-[Pretendard] text-[13px] leading-[140%]">
                    상대방이 시간을 수락하면 알림을 보내드릴 예정입니다 😊 <br/>
                    만약 상대방이 시간을 거절하더라도 걱정하지 마세요! <br/>
                    편지는 무사히 상대방에게 전달됩니다.
                </p>    
                <Button onClick={onClose} className="flex w-[267px] h-[45px] justify-center items-center gap-[8px] rounded-[15px] border bg-[#9E4AFF]">
                    <p className="text-white text-center text-[18px] leading-[22px] tracking-[-0.408px]">확인</p>
                </Button>
            </Modal>
        </div>
    )
}

export default MessageSentSuccessfullyModal;
