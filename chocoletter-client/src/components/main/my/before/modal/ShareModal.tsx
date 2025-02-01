import React, { useEffect, useState } from "react";
import Modal from "../../../../common/Modal";
import { copyToClipboard } from "../../../../../utils/copyToClipboard";
import { getGiftBoxShareCode } from "../../../../../services/userApi";
import useScript from "../../../../../hooks/useScript";
import { initializeKakao } from "../../../../../utils/sendKakaoTalk";
import { QRCodeCanvas } from "qrcode.react";
import KakaoShareButton from "../button/KakaoShareButton";
import Loading from "../../../../common/Loading"; // 로딩 컴포넌트 import

import { GoLink } from "react-icons/go";
import { BsQrCode } from "react-icons/bs";

interface ShareModalProps {
	isOpen: boolean;
	onClose: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose }) => {
	const [sharedLink, setSharedLink] = useState("");
	const [showQRCode, setShowQRCode] = useState(false);
	const [qrLoading, setQrLoading] = useState(false);
	const [isLinkLoading, setIsLinkLoading] = useState(false); // shareCode 준비 여부

	// Kakao SDK 로드
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

	// 모달 열릴 때 공유 링크 생성
	useEffect(() => {
		async function fetchShareCode() {
			try {
				setIsLinkLoading(true); // 로딩 시작
				setSharedLink(""); // 이전 링크 초기화
				const code = await getGiftBoxShareCode();
				setSharedLink(`https://www.chocolate-letter.com/${code}`);
			} catch (e) {
				console.error("Error fetching shareCode:", e);
			} finally {
				setIsLinkLoading(false); // 로딩 종료
			}
		}

		if (isOpen) {
			setShowQRCode(false);
			fetchShareCode();
		}
	}, [isOpen]);

	// (A) 복사 + 모바일 공유 시도
	const handleCopyAndShare = async () => {
		if (!sharedLink) {
			alert("공유 링크가 아직 준비되지 않았습니다.");
			return;
		}

		try {
			// 1) 복사
			await copyToClipboard(sharedLink);

			// 2) 모바일 Web Share API 지원 여부 확인
			if (navigator.share) {
				await navigator.share({
					title: "초콜릿 박스 공유",
					text: "초콜릿 박스에서 편지를 받아보세요!",
					url: sharedLink,
				});
			} else {
				alert("링크가 복사되었습니다! 친구들에게 공유해보세요!");
			}
		} catch (err) {
			console.error("공유 중 오류:", err);
			alert("링크 공유에 실패했습니다.");
		}
	};

	// (B) QR 코드 표시
	const handleShowQRCode = () => {
		if (!sharedLink) {
			alert("공유 링크가 준비되지 않았습니다.");
			return;
		}
		setQrLoading(true);
		setTimeout(() => {
			setQrLoading(false);
			setShowQRCode(true);
		}, 200);
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={() => {
				onClose();
				setShowQRCode(false);
				setSharedLink("");
			}}
		>
			<div className="flex flex-col items-center rounded-2xl pl-3">
				<h2 className="text-md font-thin mb-4">나도 초콜릿 받기!</h2>

				{/** (1) 만약 shareLink가 로딩 중이면 <Loading />를 화면에 표시 */}
				{isLinkLoading && <Loading />}

				{/** (2) 로딩 중이 아니라면 UI를 표시 */}
				{!isLinkLoading && (
					<>
						{!showQRCode ? (
							<div className="flex flex-row justify-center space-x-4 pr-3">
								{/* (a) 복사 + 모바일 공유 */}
								<button
									onClick={handleCopyAndShare}
									className="flex justify-center items-center bg-sky-200 p-4 rounded-lg border border-black"
								>
									<GoLink className="text-3xl text-gray-700" />
								</button>

								{/* (b) QR 코드 버튼 */}
								<button
									onClick={handleShowQRCode}
									className="flex justify-center items-center bg-gray-500 p-4 rounded-lg border border-black"
								>
									<BsQrCode className="text-3xl text-white" />
								</button>

								{/* (c) 카카오 공유 */}
								<KakaoShareButton shareLink={sharedLink} />
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
									<QRCodeCanvas
										value={sharedLink}
										size={256}
									/>
								)}
							</div>
						)}
					</>
				)}
			</div>
		</Modal>
	);
};

export default ShareModal;
