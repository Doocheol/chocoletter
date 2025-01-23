import React, { useEffect, useState } from "react";
import "../../../../../styles/animation.css";
import { toast } from "react-toastify";

type CaptureModalProps = {
	isVisible: boolean;
	imageSrc: string | null;
	onClose: () => void;
};

const CaptureModal: React.FC<CaptureModalProps> = ({
	isVisible,
	imageSrc,
	onClose,
}) => {
	const [isAnimating, setIsAnimating] = useState(false);

	useEffect(() => {
		if (isVisible && imageSrc) {
			// 모달이 열릴 때 애니메이션 상태 초기화
			setIsAnimating(false);
		}
	}, [isVisible, imageSrc]);

	if (!isVisible) return null;

	const handleDownload = () => {
		if (imageSrc) {
			setIsAnimating(true); // 애니메이션 시작

			// 애니메이션이 끝난 후 다운로드 실행
			setTimeout(() => {
				const link = document.createElement("a");
				link.href = imageSrc;
				link.download = "my-chocolate-box.png";
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
				toast.success("캡처 완료!");

				setIsAnimating(false); // 애니메이션 종료
				onClose(); // 모달 닫기
			}, 500); // 애니메이션 지속 시간과 일치 (jello-vertical: 0.5s)
		}
	};

	return (
		<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
			<div
				className={`bg-white p-6 rounded-lg shadow-lg flex flex-col items-center ${
					isAnimating ? "jello-vertical" : ""
				}`}
			>
				{imageSrc ? (
					<>
						<img
							src={imageSrc}
							alt="Captured"
							className="max-w-full h-auto rounded-md"
						/>
						<span className="mt-4 text-gray-500">
							나의 초콜릿 박스를 자랑해봐요!
						</span>
						<button
							onClick={handleDownload}
							className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
							disabled={isAnimating}
						>
							{isAnimating ? "다운로드 중..." : "다운로드"}
						</button>
					</>
				) : (
					<>
						<div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"></div>
						<span className="text-gray-700">캡처 중...</span>
					</>
				)}
			</div>
		</div>
	);
};

export default CaptureModal;
