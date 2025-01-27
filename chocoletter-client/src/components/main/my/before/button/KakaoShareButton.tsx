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
      // className="flex justify-center items-center bg-chocoletterBackground-light rounded-lg shadow hover:bg-sky-100 border border-black"
      className="flex justify-center items-center border border-black rounded-xl transition focus:outline-none p-1 bg-yellow-300 hover:bg-yellow-100"
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
