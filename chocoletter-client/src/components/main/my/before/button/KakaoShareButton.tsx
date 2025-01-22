import React from "react";
import { sendKakaoShare } from "../../../../../utils/sendKakaoTalk";

const KakaoShareButton: React.FC = () => {
	const handleKakaoShare = () => {
		const shareContent = {
			title: "딸기 치즈 케익",
			description: "#케익 #딸기 #삼평동 #카페 #분위기 #소개팅",
			imageUrl:
				"http://k.kakaocdn.net/dn/Q2iNx/btqgeRgV54P/VLdBs9cvyn8BJXB3o7N8UK/kakaolink40_original.png",
			link: {
				mobileWebUrl: "https://developers.kakao.com",
				webUrl: "https://developers.kakao.com",
			},
		};

		sendKakaoShare(shareContent);
	};

	return (
		<button
			onClick={handleKakaoShare}
			className="flex flex-col items-center"
		>
			<img
				src="https://developers.kakao.com/assets/img/about/logos/kakaotalksharing/kakaotalk_sharing_btn_medium.png"
				alt="카카오톡 공유 보내기 버튼"
				className="w-10 h-10"
			/>
			<span className="text-sm text-gray-700">카카오톡 공유</span>
		</button>
	);
};

export default KakaoShareButton;
