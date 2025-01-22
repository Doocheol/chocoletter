export const initializeKakao = () => {
    if (typeof window !== "undefined" && window.Kakao) {
      const kakao = window.Kakao;
      const kakaoKey = import.meta.env.VITE_KAKAOTALK_JAVASCRIPT_KEY;
  
      if (!kakao.isInitialized()) {
        kakao.init(kakaoKey);
        console.log("Kakao SDK initialized.");
      }
    }
  };
  
  interface ShareContent {
    title: string;
    description: string;
    imageUrl: string;
    link: {
      mobileWebUrl: string;
      webUrl: string;
    };
  }
  
  export const sendKakaoShare = (content: ShareContent) => {
    if (typeof window !== "undefined" && window.Kakao) {
      const kakao = window.Kakao;
  
      kakao.Share.sendDefault({
        objectType: "feed",
        content: {
          title: content.title,
          description: content.description,
          imageUrl: content.imageUrl,
          link: content.link,
        },
        social: {
          likeCount: 286,
          commentCount: 45,
          sharedCount: 845,
        },
        buttons: [
          {
            title: "웹으로 보기",
            link: {
              mobileWebUrl: content.link.mobileWebUrl,
              webUrl: content.link.webUrl,
            },
          },
          {
            title: "앱으로 보기",
            link: {
              mobileWebUrl: content.link.mobileWebUrl,
              webUrl: content.link.webUrl,
            },
          },
        ],
      });
    }
  };
  