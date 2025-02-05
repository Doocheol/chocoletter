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
                        <p><span className="text-yellow-500">2월 14일, 약속한 시간</span>에</p>
                        <p>특별 초콜릿을 열 수 있어요!</p>
                    </div>
                );
        }

        openAnnounce()
    }, [])

    return(
        <div>
            <OtherModal isOpen={isOpen} onClose={onClose} className="!gap-[14px]">
                {comment}
                <PurpleButton onClick={onClose} className="text-white bg-chocoletterPurpleBold border border-black focus:outline-none" >확인</PurpleButton>
            </OtherModal>
        </div>
    )
}