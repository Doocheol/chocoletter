import React, { useEffect, useState } from "react";
import Modal from "../../common/Modal";
import { changeKSTDate } from "../../../utils/changeKSTDate";

interface AnnounceDontOpenModalProps {
    isOpen: boolean,
    onClose: () => void,
}

export const AnnounceDontOpenModal: React.FC<AnnounceDontOpenModalProps> = ({ isOpen, onClose }) => {
    const [comment, setComment] = useState<JSX.Element | string>('');

    useEffect(() => {
        const openAnnounce = async () => {
                setComment(
                    <>
                        <p>특별 초콜릿은 2월 14일</p>
                        <p>⭐약속한 시간⭐에만 열 수 있어요!</p>
                    </>
                );
        }

        openAnnounce()
    }, [])

    return(
        <div>
            <Modal isOpen={isOpen} onClose={onClose}>
                {comment}
            </Modal>
        </div>
    )
}