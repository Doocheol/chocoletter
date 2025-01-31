import React from "react";
import { sendKakaoShare } from "../../../../../utils/sendKakaoTalk";
import after_giftbox from "../../../../../assets/images/main/after_giftbox.svg";

interface KakaoShareButtonProps {
	shareLink: string; // 부모(ShareModal)에서 받은 공유 링크
}

const KakaoShareButton: React.FC<KakaoShareButtonProps> = ({ shareLink }) => {
	const handleKakaoShare = () => {
		// Kakao 링크에 사용될 옵션
		const shareContent: Kakao.ShareOptions = {
			objectType: "feed",
			content: {
				title: "초코레터",
				description: "#초콜릿 #편지 #익명 #롤링페이퍼 #타임캡슐",
				// (1) 이미지 URL -> afterGiftBox (임포트한 실제 경로가 빌드시 절대경로로 변환)
				imageUrl: after_giftbox,
				link: {
					mobileWebUrl: shareLink, // (2) shareLink 사용
					webUrl: shareLink,
				},
			},
			social: {
				likeCount: 777,
				commentCount: 777,
				sharedCount: 777,
			},
			buttons: [
				{
					title: "상대방 선물상자 바로가기",
					link: {
						mobileWebUrl: shareLink,
						webUrl: shareLink,
					},
				},
			],
		};

		// 실제 공유 호출
		sendKakaoShare(shareContent);
	};

	return (
		<button
			onClick={handleKakaoShare}
			className="flex justify-center items-center border border-black rounded-xl transition focus:outline-none p-1 bg-yellow-300"
			aria-label="카카오톡 공유"
		>
			<img
				src="https://developers.kakao.com/assets/img/about/logos/kakaotalksharing/kakaotalk_sharing_btn_medium.png"
				alt="카카오톡 공유 보내기 버튼"
				className="w-20 h-14 opacity-80"
			/>
		</button>
	);
};

export default KakaoShareButton;
