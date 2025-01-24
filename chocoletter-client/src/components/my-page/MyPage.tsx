import React from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { toast } from "react-toastify";

import {
	isLoginAtom,
	userNameAtom,
	userProfileUrlAtom,
} from "../../atoms/auth/userAtoms";
import { receivedGiftsAtom, sentGiftsAtom } from "../../atoms/gift/giftAtoms";

/**
 * 프로필 드롭다운 내용
 */
const MyPage: React.FC = () => {
	const [isLogin, setIsLogin] = useRecoilState(isLoginAtom);
	const userName = useRecoilValue(userNameAtom);
	const userProfileUrl = useRecoilValue(userProfileUrlAtom);

	// 보낸/받은 초콜릿
	const sentGifts = useRecoilValue(sentGiftsAtom);
	const receivedGifts = useRecoilValue(receivedGiftsAtom);

	const handleLogout = () => {
		setIsLogin(false);
		toast.info("로그아웃 되었습니다.");
	};

	return (
		<div className="p-4 w-64">
			{/* 프로필 영역 */}
			<div className="flex items-center mb-3">
				<img
					src={userProfileUrl || ""}
					alt="프로필 사진"
					className="w-10 h-10 rounded-full object-cover mr-2"
				/>
				<div>
					<div className="font-bold text-gray-800">
						{userName || "Guest"}
					</div>
				</div>
			</div>

			<hr className="my-2" />

			{/* 통계: 가로 배치 (보낸 왼쪽, 받은 오른쪽) */}
			<div className="flex flex-row justify-between items-center text-sm text-gray-700 mb-4">
				<div>
					<div className="font-semibold text-gray-600">보냄</div>
					<div>{sentGifts}개</div>
				</div>
				<div className="border-r border-gray-300 h-8 mx-2" />
				<div>
					<div className="font-semibold text-gray-600">받음</div>
					<div>{receivedGifts}개</div>
				</div>
			</div>

			<hr className="my-2" />

			{/* 로그아웃 버튼 */}
			<button
				onClick={handleLogout}
				className="w-full py-2 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm"
			>
				초코레터 떠나기
			</button>
		</div>
	);
};

export default MyPage;
