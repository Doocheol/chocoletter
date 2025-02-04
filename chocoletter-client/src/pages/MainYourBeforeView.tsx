import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { isLoginAtom } from "../atoms/auth/userAtoms";

import { FaUserCircle } from "react-icons/fa";

import Backdrop from "../components/common/Backdrop";
import MyPage from "../components/my-page/MyPage";
import { ImageButton } from "../components/common/ImageButton";

// 이미지 및 버튼 파일들
import giftbox_before_5 from "../assets/images/giftbox/giftbox_before_5.svg";
import gift_send_button from "../assets/images/button/gift_send_button.svg";
// 선물상자 배경 이미지를 background-image로 사용
import my_count_background from "../assets/images/main/my_count_background.svg";
import NotLoginModal from "../components/main/your/before/modal/NotLoginModal";
import WhiteDayCountdownModal from "../components/main/your/before/modal/WhiteDayCountdownModal";
import { getGiftBoxName } from "../services/giftBoxApi";
// 공통 Loading 컴포넌트 (페이지 전체를 덮을 Loading)
import Loading from "../components/common/Loading";

const DEFAULT_GIFTBOX_NAME = "초코레터";

const MainYourBeforeView: React.FC = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const { giftBoxId } = useParams<{ giftBoxId: string }>(); // URL에서 giftBoxId 추출

	// 선물상자에 표시할 이름과 로딩 상태
	const [recipientNickname, setRecipientNickname] = useState<string>("");
	const [isGiftBoxNameLoaded, setIsGiftBoxNameLoaded] =
		useState<boolean>(false);

	const isLoggedIn = useRecoilValue(isLoginAtom);

	const [isProfileOpen, setIsProfileOpen] = useState(false);
	const [isNotLoginModalOpen, setIsNotLoginModalOpen] = useState(false);

	const handleProfile = () => {
		if (!isLoggedIn) {
			setIsNotLoginModalOpen(true);
			return;
		}
		setIsProfileOpen((prev) => !prev);
	};

	const handleSendGift = () => {
		if (!isLoggedIn) {
			setIsNotLoginModalOpen(true);
			return;
		}
		navigate(`/select-letter/${giftBoxId}`);
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

	// giftBoxId가 있을 경우, 상대방 이름을 조회하여 설정합니다.
	useEffect(() => {
		if (giftBoxId) {
			getGiftBoxName(giftBoxId).then((name) => {
				// API에서 반환한 값이 유효한지 확인 (공백이나 빈 값이면 false)
				const validName =
					name && name.trim() !== "" ? name.trim() : null;

				if (validName) {
					setRecipientNickname(validName);
					localStorage.setItem("giftBoxName", validName);
				} else {
					// 로컬에 저장된 값이 있는지 확인
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
				// API 호출이 끝나면 렌더링 flag를 true로 전환
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
					className="mt-10 mb-10 mx-auto relative flex items-center justify-center"
					style={{
						backgroundImage: `url(${my_count_background})`,
						backgroundSize: "cover",
						backgroundPosition: "center",
						width: "70%",
						height: "100px", // 적절한 높이 (필요에 따라 조정)
					}}
				>
					<div className="flex flex-col items-center px-10 py-8 relative text-2xl">
						<div className="flex flex-row max-w-sm">
							<div className="mb-1">{recipientNickname}</div>님의
							선물상자
						</div>
					</div>
				</div>

				<div className="flex flex-col items-center pl-10 mb-6">
					<img
						src={giftbox_before_5}
						alt="giftbox_before_5"
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
