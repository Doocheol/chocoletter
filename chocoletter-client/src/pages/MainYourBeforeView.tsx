import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { isLoginAtom } from "../atoms/auth/userAtoms";

import { FaUserCircle } from "react-icons/fa";

import Backdrop from "../components/common/Backdrop";
import MyPage from "../components/my-page/MyPage";
import { ImageButton } from "../components/common/ImageButton";

import giftbox_before_5 from "../assets/images/giftbox/giftbox_before_5.svg";
import gift_send_button from "../assets/images/button/gift_send_button.svg";
import my_count_background from "../assets/images/main/my_count_background.svg";
import NotLoginModal from "../components/main/your/before/modal/NotLoginModal";
import WhiteDayCountdownModal from "../components/main/your/before/modal/WhiteDayCountdownModal";
import { getGiftBoxName } from "../services/giftBoxApi";

// 새로 추가한 getGiftBoxName 함수를 import 합니다.

const MainYourBeforeView: React.FC = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const { giftBoxId } = useParams<{ giftBoxId: string }>(); // URL에서 giftBoxId 추출

	// 초기값은 빈 문자열로 처리하여, API 호출 후 업데이트 하도록 함.
	const [recipientNickname, setRecipientNickname] = useState<string>("");

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

	// 기존 코드
	// const handleGoToLogin = () => {
	//   navigate("/", { state: { redirect: location.pathname } });
	// };

	// 수정된 코드: redirect 정보를 쿼리 파라미터로 전달
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
				if (name) {
					setRecipientNickname(name);
				} else {
					// 조회 실패 시 기본값 처리
					setRecipientNickname("초코레터");
				}
			});
		}
	}, [giftBoxId]);

	return (
		<div className="flex justify-center w-full">
			<div className="w-full max-w-sm min-h-screen h-[calc(var(--vh)*100)] flex flex-col bg-gradient-to-b from-[#E6F5FF] to-[#F4D3FF]">
				{/* 상단 아이콘 바 */}
				<div className="mt-6 ml-6 flex items-center justify-end">
					<button onClick={handleProfile} className="mr-6">
						<FaUserCircle className="w-6 h-6 text-chocoletterPurpleBold hover:text-chocoletterPurple" />
					</button>
				</div>

				{/* 상대방의 선물상자 컨테이너 */}
				<div className="mt-10 mb-10 mx-auto relative">
					<img
						src={my_count_background}
						alt="Background"
						className="absolute inset-0 w-full h-full object-cover"
					/>
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
