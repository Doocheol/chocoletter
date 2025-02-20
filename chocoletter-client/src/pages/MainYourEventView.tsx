import React, { useState, useEffect, useMemo, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { giftBoxIdAtom, isLoginAtom } from "../atoms/auth/userAtoms";

import { FaUserCircle } from "react-icons/fa";

import Backdrop from "../components/common/Backdrop";
import MyPage from "../components/my-page/MyPage";
import { ImageButton } from "../components/common/ImageButton";

import giftbox_before_12 from "../assets/images/giftbox/giftbox_before_12.svg";
import giftbox_before_22 from "../assets/images/giftbox/giftbox_before_22.svg";
import giftbox_before_32 from "../assets/images/giftbox/giftbox_before_32.svg";
import giftbox_before_42 from "../assets/images/giftbox/giftbox_before_42.svg";
import giftbox_before_52 from "../assets/images/giftbox/giftbox_before_52.svg";
import tutorial_icon from "../assets/images/main/tutorial_icon.svg";
import my_count_background from "../assets/images/main/my_count_background.svg";
import NotLoginModal from "../components/main/your/before/modal/NotLoginModal";
import WhiteDayCountdownModal from "../components/main/your/before/modal/WhiteDayCountdownModal";
import { getGiftBoxName } from "../services/giftBoxApi";
import { ForwardTutorialOverlay } from "../components/tutorial/ForwardTutorialOverlay";
import Loading from "../components/common/Loading";
import { removeUserInfo } from "../services/userApi";
import my_chocolate_box_move_button from "../assets/images/main/my_chocolate_box_move_button.svg";

const DEFAULT_GIFTBOX_NAME = "초코레터";

const giftboxImages: { [key: number]: string } = {
	1: giftbox_before_12,
	2: giftbox_before_22,
	3: giftbox_before_32,
	4: giftbox_before_42,
	5: giftbox_before_52,
};

const MainYourEventView: React.FC = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const setIsLogin = useSetRecoilState(isLoginAtom);
	const myGiftBoxId = useRecoilValue(giftBoxIdAtom);

	const { giftBoxId } = useParams<{ giftBoxId: string }>();

	const isLoggedIn = useRecoilValue(isLoginAtom);

	const tutorialIconRef = useRef<HTMLButtonElement>(null);
	const giftBoxRef = useRef<HTMLDivElement>(null);
	const dummyRef = useRef<HTMLDivElement>(null);

	if (!isLoggedIn) {
		return (
			<NotLoginModal
				isOpen={true}
				onClose={() => {}}
				onLogin={() => {
					localStorage.setItem("redirect", location.pathname);
					navigate("/");
				}}
			/>
		);
	}

	const [recipientNickname, setRecipientNickname] = useState<string>("");
	const [giftBoxType, setGiftBoxType] = useState<number>(5);
	const [isGiftBoxNameLoaded, setIsGiftBoxNameLoaded] =
		useState<boolean>(false);

	const [isProfileOpen, setIsProfileOpen] = useState(false);
	const [isNotLoginModalOpen, setIsNotLoginModalOpen] = useState(false);
	const [isTutorialModalOpen, setIsTutorialModalOpen] = useState(false);

	const handleProfile = () => {
		if (!isLoggedIn) {
			setIsNotLoginModalOpen(true);
			return;
		}
		setIsProfileOpen((prev) => !prev);
	};

	const handleTutorial = () => {
		setIsTutorialModalOpen(true);
	};

	const handleGoToMyGiftBox = async () => {
		if (!isLoggedIn) {
			setIsNotLoginModalOpen(true);
			return;
		}
		try {
			if (!giftBoxId) {
				removeUserInfo();
				setIsLogin(false);
				navigate("/");
				return;
			}
		} catch (error) {
			new Error("선물 상자 정보 조회 오류");
		}

		navigate(`/main/${myGiftBoxId}`);
	};

	const handleGoToLogin = () => {
		localStorage.setItem("redirect", location.pathname);
		navigate("/");
	};

	const today = new Date();
	const currentYear = today.getFullYear();
	const eventDate = new Date(currentYear, 1, 14); // 2월 14일
	const whiteDay = new Date(currentYear, 2, 14); // 3월 14일

	const shouldShowCountdown = today >= eventDate && today < whiteDay;
	const [isCountdownOpen, setIsCountdownOpen] = useState(shouldShowCountdown);

	const tutorialIcons = useMemo(
		() => [
			tutorialIconRef,
			dummyRef,
			dummyRef,
			dummyRef,
			dummyRef,
			dummyRef,
			dummyRef,
			giftBoxRef,
		],
		[]
	);

	useEffect(() => {
		if (giftBoxId) {
			getGiftBoxName(giftBoxId)
				.then((data) => {
					const { name, type, fillLevel } = data;
					const validName =
						name && name.trim() !== "" ? name.trim() : null;

					if (validName) {
						setRecipientNickname(validName);
						localStorage.setItem("giftBoxName", validName);
					} else {
						const storedName = localStorage.getItem("giftBoxName");
						if (storedName && storedName.trim() !== "") {
							setRecipientNickname(storedName.trim());
						} else {
							setRecipientNickname(DEFAULT_GIFTBOX_NAME);
							localStorage.setItem(
								"giftBoxName",
								DEFAULT_GIFTBOX_NAME
							);
						}
					}
					// type 값에 따라 선물상자 타입 state 업데이트 (유효한 값인지 확인)
					if (type >= 1 && type <= 5) {
						setGiftBoxType(type);
					} else {
						setGiftBoxType(5);
					}
					setIsGiftBoxNameLoaded(true);
				})
				.catch((error) => {
					setIsGiftBoxNameLoaded(true);
				});
		} else {
			setRecipientNickname(DEFAULT_GIFTBOX_NAME);
			setIsGiftBoxNameLoaded(true);
		}
	}, [giftBoxId]);

	if (!isGiftBoxNameLoaded) {
		return (
			<div className="flex justify-center items-center min-h-screen">
				<Loading />
			</div>
		);
	}

	return (
		<div className="flex justify-center w-full">
			<div className="w-full max-w-sm min-h-screen h-[calc(var(--vh)*100)] flex flex-col bg-gradient-to-b from-[#E6F5FF] to-[#F4D3FF]">
				<div ref={dummyRef} className="w-0 h-0" />
				{/* 상단 아이콘 바 */}
				<div className="mt-7 ml-6 flex items-center justify-between">
					<button onClick={handleTutorial} ref={tutorialIconRef}>
						<img
							src={tutorial_icon}
							className="w-6 h-6"
							alt="tutorial icon"
						/>
					</button>
					<button onClick={handleProfile} className="mr-5">
						<FaUserCircle className="w-6 h-6 text-chocoletterPurpleBold hover:text-chocoletterPurple" />
					</button>
				</div>

				{/* 선물상자 컨테이너 */}
				<div
					className="mt-8 mb-10 mx-auto relative flex items-center justify-center"
					style={{
						backgroundImage: `url(${my_count_background})`,
						backgroundSize: "cover",
						backgroundPosition: "center",
						width: "74%",
						aspectRatio: "258/96",
					}}
				>
					{/* 배경 위에 텍스트를 중앙 정렬 */}
					<div className="absolute inset-0 flex flex-col items-center justify-center">
						<div>
							<span className="text-2xl text-center max-w-full truncate">
								{recipientNickname}
							</span>
							<span className="text-lg text-center max-w-full truncate">
								{" "}
								님의{" "}
							</span>
						</div>
						<span className="text-lg text-center max-w-full truncate">
							초콜릿 보관함
						</span>
					</div>
				</div>

				<div
					className="flex flex-col items-center pl-10 mb-6"
					ref={giftBoxRef}
				>
					{/* giftBoxType에 따라 선물상자 이미지 동적으로 변경 */}
					<img
						src={giftboxImages[giftBoxType]}
						alt={`giftbox_before_${giftBoxType}`}
						className="p-2 max-h-60"
					/>
				</div>

				{/* 선물하기 버튼 */}
				<div className="mt-10 px-4 flex flex-row items-center justify-center">
					<div className="relative group">
						<ImageButton
							onClick={handleGoToMyGiftBox}
							src={my_chocolate_box_move_button}
							className="flex items-center justify-center heartbeat"
						/>
					</div>
				</div>

				{isNotLoginModalOpen && (
					<NotLoginModal
						isOpen={isNotLoginModalOpen}
						onClose={() => setIsNotLoginModalOpen(false)}
						onLogin={handleGoToLogin}
					/>
				)}

				{isProfileOpen && (
					<>
						<Backdrop onClick={() => setIsProfileOpen(false)} />
						<MyPage onClose={() => setIsProfileOpen(false)} />
					</>
				)}

				<WhiteDayCountdownModal
					targetDate={whiteDay}
					isOpen={isCountdownOpen}
					onClose={() => setIsCountdownOpen(false)}
				/>

				{isTutorialModalOpen && (
					<ForwardTutorialOverlay
						targetRefs={tutorialIcons}
						onClose={() => setIsTutorialModalOpen(false)}
					/>
				)}
			</div>
		</div>
	);
};

export default MainYourEventView;
