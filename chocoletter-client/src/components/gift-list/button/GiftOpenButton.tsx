import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnnounceDontOpenModal } from "../modal/AnnounceDontOpenModal";
import { IsOpenGeneralGiftModal } from "../modal/IsOpenGeneralGiftModal";
import { ImageButton } from "../../common/ImageButton";
import { getGiftDetail } from "../../../services/giftApi";
import { useRecoilState } from "recoil";
import { selectedGiftIdAtom } from "../../../atoms/gift/giftAtoms";

// 더미 데이터
const giftData = [
    {nickName: 'Amy', content: 'Why', question: 'wow', answer: 'sad'},
    {nickName: 'Temmy', content: '하이', question: 'null', answer: 'null'},
    {nickName: 'Poty', content: 'null', question: 'when', answer: 'where'},
    {nickName: 'Yumi', content: 'thankyou', question: 'wow', answer: 'sad'},
    {nickName: 'Posty', content: 'qwer', question: 'asdf', answer: 'zxcv'},
    {nickName: 'chicky', content: 'null', question: 'I do', answer: 'Do I?'},
]

interface GiftOpenButtonProps {
    giftId: number,
    giftType: string,
    isOpened: boolean,
    unboxingTime: string | null,
}

export const GiftOpenButton: React.FC<GiftOpenButtonProps> = ({ giftId, giftType, isOpened }) => {
    const [isRTC, setIsRTC] = useState(false);
    const [isNonOpen, setIsNonOpen] = useState(false);
    const navigate = useNavigate();
    const [atomGiftId, setAtomGiftId] = useRecoilState(selectedGiftIdAtom)

    // 초콜릿 정보 가져오기
    const getGiftDetailCall = async () => {
        try {
            const res = await getGiftDetail(giftId)
            return res.data;
        } catch (err) {
            console.log(err)
        }
    }

    // 1. 안 열린 일반 초콜릿
    // 횟수를 사용하는 모달로 안내

    // 2. 열린 일반 초콜릿
    // 바로 편지로 이동

    // 3. RTC 초콜릿
    // 열지 못한다는 안내 모달로 이동

    const closeRTCModal = () => {
        setIsRTC(false);
    }

    const closeGeneralModal = () => {
        setIsNonOpen(false);
    }

    // 버튼 onClick 메서드
    const giftOpenButtonClickHandler = async () => {
        // const giftData = await getGiftDetailCall();
        // 나중에 giftData.chocoType으로 변경
        const giftDatum = giftData[Math.floor(Math.random() * 10)]
        if (giftType === 'SPECIAL') {
            setIsRTC(true);
        } else {
            setAtomGiftId(giftId);
            if (isOpened) {
                navigate('/letter', { state: {
                    nickName: giftDatum.nickName,
                    content: giftDatum.content,
                    question: giftDatum.question,
                    answer: giftDatum.answer,
                }})
            } else {
                setIsNonOpen(true);
            }
        }
    }

    return (
        <div>
            <AnnounceDontOpenModal isOpen={isRTC} onClose={closeRTCModal} />
            <IsOpenGeneralGiftModal isOpen={isNonOpen} onClose={closeGeneralModal} />
            <ImageButton onClick={giftOpenButtonClickHandler}>
                <p>{giftType}</p>
                <p>{isOpened}</p>
            </ImageButton>
        </div>
    )
}