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
            const currentDate = new Date().toISOString();
            const currentDay = changeKSTDate({'givenDate': currentDate, 'format':'DD'});
            if (currentDay !== '14') {
                setComment(
                    <>
                        <p>특별 초콜릿은 2월 14일</p>
                        <p>⭐약속한 시간⭐에만 열 수 있어요!</p>
                    </>);
            } else {
                setComment('⭐약속한 시간⭐을 기다려주세요❣️')
            }
        }

        openAnnounce()
    }, [])

    return(
        <div>
            <Modal isOpen={isOpen} onClose={onClose}>
                <p>{comment}</p>
            </Modal>
        </div>
    )
}