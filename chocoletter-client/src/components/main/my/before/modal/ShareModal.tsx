import React, { useEffect, useState } from "react";
import { FiCopy, FiMessageCircle } from "react-icons/fi";
import { BsQrCode } from "react-icons/bs";
import Modal from "../../../../common/Modal";
import { copyToClipboard } from "../../../../../utils/copyToClipboard";
import useScript from "../../../../../hooks/useScript";
import { initializeKakao } from "../../../../../utils/sendKakaoTalk";
import KakaoShareButton from "../button/KakaoShareButton";
import { QRCodeCanvas } from "qrcode.react";
import { FaTimes } from "react-icons/fa";

import { GoLink } from "react-icons/go";
import { Button } from "../../../../common/Button";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose }) => {
  {
    /* <script src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.4/kakao.min.js"
      integrity="sha384-DKYJZ8NLiK8MN4/C5P2dtSmLQ4KwPaoqAfyA/DfmEc1VDxu4yyC7wy6K1Hs90nka" crossorigin="anonymous">
    </script>
    <script>
      Kakao.init('%VITE_KAKAOTALK_JAVASCRIPT_KEY%');
    </script> */
  }

  // Kakao SDK 스크립트 로드 (integrity 및 crossorigin 속성 추가)
  const { loaded, error } = useScript({
    src: "https://t1.kakaocdn.net/kakao_js_sdk/2.7.4/kakao.min.js",
    integrity: "sha384-DKYJZ8NLiK8MN4/C5P2dtSmLQ4KwPaoqAfyA/DfmEc1VDxu4yyC7wy6K1Hs90nka",
    crossorigin: "anonymous",
  });

  useEffect(() => {
    if (loaded && !error) {
      initializeKakao();
    } else if (error) {
      console.error("Failed to load Kakao SDK");
    }
  }, [loaded, error]);

  const serviceLink = window.location.href; // 현재 페이지 URL을 서비스 링크로 사용

  const [qrLoading, setQrLoading] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);

  const handleCopyLink = async () => {
    try {
      await copyToClipboard(serviceLink);
      alert("링크가 복사되었습니다!");
    } catch (error) {
      alert("링크 복사에 실패했습니다.");
    }
  };

  const handleShowQRCode = async () => {
    setQrLoading(true);
    // QR 코드 생성은 동기적이지만, 로딩 스피너를 보기 위해 약간의 지연을 추가합니다.
    setTimeout(() => {
      setQrLoading(false);
      setShowQRCode(true);
    }, 10); // 0.5초 지연
  };

  const handleCloseQRCode = () => {
    setShowQRCode(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onClose();
        setShowQRCode(false); // 모달 닫힐 때 QR 코드 상태도 초기화
      }}
    >
      <div className="flex flex-col items-center rounded-2xl pl-3">
        <h2 className="text-md font-thin mb-2">나도 초콜릿 받기!</h2>
        {!showQRCode ? (
          <div className="flex flex-row justify-center space-x-4 pr-3">
            {/* 링크 복사 버튼 */}
            <Button
              onClick={handleCopyLink}
              className="flex justify-center items-center bg-sky-200 p-10 rounded-lg shadow hover:bg-sky-100 border border-black"
              aria-label="링크 복사"
            >
              <GoLink className="text-3xl text-gray-700" />
            </Button>

            {/* QR 코드 생성 및 표시 버튼 */}
            <Button
              onClick={handleShowQRCode}
              className="flex justify-center items-center bg-gray-500 p-8 rounded-lg shadow hover:bg-gray-400 border border-black"
              aria-label="QR 코드 생성"
            >
              <BsQrCode className="text-3xl text-white" />
            </Button>

            {/* 카카오톡 공유 버튼 */}
            <KakaoShareButton />
          </div>
        ) : (
          <div className="flex flex-col items-center">
            {qrLoading ? (
              <div className="flex items-center justify-center w-32 h-32">
                {/* 로딩 스피너 */}
                <svg
                  className="animate-spin h-10 w-10 text-pink-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <h3 className="text-md font-semibold mb-2">{/* QR 코드 */}</h3>
                <div className="relative">
                  {/* QR 코드 렌더링 */}
                  <QRCodeCanvas value={serviceLink} size={256} />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ShareModal;
