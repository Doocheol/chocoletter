import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { isLoginAtom } from "../atoms/auth/userAtoms";

import { FaUserCircle } from "react-icons/fa";

import Backdrop from "../components/common/Backdrop";
import MyPage from "../components/my-page/MyPage";
import { ImageButton } from "../components/common/ImageButton";

// 이미지 및 버튼 파일들
import giftbox_before_1 from "../assets/images/giftbox/giftbox_before_1.svg";
import giftbox_before_2 from "../assets/images/giftbox/giftbox_before_2.svg";
import giftbox_before_3 from "../assets/images/giftbox/giftbox_before_3.svg";
import giftbox_before_4 from "../assets/images/giftbox/giftbox_before_4.svg";
import giftbox_before_5 from "../assets/images/giftbox/giftbox_before_5.svg";
import gift_send_button from "../assets/images/button/gift_send_button.svg";
// 선물상자 배경 이미지를 background-image로 사용
import my_count_background from "../assets/images/main/my_count_background.svg";
import NotLoginModal from "../components/main/your/before/modal/NotLoginModal";
import WhiteDayCountdownModal from "../components/main/your/before/modal/WhiteDayCountdownModal";
import AlreadySentModal from "../components/main/your/before/modal/AlreadySentModal";
import { getGiftBoxName, verifyGiftSend } from "../services/giftBoxApi";
// 공통 Loading 컴포넌트 (페이지 전체를 덮을 Loading)
import Loading from "../components/common/Loading";
import { removeUserInfo } from "../services/userApi";

const DEFAULT_GIFTBOX_NAME = "초코레터";

// giftBoxType에 따른 이미지 매핑
const giftboxImages: { [key: number]: string } = {
	1: giftbox_before_1,
	2: giftbox_before_2,
	3: giftbox_before_3,
	4: giftbox_before_4,
	5: giftbox_before_5,
};

const MainYourBeforeView: React.FC = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const setIsLogin = useSetRecoilState(isLoginAtom);

	const { giftBoxId } = useParams<{ giftBoxId: string }>(); // URL에서 giftBoxId 추출

	// 로그인 여부 확인
	const isLoggedIn = useRecoilValue(isLoginAtom);

	// 로그인 상태가 아니라면 바로 NotLoginModal만 렌더링
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

	// 선물상자에 표시할 이름과 로딩 상태
	const [recipientNickname, setRecipientNickname] = useState<string>("");
	// 새로 추가된 선물상자 타입 state (기본값 5)
	const [giftBoxType, setGiftBoxType] = useState<number>(5);
	const [isGiftBoxNameLoaded, setIsGiftBoxNameLoaded] =
		useState<boolean>(false);

	const [isProfileOpen, setIsProfileOpen] = useState(false);
	const [isNotLoginModalOpen, setIsNotLoginModalOpen] = useState(false);
	const [isAlreadySentModalOpen, setIsAlreadySentModalOpen] = useState(false);

	const handleProfile = () => {
		if (!isLoggedIn) {
			setIsNotLoginModalOpen(true);
			return;
		}
		setIsProfileOpen((prev) => !prev);
	};

	// 선물하기 버튼 클릭 시, 먼저 선물 전송 여부를 확인합니다.
	const handleSendGift = async () => {
		if (!isLoggedIn) {
			setIsNotLoginModalOpen(true);
			return;
		}
		try {
			if (!giftBoxId) {
				// giftBoxId가 없으면 에러 처리
				removeUserInfo();
				setIsLogin(false);
				navigate("/");
				return;
			}
			const verifyData = await verifyGiftSend(giftBoxId);
			if (verifyData.isSend) {
				// 이미 선물이 전송된 상태라면 모달 표시
				setIsAlreadySentModalOpen(true);
			} else {
				// 선물이 아직 전송되지 않은 경우, 선물 보내기 화면으로 이동
				navigate(`/select-letter/${giftBoxId}`);
			}
		} catch (error) {
			console.error("선물 전송 여부 확인 중 오류 발생:", error);
			// removeUserInfo();
			// setIsLogin(false);
			// navigate("/");
		}
	};

	// redirect 정보를 localStorage에 저장 후 로그인 페이지로 이동
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

	// giftBoxId가 있을 경우, 상대방 선물상자 정보 조회 (이제 name과 type을 받아옴)
	useEffect(() => {
		if (giftBoxId) {
			getGiftBoxName(giftBoxId)
				.then((data) => {
					// data의 타입은 { name: string, type: number }라고 가정
					const { name, type } = data;
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
					console.error("선물상자 정보 조회 에러:", error);
					setIsGiftBoxNameLoaded(true);
				});
		} else {
			// giftBoxId가 없으면 기본값 사용
			setRecipientNickname(DEFAULT_GIFTBOX_NAME);
			setIsGiftBoxNameLoaded(true);
		}
	}, [giftBoxId]);

	// API 호출이 끝나기 전에는 전체 페이지를 Loading 컴포넌트로 대체
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
				{/* 상단 아이콘 바 */}
				<div className="mt-6 ml-6 flex items-center justify-end">
					<button onClick={handleProfile} className="mr-6">
						<FaUserCircle className="w-6 h-6 text-chocoletterPurpleBold hover:text-chocoletterPurple" />
					</button>
				</div>

				{/* 선물상자 컨테이너 */}
				<div
					className="mt-11 mb-10 mx-auto relative flex items-center justify-center"
					style={{
						backgroundImage: `url(${my_count_background})`,
						backgroundSize: "cover",
						backgroundPosition: "center",
						width: "70%",
						height: "98px", // 필요에 따라 조정
					}}
				>
					{/* 배경 위에 텍스트를 중앙 정렬 */}
					<div className="absolute inset-0 flex items-center justify-center">
						<span className="text-2xl text-center max-w-full truncate">
							{recipientNickname} 님의 선물상자
						</span>
					</div>
				</div>

				<div className="flex flex-col items-center pl-10 mb-6">
					{/* giftBoxType에 따라 선물상자 이미지 동적으로 변경 */}
					<img
						src={giftboxImages[giftBoxType]}
						alt={`giftbox_before_${giftBoxType}`}
						className="p-2 max-h-60"
					/>
				</div>

				{/* 선물하기 버튼 */}
				<div className="mt-10 px-4 flex flex-row items-center justify-center">
					<ImageButton
						onClick={handleSendGift}
						src={gift_send_button}
						className="flex items-center justify-center heartbeat"
					/>
				</div>

				{/* 로그인 필요 모달 */}
				{isNotLoginModalOpen && (
					<NotLoginModal
						isOpen={isNotLoginModalOpen}
						onClose={() => setIsNotLoginModalOpen(false)}
						onLogin={handleGoToLogin}
					/>
				)}

				{/* 이미 선물을 보냈음을 알리는 모달 */}
				{isAlreadySentModalOpen && (
					<AlreadySentModal
						isOpen={isAlreadySentModalOpen}
						onClose={() => setIsAlreadySentModalOpen(false)}
					/>
				)}

				{/* 프로필 모달 */}
				{isProfileOpen && (
					<>
						<Backdrop onClick={() => setIsProfileOpen(false)} />
						<MyPage onClose={() => setIsProfileOpen(false)} />
					</>
				)}

				{/* D-DAY 모달 (화이트데이까지 남은 일수 표시) */}
				<WhiteDayCountdownModal
					targetDate={whiteDay}
					isOpen={isCountdownOpen}
					onClose={() => setIsCountdownOpen(false)}
				/>
			</div>
		</div>
	);
};

export default MainYourBeforeView;
