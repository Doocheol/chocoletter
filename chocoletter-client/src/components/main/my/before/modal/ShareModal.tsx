import React, { useEffect } from "react";
import { FiCopy, FiMessageCircle } from "react-icons/fi";
import { BsQrCode } from "react-icons/bs";
import Modal from "../../../../common/Modal";
import { copyToClipboard } from "../../../../../utils/copyToClipboard";
// import { copyQRCode, generateQRCodeDataUrl } from "../utils/copyQRCode";
import useScript from "../../../../../hooks/useScript";
import {
	initializeKakao,
	sendKakaoShare,
} from "../../../../../utils/sendKakaoTalk";
import KakaoShareButton from "../button/KakaoShareButton";

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
		integrity:
			"sha384-DKYJZ8NLiK8MN4/C5P2dtSmLQ4KwPaoqAfyA/DfmEc1VDxu4yyC7wy6K1Hs90nka",
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

	const handleCopyLink = async () => {
		try {
			await copyToClipboard(serviceLink);
			alert("링크가 복사되었습니다!");
		} catch (error) {
			alert("링크 복사에 실패했습니다.");
		}
	};

	const handleCopyQRCode = async () => {
		try {
			await copyQRCode(serviceLink);
			alert("QR 코드가 클립보드에 복사되었습니다!");
		} catch (error) {
			alert("QR 코드 복사에 실패했습니다.");
		}
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<div className="flex flex-col items-center">
				<h2 className="text-md font-semibold mb-4">
					선물함을 공유해보세요!
				</h2>
				<div className="flex space-x-4">
					{/* 링크 복사 버튼 */}
					<button
						onClick={handleCopyLink}
						className="flex flex-col items-center p-4 bg-gray-100 rounded-lg shadow hover:bg-gray-200 transition focus:outline-none focus:ring-2 focus:ring-hrtColorPink"
						aria-label="링크 복사"
					>
						<FiCopy className="text-3xl text-gray-700" />
						<span className="mt-2 text-sm text-gray-700">URL</span>
					</button>

					{/* QR 코드 복사 버튼 */}
					<button
						onClick={handleCopyQRCode}
						className="flex flex-col items-center p-4 bg-gray-100 rounded-lg shadow hover:bg-gray-200 transition focus:outline-none focus:ring-2 focus:ring-hrtColorPink"
						aria-label="QR 코드 복사"
					>
						<BsQrCode className="text-3xl text-gray-700" />
						<span className="mt-2 text-sm text-gray-700">QR</span>
					</button>

					{/* 카카오톡 알림 보내기 버튼
					<button
						onClick={handleSendKakaoTalk}
						className="flex flex-col items-center p-4 bg-gray-100 rounded-lg shadow hover:bg-gray-200 transition focus:outline-none focus:ring-2 focus:ring-hrtColorPink"
						aria-label="카카오톡으로 공유"
					>
						<FiMessageCircle className="text-3xl text-gray-700" />
						<span className="mt-2 text-sm text-gray-700">카톡</span>
					</button> */}
					<KakaoShareButton />
				</div>
			</div>
		</Modal>
	);
};

export default ShareModal;
