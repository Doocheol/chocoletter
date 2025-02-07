import React, { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import Modal from "../../../../common/Modal";
import "../../../../../styles/animation.css";
import frameImage from "../../../../../assets/images/letter/letter_pink.svg";

import giftbox_before_10 from "../assets/images/giftbox/giftbox_before_10.svg";
import giftbox_before_20 from "../assets/images/giftbox/giftbox_before_20.svg";
import giftbox_before_30 from "../assets/images/giftbox/giftbox_before_30.svg";
import giftbox_before_40 from "../assets/images/giftbox/giftbox_before_40.svg";
import giftbox_before_50 from "../assets/images/giftbox/giftbox_before_50.svg";
import giftbox_before_11 from "../assets/images/giftbox/giftbox_before_11.svg";
import giftbox_before_21 from "../assets/images/giftbox/giftbox_before_21.svg";
import giftbox_before_31 from "../assets/images/giftbox/giftbox_before_31.svg";
import giftbox_before_41 from "../assets/images/giftbox/giftbox_before_41.svg";
import giftbox_before_51 from "../assets/images/giftbox/giftbox_before_51.svg";
import giftbox_before_12 from "../assets/images/giftbox/giftbox_before_12.svg";
import giftbox_before_22 from "../assets/images/giftbox/giftbox_before_22.svg";
import giftbox_before_32 from "../assets/images/giftbox/giftbox_before_32.svg";
import giftbox_before_42 from "../assets/images/giftbox/giftbox_before_42.svg";
import giftbox_before_52 from "../assets/images/giftbox/giftbox_before_52.svg";
import { useRecoilValue } from "recoil";
import {
	userNameAtom,
	giftBoxNumAtom,
} from "../../../../../atoms/auth/userAtoms";

import choco_asset from "../../../../../assets/images/main/choco_asset.svg";
import Loading from "../../../../common/Loading";
import { copyToClipboard } from "../../../../../utils/copyToClipboard";
import { getGiftBoxId } from "../../../../../services/userApi";

type CaptureModalProps = {
	isVisible: boolean;
	onClose: () => void;
};

const CaptureModal: React.FC<CaptureModalProps> = ({ isVisible, onClose }) => {
	const [isAnimating, setIsAnimating] = useState(false);
	// 사용자가 입력하는 텍스트 (즉시 캔버스에 반영되지 않음)
	const [overlayText, setOverlayText] = useState(
		"내 초코레터 링크로 들어와서 편지 써줘..!"
	);
	// 캔버스에 적용될 최종 텍스트 (초기값은 overlayText와 동일)
	const [appliedText, setAppliedText] = useState(
		"내 초코레터 링크로 들어와서 편지 써줘..!"
	);
	// 캔버스 그림 완료 여부 (완료되기 전까지는 미리보기를 숨김)
	const [isLoading, setIsLoading] = useState(true);

	const canvasRef = useRef<HTMLCanvasElement>(null);

	const userName = useRecoilValue(userNameAtom);
	const giftBoxNum = useRecoilValue(giftBoxNumAtom);
	// 여기서는 내부 상태로 이미지 번호를 관리합니다. (기본값 "12")
	const [shapeNum, setShapeNum] = useState("12");

	// 선물 상자 이미지 매핑 (필요한 경우 Recoil의 giftBoxNum을 활용할 수 있습니다)
	const giftBoxImages: { [key: number]: string } = {
		11: giftbox_before_10,
		21: giftbox_before_20,
		31: giftbox_before_30,
		41: giftbox_before_40,
		51: giftbox_before_50,
		12: giftbox_before_11,
		22: giftbox_before_21,
		32: giftbox_before_31,
		42: giftbox_before_41,
		52: giftbox_before_51,
		13: giftbox_before_12,
		23: giftbox_before_22,
		33: giftbox_before_32,
		43: giftbox_before_42,
		53: giftbox_before_52,
	};
	// 텍스트 자동 줄바꿈 함수 (변경 없음)
	const wrapText = (
		ctx: CanvasRenderingContext2D,
		text: string,
		maxWidth: number,
		x: number,
		y: number,
		lineHeight: number
	) => {
		const words = text.split(" ");
		let line = "";
		const lines: string[] = [];

		for (let n = 0; n < words.length; n++) {
			const testLine = line + words[n] + " ";
			const metrics = ctx.measureText(testLine);
			const testWidth = metrics.width;
			if (testWidth > maxWidth && n > 0) {
				lines.push(line.trim());
				line = words[n] + " ";
			} else {
				line = testLine;
			}
		}
		lines.push(line.trim());

		for (let i = 0; i < lines.length; i++) {
			ctx.fillText(lines[i], x, y + i * lineHeight);
		}
	};

	// 캔버스에 그림을 그리는 함수 (html2canvas 등 불필요한 캡처 없이, 내부에서 바로 이미지 로드)
	const drawCanvas = () => {
		if (!canvasRef.current) {
			toast.dismiss();
			toast.error("캔버스가 준비되지 않았습니다.");
			setIsLoading(false);
			return;
		}
		const canvas = canvasRef.current;
		const ctx = canvas.getContext("2d");
		if (!ctx) {
			toast.dismiss();
			toast.error("Canvas 컨텍스트를 가져올 수 없습니다.");
			setIsLoading(false);
			return;
		}

		// 기본 선물 상자 이미지 로드
		const baseImage = new Image();
		baseImage.crossOrigin = "anonymous";
		baseImage.src = giftBoxImages[Number(shapeNum)] || giftbox_before_12;
		baseImage.onload = () => {
			// 캔버스 크기를 기본 이미지 크기로 설정
			canvas.width = baseImage.width;
			canvas.height = baseImage.height;
			// 기본 이미지를 캔버스에 그림
			ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

			// 프레임 이미지 로드
			const frame = new Image();
			frame.crossOrigin = "anonymous";
			frame.src = frameImage;
			frame.onload = () => {
				// 프레임을 캔버스 전체에 그림
				ctx.drawImage(frame, 0, 0, canvas.width, canvas.height);

				// 상단 중앙에 사용자 이름 텍스트 그리기
				const nameFontSize = Math.floor(canvas.width / 15);
				ctx.font = `${nameFontSize}px "Dovemayo_gothic"`;
				ctx.fillStyle = "black";
				ctx.textAlign = "center";
				ctx.textBaseline = "middle";
				ctx.shadowColor = "white";
				ctx.shadowBlur = 5;
				const nameText = `To. ${userName}`;
				const nameX = canvas.width / 2;
				const nameY = 60;
				ctx.fillText(nameText, nameX, nameY);

				// 하단에 오버레이 텍스트 그리기 (appliedText 사용)
				const fontSize = Math.floor(canvas.width / 20);
				ctx.font = `${fontSize}px "Dovemayo_gothic"`;
				const maxTextWidth = canvas.width - 40;
				const lineHeight = fontSize * 1.2;
				const textX = canvas.width / 2;
				const textY = canvas.height - fontSize * 2;
				wrapText(
					ctx,
					appliedText,
					maxTextWidth,
					textX,
					textY,
					lineHeight
				);

				// 좌측 상단에 로고 이미지 및 "초코레터" 텍스트 그리기
				const logoImage = new Image();
				logoImage.crossOrigin = "anonymous";
				logoImage.src = choco_asset;
				logoImage.onload = () => {
					const logoWidth = 30;
					const logoHeight = 30;
					const logoX = 10;
					const logoY = 10;
					ctx.drawImage(
						logoImage,
						logoX,
						logoY,
						logoWidth,
						logoHeight
					);
					ctx.font = "12px Dovemayo_gothic";
					ctx.fillStyle = "black";
					ctx.textAlign = "left";
					ctx.textBaseline = "middle";
					ctx.fillText(
						"초코레터",
						logoX + logoWidth + 5,
						logoY + logoHeight / 2
					);
					setIsLoading(false);
				};
				logoImage.onerror = () => {
					toast.error("로고 이미지 로드에 실패했습니다.");
					setIsLoading(false);
				};
			};
			frame.onerror = () => {
				toast.error("프레임 이미지 로드에 실패했습니다.");
				setIsLoading(false);
			};
		};
		baseImage.onerror = () => {
			toast.error("기본 이미지 로드에 실패했습니다.");
			setIsLoading(false);
		};
	};

	// 모달이 열리면 캔버스 그리기 시작
	useEffect(() => {
		if (isVisible) {
			setIsLoading(true);
			drawCanvas();
		}
	}, [isVisible, shapeNum, appliedText]);

	// "텍스트 적용" 버튼 클릭 시, 입력한 텍스트를 캔버스에 반영
	const handleApplyText = () => {
		setAppliedText(overlayText);
		drawCanvas();
	};

	// 기존 링크 복사, 이미지 다운로드/공유 함수 (변경 없음)
	const handleCopyLink = async () => {
		try {
			const giftBoxId = await getGiftBoxId();
			const sharedLink =
				!giftBoxId || giftBoxId.trim() === ""
					? window.location.href
					: `https://www.chocolate-letter.com/main/${giftBoxId}`;
			await copyToClipboard(sharedLink);
			toast.dismiss();
			toast.success("링크가 복사되었습니다!");
		} catch (error) {
			console.error("링크 복사 오류:", error);
			toast.dismiss();
			toast.error("링크 복사에 실패했습니다.");
		}
	};

	const handleImageDownload = async () => {
		if (!canvasRef.current) {
			toast.dismiss();
			toast.error("다운로드할 캔버스가 없습니다.");
			return;
		}
		const canvas = canvasRef.current;
		const finalImageSrc = canvas.toDataURL("image/png");
		const response = await fetch(finalImageSrc);
		const blob = await response.blob();
		const file = new File([blob], "my-chocolate-box.png", {
			type: "image/png",
		});
		if (
			navigator.share &&
			navigator.canShare &&
			navigator.canShare({ files: [file] })
		) {
			try {
				await navigator.share({
					title: "'초코레터!'",
					text: "내 초콜릿 보관함 이미지를 공유하고, 링크를 공유하여 편지를 받아보세요!",
					files: [file],
				});
				toast.dismiss();
				toast.success("공유 완료!");
			} catch (shareError) {
				console.error("공유에 실패했습니다.", shareError);
				downloadFile(finalImageSrc);
			}
		} else {
			downloadFile(finalImageSrc);
		}
	};

	const handleDownload = async () => {
		try {
			await handleCopyLink();
			setIsAnimating(true);
			await handleImageDownload();
			setIsAnimating(false);
			onClose();
		} catch (error) {
			console.error("이미지 다운로드/공유 중 오류 발생:", error);
			toast.dismiss();
			toast.error("이미지 다운로드/공유에 실패했습니다.");
			setIsAnimating(false);
		}
	};

	const downloadFile = (imageSrc: string) => {
		const link = document.createElement("a");
		link.href = imageSrc;
		link.download = "my-chocolate-box.png";
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		toast.dismiss();
		toast.success("링크 복사까지 완료! 인스타 스토리로 공유해보세요!");
	};

	return (
		<Modal isOpen={isVisible} onClose={onClose}>
			<div
				className={`p-2 flex flex-col items-center rounded-lg ${
					isAnimating ? "jello-vertical" : ""
				}`}
			>
				{/* 캔버스 미리보기: 완전히 그려질 때까지 로딩 컴포넌트 표시 */}
				{isLoading ? (
					<Loading />
				) : (
					<canvas
						ref={canvasRef}
						className="w-full h-auto rounded-md"
						style={{ border: "1px solid #ccc" }}
					></canvas>
				)}
				{/* 텍스트 입력창 */}
				<div className="w-full mt-4">
					<input
						type="text"
						value={overlayText}
						onChange={(e) => setOverlayText(e.target.value)}
						placeholder="내용을 입력하세요."
						className="px-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-1 focus:ring-chocoletterPurple"
					/>
				</div>
				{/* 버튼 영역: 왼쪽은 "텍스트 적용", 오른쪽은 "저장 & 공유" */}
				<div className="w-full mt-4 flex flex-row gap-2">
					<button
						onClick={handleApplyText}
						className="w-1/2 px-3 py-2 bg-white text-black rounded-md transition-colors"
					>
						텍스트 적용
					</button>
					<button
						onClick={handleDownload}
						className="w-1/2 px-3 py-2 bg-chocoletterPurpleBold text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
						disabled={isAnimating}
					>
						{isAnimating ? "..." : "저장 & 공유"}
					</button>
				</div>
			</div>
		</Modal>
	);
};

export default CaptureModal;
