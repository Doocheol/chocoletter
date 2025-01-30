import React from "react";
import { sendKakaoShare } from "../../../../../utils/sendKakaoTalk";
import after_giftbox from "../../../../../assets/images/main/after_giftbox.svg";

const KakaoShareButton: React.FC = () => {
  const handleKakaoShare = () => {
    const shareContent: Kakao.ShareOptions = {
      objectType: "feed",
      content: {
        title: "초코레터",
        description: "#초콜릿 #편지 #익명 #롤링페이퍼 #타임캡슐",
        imageUrl: after_giftbox, // 이미지 URL 확인
        link: {
          mobileWebUrl: "https://yourdomain.com",
          webUrl: "https://yourdomain.com",
        },
      },
      social: {
        likeCount: 777,
        commentCount: 777,
        sharedCount: 777,
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
      // className="flex justify-center items-center bg-chocoletterBackground-light rounded-lg shadow hover:bg-sky-100 border border-black"
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
