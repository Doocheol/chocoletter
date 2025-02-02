import React, { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import Modal from "../../../../common/Modal";
import "../../../../../styles/animation.css";
import frameImage from "../../../../../assets/images/letter/letter_pink.svg";

import giftbox_before_1 from "../../../../../assets/images/giftbox/giftbox_before_1.svg";
import giftbox_before_2 from "../../../../../assets/images/giftbox/giftbox_before_2.svg";
import giftbox_before_3 from "../../../../../assets/images/giftbox/giftbox_before_3.svg";
import giftbox_before_4 from "../../../../../assets/images/giftbox/giftbox_before_4.svg";
import giftbox_before_5 from "../../../../../assets/images/giftbox/giftbox_before_5.svg";
import { useRecoilValue } from "recoil";
import { giftBoxNumAtom, userNameAtom } from "../../../../../atoms/auth/userAtoms";
import html2canvas from "html2canvas";

// 로고 이미지 임포트
import choco_asset from "../../../../../assets/images/main/choco_asset.svg";

type CaptureModalProps = {
  isVisible: boolean;
  onClose: () => void;
  captureTargetId: string; // 캡처할 대상 요소의 id
};

const CaptureModal: React.FC<CaptureModalProps> = ({ isVisible, onClose, captureTargetId }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [overlayText, setOverlayText] = useState("내 초코레터 링크로 들어와서 편지 써줘..!");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const userName = useRecoilValue(userNameAtom);
  const giftBoxNum = useRecoilValue(giftBoxNumAtom);

  // 텍스트 자동 줄바꿈 함수
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

  // 캔버스에 이미지 및 텍스트를 그리는 함수
  const drawCanvas = (capturedCanvas: HTMLCanvasElement) => {
    if (!canvasRef.current) {
      toast.error("캔버스가 준비되지 않았습니다.");
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      toast.error("Canvas 컨텍스트를 가져올 수 없습니다.");
      return;
    }

    // 캡처된 캔버스를 기반으로 캔버스 크기 조정
    canvas.width = capturedCanvas.width;
    canvas.height = capturedCanvas.height;

    // 캡처된 이미지를 먼저 캔버스에 그림
    ctx.drawImage(capturedCanvas, 0, 0, canvas.width, canvas.height);

    // 프레임 이미지 로드 및 그림
    const frame = new Image();
    frame.crossOrigin = "anonymous";
    frame.src = frameImage;

    // giftbox_before 이미지 배열
    const giftboxImages = [
      giftbox_before_1,
      giftbox_before_2,
      giftbox_before_3,
      giftbox_before_4,
      giftbox_before_5,
    ];

    let selectedGiftboxImage: string;
    if (giftBoxNum >= 1 && giftBoxNum <= 5) {
      selectedGiftboxImage = giftboxImages[giftBoxNum - 1];
    } else {
      selectedGiftboxImage = giftboxImages[Math.floor(Math.random() * giftboxImages.length)];
    }

    const selectedGiftbox = new Image();
    selectedGiftbox.crossOrigin = "anonymous";
    selectedGiftbox.src = selectedGiftboxImage;

    Promise.all([
      new Promise<void>((resolve, reject) => {
        frame.onload = () => resolve();
        frame.onerror = () => reject(new Error("Frame Image Failed to Load"));
      }),
      new Promise<void>((resolve, reject) => {
        selectedGiftbox.onload = () => resolve();
        selectedGiftbox.onerror = () => reject(new Error("Selected Giftbox Image Failed to Load"));
      }),
    ])
      .then(() => {
        // 프레임 이미지 그리기 (원본 크롭 후 캔버스에 맞게 그리기)
        ctx.drawImage(frame, 0, 0, frame.width, frame.width, 0, 0, canvas.width, canvas.height);

        // 선택된 giftbox 이미지 그리기 (크기를 320x320으로 확대)
        const giftboxWidth = 320;
        const giftboxHeight = 320;
        const giftboxX = (canvas.width - giftboxWidth) / 2;
        const giftboxY = (canvas.height - giftboxHeight) / 2;
        ctx.drawImage(selectedGiftbox, giftboxX, giftboxY, giftboxWidth, giftboxHeight);

        // 사용자 이름 텍스트 그리기 (상단 중앙)
        const nameFontSize = Math.floor(canvas.width / 15);
        ctx.font = `${nameFontSize}px "Dovemayo_gothic"`;
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.shadowColor = "white";
        ctx.shadowBlur = 5;
        const nameText = `${userName} 님의 선물상자`;
        const nameX = canvas.width / 2;
        const nameY = 60;
        ctx.fillText(nameText, nameX, nameY);

        // 오버레이 텍스트 그리기 (하단)
        const fontSize = Math.floor(canvas.width / 20);
        ctx.font = `${fontSize}px "Dovemayo_gothic"`;
        const maxTextWidth = canvas.width - 40;
        const lineHeight = fontSize * 1.2;
        const textX = canvas.width / 2;
        const textY = canvas.height - fontSize * 2;
        wrapText(ctx, overlayText, maxTextWidth, textX, textY, lineHeight);

        // 캔버스 왼쪽 상단에 로고 이미지와 텍스트 그리기
        const logoImage = new Image();
        logoImage.crossOrigin = "anonymous";
        logoImage.src = choco_asset;
        logoImage.onload = () => {
          const logoWidth = 30;
          const logoHeight = 30;
          const logoX = 10;
          const logoY = 10;
          ctx.drawImage(logoImage, logoX, logoY, logoWidth, logoHeight);

          // 로고 이미지 오른쪽에 "초코레터" 텍스트 그리기
          ctx.font = "12px Dovemayo_gothic";
          ctx.fillStyle = "black";
          ctx.textAlign = "left";
          ctx.textBaseline = "middle";
          ctx.fillText("초코레터", logoX + logoWidth + 5, logoY + logoHeight / 2);
        };
      })
      .catch((error) => {
        console.error("이미지 합성 중 오류 발생:", error);
        toast.error("이미지 합성에 실패했습니다.");
      });
  };

  // 모달이 열리면 지정된 대상 요소를 html2canvas로 캡처 후 drawCanvas 실행
  useEffect(() => {
    if (isVisible) {
      const targetElement = document.getElementById(captureTargetId);
      if (!targetElement) {
        toast.error("캡처할 요소를 찾을 수 없습니다.");
        return;
      }
      html2canvas(targetElement)
        .then((capturedCanvas) => {
          drawCanvas(capturedCanvas);
        })
        .catch((error) => {
          console.error("캡처에 실패했습니다:", error);
          toast.error("캡처에 실패했습니다.");
        });
    }
  }, [isVisible, captureTargetId, overlayText]);

  const handleDownload = async () => {
    if (!canvasRef.current) {
      toast.error("다운로드할 캔버스가 없습니다.");
      return;
    }
    setIsAnimating(true);
    setTimeout(async () => {
      try {
        const canvas = canvasRef.current;
        if (!canvas) throw new Error("Canvas가 존재하지 않습니다.");

        const finalImageSrc = canvas.toDataURL("image/png");
        const response = await fetch(finalImageSrc);
        const blob = await response.blob();
        const file = new File([blob], "my-chocolate-box.png", { type: "image/png" });

        if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              title: "내 초콜릿 상자",
              text: "내 초콜릿 상자 이미지를 공유해보세요!",
              files: [file],
            });
            toast.success("공유 성공!");
          } catch (shareError) {
            console.error("공유에 실패했습니다.", shareError);
            downloadFile(finalImageSrc);
          }
        } else {
          downloadFile(finalImageSrc);
        }
        setIsAnimating(false);
        onClose();
      } catch (error) {
        console.error("이미지 다운로드/공유 중 오류 발생:", error);
        toast.error("이미지 다운로드/공유에 실패했습니다.");
        setIsAnimating(false);
      }
    }, 500);
  };

  const downloadFile = (imageSrc: string) => {
    const link = document.createElement("a");
    link.href = imageSrc;
    link.download = "my-chocolate-box.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("저장 완료! 사람들에게 공유해보세요!");
  };

  return (
    <Modal isOpen={isVisible} onClose={onClose} className="ml-2">
      <div
        className={`p-2 flex flex-col items-center rounded-lg ${
          isAnimating ? "jello-vertical" : ""
        }`}
      >
        {/* 타이틀 추가 */}
        <h3 className="text-md font-thin mb-2">인스타 스토리로 공유하기!</h3>
        <div className="h-[10px]"></div>
        <canvas
          ref={canvasRef}
          className="max-w-[95%] h-auto rounded-md"
          style={{ border: "1px solid #ccc" }}
        ></canvas>
        <div className="flex flex-row items-center gap-2 w-full max-w-[95%]">
          <input
            type="text"
            value={overlayText}
            onChange={(e) => setOverlayText(e.target.value)}
            placeholder="내용을 입력하세요."
            className="mt-4 px-4 py-2 border border-gray-300 rounded-md w-full max-w-sm focus:outline-none focus:ring-1 focus:ring-chocoletterPurple"
          />
          <button
            onClick={handleDownload}
            className="mt-4 px-2 py-2 w-20 bg-chocoletterPurpleBold text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isAnimating}
          >
            {isAnimating ? "..." : "저장"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default CaptureModal;
