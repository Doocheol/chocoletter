import React, { useEffect, useRef } from "react";
import Modal from "../../common/Modal";
import moment from 'moment-timezone';

interface AnnounceDontOpenModalProps {
    isOpen: boolean,
    onClose: () => void,
}

export const AnnounceDontOpenModal: React.FC<AnnounceDontOpenModalProps> = ({ isOpen, onClose }) => {
    const commentRef = useRef('');

    useEffect(() => {
        const openAnnounce = async () => {
            const currentDate = moment().tz('Asia/Seoul').format('DD');
            if (currentDate !== '14') {
                commentRef.current = '특별 초콜릿은 2월 14일\n⭐약속한 시간⭐에만 열 수 있어요!'
            } else {
                commentRef.current = '⭐약속한 시간⭐을 기다려주세요❣️'
            }
        }

        openAnnounce()
    }, [])

    return(
        <div>
            <Modal isOpen={isOpen} onClose={onClose}>
                <p>{commentRef.current}</p>
            </Modal>
        </div>
    )
}