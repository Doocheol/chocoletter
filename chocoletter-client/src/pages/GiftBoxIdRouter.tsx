import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { giftBoxIdAtom } from "../atoms/auth/userAtoms";
import { isGiftBoxSelectedAtom } from "../atoms/auth/userAtoms";
import MainMyBeforeView from "./MainMyBeforeView";
import MainMyEventView from "./MainMyEventView";
import MainMyAfterView from "./MainMyAfterView";
import MainYourBeforeView from "./MainYourBeforeView";
import SelectGiftBoxView from "./SelectGiftBoxView";
import MainYourEventView from "./MainYourEventView";

const getEventDate = (): Date => {
	const raw = import.meta.env.VITE_EVENT_DAY || "0214";
	const month = Number(raw.slice(0, 2));
	const day = Number(raw.slice(2, 4));
	const currentYear = new Date().getFullYear();
	return new Date(currentYear, month - 1, day);
};

const GiftBoxIdRouter: React.FC = () => {
	const navigate = useNavigate();

	const { giftBoxId: urlGiftBoxId } = useParams<{ giftBoxId?: string }>();
	const savedGiftBoxId = useRecoilValue(giftBoxIdAtom);
	const isGiftBoxSelected = useRecoilValue(isGiftBoxSelectedAtom);

	const today = new Date();
	const eventDate = getEventDate();
	const whiteDay = new Date(eventDate);
	whiteDay.setMonth(eventDate.getMonth() + 1);

	if (
		(urlGiftBoxId && savedGiftBoxId === "") ||
		urlGiftBoxId !== savedGiftBoxId
	) {
		if (today < eventDate) {
			return <MainYourBeforeView />;
		} else {
			return <MainYourEventView />;
		}
	}

	if (
		urlGiftBoxId &&
		savedGiftBoxId !== "" &&
		urlGiftBoxId === savedGiftBoxId
	) {
		if (!isGiftBoxSelected) {
			return <SelectGiftBoxView />;
		}

		if (today < eventDate) {
			return <MainMyBeforeView />;
		} else if (today.toDateString() === eventDate.toDateString()) {
			return <MainMyEventView />;
		} else {
			return <MainMyAfterView />;
		}
	} else {
		navigate("/");
	}
};

export default GiftBoxIdRouter;
