import React, { useEffect, useState } from "react";
import { OtherModal } from "../../common/OtherModal";
import { PurpleButton } from "../../common/PurpleButton";

interface AnnounceDontOpenModalProps {
    isOpen: boolean,
    onClose: () => void,
}

export const AnnounceDontOpenModal: React.FC<AnnounceDontOpenModalProps> = ({ isOpen, onClose }) => {
    const [comment, setComment] = useState<JSX.Element | string>('');

    useEffect(() => {
        const openAnnounce = async () => {
                setComment(
                    <div>
                        <p>특별 초콜릿은</p>
                        <p>⭐2월 14일 약속한 시간⭐에만</p>
                        <p>열 수 있어요!</p>
                    </div>
                );
        }

        openAnnounce()
    }, [])

    return(
        <div>
            <OtherModal isOpen={isOpen} onClose={onClose}>
                {comment}
                <PurpleButton onClick={onClose} className="!bg-chocoletterPurpleBold !py-2 border-solid" >확인</PurpleButton>
            </OtherModal>
        </div>
    )
}