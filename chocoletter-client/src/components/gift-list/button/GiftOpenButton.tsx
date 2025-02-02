import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AnnounceDontOpenModal } from "../modal/AnnounceDontOpenModal";
import { IsOpenGeneralGiftModal } from "../modal/IsOpenGeneralGiftModal";
import { ImageButton } from "../../common/ImageButton";
import { getGiftDetail } from "../../../services/giftApi";
import { useRecoilState } from "recoil";
import { selectedGiftIdAtom } from "../../../atoms/gift/giftAtoms";
import outline_choco_button from '../../../assets/images/giftbox/outline_choco_button.svg';
import bg_choco_button from '../../../assets/images/giftbox/bg_choco_button.svg'
import {UnboxingTimeSticker} from "../UnboxingTimeSticker"

const generalImages = import.meta.glob("../../../assets/images/chocolate/general/*.png", {
  eager: true,
});
const specialImages = import.meta.glob("../../../assets/images/chocolate/special/*.png", {
  eager: true,
});
const generalChocos = Object.values(generalImages).map(
  (module) => (module as { default: string }).default
);
const specialChocos = Object.values(specialImages).map(
  (module) => (module as { default: string }).default
);

// 더미 데이터
const giftData = [
    { nickName: "Amy", content: "Why", question: "wow", answer: "sad" },
    { nickName: "Temmy", content: "하이", question: "null", answer: "null" },
    { nickName: "Poty", content: "null", question: "when", answer: "where" },
    { nickName: "Yumi", content: "thankyou", question: "wow", answer: "sad" },
    { nickName: "Posty", content: "qwer", question: "asdf", answer: "zxcv" },
    { nickName: "chicky", content: "null", question: "I do", answer: "Do I?" },
];

interface GiftOpenButtonProps {
    giftId: string;
    giftType: string;
    isOpened: boolean;
    unboxingTime: string | null;
}

export const GiftOpenButton: React.FC<GiftOpenButtonProps> = ({ giftId, giftType, isOpened, unboxingTime }) => {
    const [isRTC, setIsRTC] = useState(false);
    const [isNonOpen, setIsNonOpen] = useState(false);
    const navigate = useNavigate();
    const [atomGiftId, setAtomGiftId] = useRecoilState(selectedGiftIdAtom)

    const [buttonImage, setButtonImage] = useState("");

    // 초콜릿 정보 가져오기
    const getGiftDetailCall = async () => {
        try {
            const res = await getGiftDetail(giftId);
            return res.data;
        } catch (err) {
            console.log(err);
        }
    };

  // 1. 안 열린 일반 초콜릿
  // 횟수를 사용하는 모달로 안내

  // 2. 열린 일반 초콜릿
  // 바로 편지로 이동

  // 3. RTC 초콜릿
  // 열지 못한다는 안내 모달로 이동
  // 14일 시간 지난 경우 

  // localStorage에서 이미지 로드
    useEffect(() => {
        const savedImage = localStorage.getItem(`giftImage_${giftId}`);
        if (savedImage) {
        setButtonImage(savedImage);
        } else {
        let chocoRandomImage;
        if (giftType === "SPECIAL") {
            chocoRandomImage = specialChocos[Math.floor(Math.random() * specialChocos.length)];
        } else {
            chocoRandomImage = generalChocos[Math.floor(Math.random() * generalChocos.length)];
        }

        setButtonImage(chocoRandomImage);
        localStorage.setItem(`giftImage_${giftId}`, chocoRandomImage);
        }
        console.log(giftId, savedImage);
    }, []);

    const closeRTCModal = () => {
        setIsRTC(false);
    };

    const closeGeneralModal = () => {
        setIsNonOpen(false);
    };

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
        <div className="relative aspect-square rounded-lg flex items-center justify-center">
            <AnnounceDontOpenModal isOpen={isRTC} onClose={closeRTCModal} />
            <IsOpenGeneralGiftModal isOpen={isNonOpen} onClose={closeGeneralModal} />
            <div className="[&>button>img]:w-[55%] [&>button>img]:h-[55%] [&>button>img]:hover:scale-110">
                <ImageButton src={buttonImage} onClick={giftOpenButtonClickHandler} className="absolute inset-0 w-full h-full aspect-square rounded-xl flex items-center justify-center z-10 bg-no-repeat" />
            </div>
            <img src={bg_choco_button} alt="버튼 배경" className="absolute inset-0 w-full h-full pointer-events-none" />
            <img src={outline_choco_button} alt="테두리" className="absolute inset-0 w-full h-full pointer-events-none z-30" />
            {!isOpened && <UnboxingTimeSticker giftType={giftType} unboxingTime={unboxingTime} />}
        </div>
    )
}