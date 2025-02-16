import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AnnounceDontOpenModal } from "../modal/AnnounceDontOpenModal";
import { AnnounceGoNotificationModal } from "../modal/AnnounceGoNotification";
import { IsOpenGeneralGiftModal } from "../modal/IsOpenGeneralGiftModal";
import { ImageButton } from "../../common/ImageButton";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
	giftListRefreshAtom,
	selectedGiftIdAtom,
} from "../../../atoms/gift/giftAtoms";
import outline_choco_button from "../../../assets/images/giftbox/outline_choco_button.svg";
import bg_choco_button from "../../../assets/images/giftbox/bg_choco_button.svg";
import { UnboxingTimeSticker } from "../UnboxingTimeSticker";
import { toast } from "react-toastify";
import AcceptRejectModal from "../../main/my/before/modal/AcceptRejectModal";
import {
	patchUnboxingAccept,
	patchUnboxingReject,
} from "../../../services/unboxingApi";

const generalImages = import.meta.glob(
	"../../../assets/images/chocolate/general/*.svg",
	{
		eager: true,
	}
);
const specialImages = import.meta.glob(
	"../../../assets/images/chocolate/special/*.svg",
	{
		eager: true,
	}
);
const generalChocos = Object.values(generalImages).map(
	(module) => (module as { default: string }).default
);
const specialChocos = Object.values(specialImages).map(
	(module) => (module as { default: string }).default
);

interface GiftOpenButtonProps {
	giftId: string;
	giftType: string;
	isOpened: boolean;
	unboxingTime: string | null;
	isAccepted?: boolean;
	roomId?: string | null;
	onRefresh: () => void;
}

const getEventDate = (): Date => {
	const raw = import.meta.env.VITE_EVENT_DAY || "0214";
	// raw가 "0214" 형식이면 앞의 두 자리는 월, 뒤의 두 자리는 일
	const month = Number(raw.slice(0, 2));
	const day = Number(raw.slice(2, 4));
	const currentYear = new Date().getFullYear();
	// JavaScript Date는 month가 0부터 시작하므로 month - 1
	return new Date(currentYear, month - 1, day);
};

const compareDates = (current: Date, eventday: Date) => {
	if (
		current.getFullYear() === eventday.getFullYear() &&
		current.getMonth() === eventday.getMonth() &&
		current.getDate() === eventday.getDate()
	) {
		return true;
	}

	return false;
};

export const GiftOpenButton: React.FC<GiftOpenButtonProps> = ({
	giftId,
	giftType,
	isOpened,
	unboxingTime,
	isAccepted,
	roomId,
	onRefresh,
}) => {
	const [isRTC, setIsRTC] = useState(false);
	const [isNonOpen, setIsNonOpen] = useState(false);
	// const [isAnnounceNoti, setIsAnnounceNoti] = useState(false);
	const [isAcceptRejectOpen, setIsAcceptRejectOpen] = useState(false);
	const navigate = useNavigate();
	const [atomGiftId, setAtomGiftId] = useRecoilState(selectedGiftIdAtom);
	const refresh = useRecoilValue(giftListRefreshAtom); // refresh 값을 모니터링

	const [buttonImage, setButtonImage] = useState("");
	const currentDate = new Date();

	// refresh 값이 변경되면 AcceptRejectModal을 자동으로 닫음
	useEffect(() => {
		setIsAcceptRejectOpen(false);
	}, [refresh]);

	// localStorage에서 이미지 로드
	useEffect(() => {
		const savedImage = localStorage.getItem(`giftImage_${giftId}`);
		if (savedImage) {
			setButtonImage(savedImage);
		} else {
			let chocoRandomImage;
			if (giftType === "SPECIAL") {
				chocoRandomImage =
					specialChocos[
						Math.floor(Math.random() * specialChocos.length)
					];
			} else {
				chocoRandomImage =
					generalChocos[
						Math.floor(Math.random() * generalChocos.length)
					];
			}

			setButtonImage(chocoRandomImage);
			localStorage.setItem(`giftImage_${giftId}`, chocoRandomImage);
		}
	}, []);

	const closeRTCModal = () => {
		setIsRTC(false);
	};

	const closeGeneralModal = () => {
		setIsNonOpen(false);
	};

	const closeAcceptRejectModal = () => {
		setIsAcceptRejectOpen(false);
	};

	// 버튼 onClick 메서드
	const giftOpenButtonClickHandler = async () => {
		if (giftType === "SPECIAL") {
			if (isAccepted) {
				setIsRTC(true);
			} else {
				setIsAcceptRejectOpen(true);
			}
		} else {
			setAtomGiftId(giftId);
			if (isOpened) {
				navigate("/letter");
			} else {
				setIsNonOpen(true);
			}
		}
	};

	// 수락 처리: giftId가 존재할 경우 patchUnboxingAccept API 호출
	const handleAccept = async () => {
		try {
			const result = await patchUnboxingAccept(giftId);
			setIsAcceptRejectOpen(false);
			onRefresh();
		} catch (error) {
			new Error("수락 처리 중 에러 발생");
		}
	};

	// 거절 처리: giftId가 존재할 경우 patchUnboxingReject API 호출
	const handleReject = async () => {
		try {
			const result = await patchUnboxingReject(giftId);
			setIsAcceptRejectOpen(false);
			onRefresh();
		} catch (error) {
			new Error("거절 처리 중 에러 발생");
		}
	};

	return (
		<div className="relative w-[100px] h-full aspect-square rounded-lg flex items-center justify-center">
			{isAcceptRejectOpen && (
				<AcceptRejectModal
					onClose={closeAcceptRejectModal}
					onAccept={handleAccept}
					onReject={handleReject}
				/>
			)}
			<AnnounceDontOpenModal isOpen={isRTC} onClose={closeRTCModal} />
			<IsOpenGeneralGiftModal
				isOpen={isNonOpen}
				onClose={closeGeneralModal}
			/>
			<div
				className={`[&>button>img]:w-[55%] [&>button>img]:h-[55%] ${
					isRTC || isNonOpen
						? "[&>button>img]:scale-125"
						: "[&>button>img]:hover:scale-125"
				}`}
			>
				<ImageButton
					src={buttonImage}
					onClick={giftOpenButtonClickHandler}
					className="absolute inset-0 w-full h-full aspect-square rounded-xl flex items-center justify-center z-10 bg-no-repeat"
				/>
			</div>
			<img
				src={bg_choco_button}
				alt="버튼 배경"
				className="absolute inset-0 w-full h-full pointer-events-none"
			/>
			<img
				src={outline_choco_button}
				alt="테두리"
				className="absolute inset-0 w-full h-full pointer-events-none z-30"
			/>
			<UnboxingTimeSticker
				giftType={giftType}
				unboxingTime={unboxingTime}
				isOpened={isOpened}
				isAccepted={isAccepted}
			/>
		</div>
	);
};
