import React from "react";
import { sendKakaoShare } from "../../../../../utils/sendKakaoTalk";

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
        description: "초콜릿으로 마음을 전해보세요!",
        imageUrl: "https://www.chocolate-letter.com/chocoletter_kakao_logo.png",
        link: {
          mobileWebUrl: shareLink, // (2) shareLink 사용
          webUrl: shareLink,
        },
      },
      social: {
        likeCount: 3148,
        commentCount: 213,
        sharedCount: 22894,
      },
      buttons: [
        {
          title: "상대방 선물상자 보러가기",
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
      className="w-16 h-16 flex justify-center items-center bg-yellow-300 p-1 rounded-lg border border-black transition focus:outline-none"
      aria-label="카카오톡 공유"
    >
      <img
        src="https://developers.kakao.com/assets/img/about/logos/kakaotalksharing/kakaotalk_sharing_btn_medium.png"
        alt="카카오톡 공유 보내기 버튼"
        className="w-10 h-10 opacity-80"
      />
    </button>
  );
};

export default KakaoShareButton;
