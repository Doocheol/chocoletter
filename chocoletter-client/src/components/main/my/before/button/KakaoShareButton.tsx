// src/components/main/my/before/button/KakaoShareButton.tsx

import React from "react";
import { sendKakaoShare } from "../../../../../utils/sendKakaoTalk";

const KakaoShareButton: React.FC = () => {
	const handleKakaoShare = () => {
		const shareContent: Kakao.ShareOptions = {
			objectType: "feed",
			content: {
				title: "딸기 치즈 케익",
				description: "#케익 #딸기 #삼평동 #카페 #분위기 #소개팅",
				imageUrl:
					"https://developers.kakao.com/assets/img/about/logos/kakaotalksharing/kakaotalk_sharing_btn_medium.png", // 이미지 URL 확인
				link: {
					mobileWebUrl: "https://yourdomain.com",
					webUrl: "https://yourdomain.com",
				},
			},
			social: {
				likeCount: 100,
				commentCount: 200,
				sharedCount: 300,
			},
			buttons: [
				{
					title: "웹으로 보기",
					link: {
						mobileWebUrl: "https://yourdomain.com",
						webUrl: "https://yourdomain.com",
					},
				},
				{
					title: "앱으로 보기",
					link: {
						mobileWebUrl: "https://yourdomain.com",
						webUrl: "https://yourdomain.com",
					},
				},
			],
		};

		sendKakaoShare(shareContent);
	};

	return (
		<button
			onClick={handleKakaoShare}
			className="flex flex-col items-center p-4 bg-gray-100 rounded-lg shadow hover:bg-yellow-100 transition focus:outline-none"
			// className="flex flex-col items-center rounded hover:bg-yellow-400 transition focus:outline-none"
			aria-label="카카오톡 공유"
		>
			<img
				src="https://developers.kakao.com/assets/img/about/logos/kakaotalksharing/kakaotalk_sharing_btn_medium.png"
				alt="카카오톡 공유 보내기 버튼"
				// className="w-8 h-8"
			/>
			<span className="text-sm text-gray-700">카톡</span>
		</button>
	);
};

export default KakaoShareButton;
