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

type CaptureModalProps = {
  isVisible: boolean;
  imageSrc: string | null;
  onClose: () => void;
};

const CaptureModal: React.FC<CaptureModalProps> = ({ isVisible, imageSrc, onClose }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [overlayText, setOverlayText] = useState("내 초코레터 링크로 들어와서 편지 써줘..!");

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Recoil에서 사용자 이름과 상자 정보를 불러옴
  const userName = useRecoilValue(userNameAtom);
  const giftBoxNum = useRecoilValue(giftBoxNumAtom); // userGiftboxAtom이 현재 사용자의 상자 번호를 저장한다고 가정

  useEffect(() => {
    if (isVisible && imageSrc) {
      // 모달이 열릴 때 애니메이션 상태 초기화 및 캔버스 그리기
      setIsAnimating(false);
      drawCanvas();
    }
  }, [isVisible, imageSrc, overlayText]);

  // 텍스트를 여러 줄로 나누는 함수
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

  const drawCanvas = async () => {
    if (canvasRef.current && imageSrc) {
      try {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Canvas 컨텍스트를 가져올 수 없습니다.");

        // 캡처된 이미지 로드
        const capturedImage = new Image();
        // capturedImage.crossOrigin = "anonymous"; // CORS 문제 방지
        capturedImage.src = imageSrc;

        // 프레임 이미지 로드
        const frame = new Image();
        frame.crossOrigin = "anonymous"; // CORS 문제 방지
        frame.src = frameImage;

        // giftbox_before 이미지 배열
        const giftboxImages = [
          giftbox_before_1,
          giftbox_before_2,
          giftbox_before_3,
          giftbox_before_4,
          giftbox_before_5,
        ];

        // 사용자의 상자 번호에 맞는 giftbox_before 이미지 선택 (랜덤)
        let selectedGiftboxImage: string;
        if (giftBoxNum >= 1 && giftBoxNum <= 5) {
          // 해당 상자 번호에 맞는 이미지 배열 인덱스 (1-5 -> 0-4)
          const imagesForBox = [
            giftbox_before_1,
            giftbox_before_2,
            giftbox_before_3,
            giftbox_before_4,
            giftbox_before_5,
          ];
          selectedGiftboxImage = imagesForBox[giftBoxNum - 1];
        } else {
          // userGiftbox가 1-5 범위를 벗어나면 전체 이미지 중에서 랜덤으로 선택
          selectedGiftboxImage = giftboxImages[Math.floor(Math.random() * giftboxImages.length)];
        }

        // 선택된 giftbox_before 이미지 로드
        const selectedGiftbox = new Image();
        selectedGiftbox.crossOrigin = "anonymous";
        selectedGiftbox.src = selectedGiftboxImage;

        // 모든 이미지 로딩 완료 대기
        await Promise.all([
          // new Promise<void>((resolve, reject) => {
          //   capturedImage.onload = () => {
          //     console.log("Captured Image Loaded");
          //     resolve();
          //   };
          //   capturedImage.onerror = () => {
          //     console.error("Captured Image Failed to Load");
          //     reject(new Error("Captured Image Failed to Load"));
          //   };
          // }),
          new Promise<void>((resolve, reject) => {
            frame.onload = () => {
              console.log("Frame Image Loaded");
              resolve();
            };
            frame.onerror = () => {
              console.error("Frame Image Failed to Load");
              reject(new Error("Frame Image Failed to Load"));
            };
          }),
          new Promise<void>((resolve, reject) => {
            selectedGiftbox.onload = () => {
              console.log("Selected Giftbox Image Loaded");
              resolve();
            };
            selectedGiftbox.onerror = () => {
              console.error("Selected Giftbox Image Failed to Load");
              reject(new Error("Selected Giftbox Image Failed to Load"));
            };
          }),
        ]);

        // 캔버스 크기 설정
        canvas.width = capturedImage.width;
        canvas.height = capturedImage.height;

        // 캔버스에 캡처된 이미지 그리기
        ctx.drawImage(capturedImage, 0, 0, canvas.width, canvas.height);
        // console.log("Captured Image Drawn on Canvas");

        // 캔버스에 프레임 그리기
        // ctx.drawImage(frame, 0, 0, canvas.width, canvas.height);
        // console.log("Frame Image Drawn on Canvas");

        // 프레임 원본 이미지 크롭을 위한 변수 설정
        const cropX = 0; // 프레임 원본의 크롭 시작 X 좌표
        const cropY = 0; // 프레임 원본의 크롭 시작 Y 좌표
        const cropWidth = frame.width; // 프레임의 크롭할 너비
        const cropHeight = frame.width; // 프레임의 크롭할 높이
        console.log(frame.width, frame.height);

        // 캔버스에서 프레임을 그릴 위치
        const drawX = 0;
        const drawY = 0;
        const drawWidth = canvas.width;
        const drawHeight = canvas.height;

        // 크롭하여 프레임 그리기
        ctx.drawImage(
          frame, // 원본 이미지
          cropX, // 크롭 시작 X 좌표
          cropY, // 크롭 시작 Y 좌표
          cropWidth, // 크롭할 너비
          cropHeight, // 크롭할 높이
          drawX, // 캔버스에 그릴 X 좌표
          drawY, // 캔버스에 그릴 Y 좌표
          drawWidth, // 캔버스에 그릴 너비
          drawHeight // 캔버스에 그릴 높이
        );

        // 캔버스에 선택된 giftbox_before 이미지 그리기 (280x280 픽셀, 중앙 위치)
        const giftboxWidth = 280;
        const giftboxHeight = 280;
        const giftboxX = (canvas.width - giftboxWidth + 30) / 2;
        const giftboxY = (canvas.height - giftboxHeight) / 2;

        // 캔버스에 선택된 giftbox_before 이미지 그리기
        // 원하는 위치와 크기로 조정 가능 (예: 전체 캔버스 크기)
        ctx.drawImage(selectedGiftbox, giftboxX, giftboxY, giftboxWidth, giftboxHeight);
        console.log("Selected Giftbox Image Drawn on Canvas");

        // 사용자 이름 텍스트 그리기
        const nameFontSize = Math.floor(canvas.width / 15); // 폰트 크기 조정
        ctx.font = `${nameFontSize}px "Dovemayo_gothic"`;
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.shadowColor = "white";
        ctx.shadowBlur = 5;

        const nameText = `${userName} 님의 선물상자`;
        const nameX = canvas.width / 2;
        const nameY = 60; // 캔버스 상단 여백

        ctx.fillText(nameText, nameX, nameY);
        console.log("User Name Text Drawn on Canvas");

        // 텍스트 그리기 (자동 줄바꿈)
        const fontSize = Math.floor(canvas.width / 20); // 폰트 크기 조정
        ctx.font = `${fontSize}px "Dovemayo_gothic"`;
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.shadowColor = "white";
        ctx.shadowBlur = 5;

        const maxTextWidth = canvas.width - 40; // 좌우 여백을 고려
        const lineHeight = fontSize * 1.2;
        const textX = canvas.width / 2;
        const textY = canvas.height - fontSize * 2; // 하단에서 약간 위쪽

        wrapText(ctx, overlayText, maxTextWidth, textX, textY, lineHeight);
        // console.log("Overlay Text Drawn on Canvas");
      } catch (error) {
        // console.error("이미지 합성 중 오류 발생:", error);
        toast.error("이미지 합성에 실패했습니다.");
      }
    }
  };

  const handleDownload = async () => {
    if (canvasRef.current) {
      setIsAnimating(true); // 애니메이션 시작

      // 애니메이션이 끝난 후 처리
      setTimeout(async () => {
        try {
          const canvas = canvasRef.current;
          if (!canvas) throw new Error("Canvas가 존재하지 않습니다.");

          // 캔버스의 data URL (PNG)
          const finalImageSrc = canvas.toDataURL("image/png");

          // Blob으로 변환 (Web Share API에 필요한 경우)
          const response = await fetch(finalImageSrc);
          const blob = await response.blob();
          const file = new File([blob], "my-chocolate-box.png", { type: "image/png" });

          // 만약 모바일 환경 등에서 Web Share API가 지원된다면 공유 시도
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
              // 공유 실패시에도 다운로드 링크를 실행
              downloadFile(finalImageSrc);
            }
          } else {
            // Web Share API를 지원하지 않으면 다운로드 방식으로 진행
            downloadFile(finalImageSrc);
          }

          setIsAnimating(false); // 애니메이션 종료
          onClose(); // 모달 닫기
        } catch (error) {
          console.error("이미지 다운로드/공유 중 오류 발생:", error);
          toast.error("이미지 다운로드/공유에 실패했습니다.");
          setIsAnimating(false);
        }
      }, 500); // 애니메이션 지속 시간 (예: 0.5초)
    }
  };

  // 다운로드 전용 함수 (파일 다운로드 링크 생성)
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
        {/* 닫기버튼과 너무 가까워서 공백 생성 */}
        <div className="h-[10px]"></div>
        {imageSrc ? (
          <>
            {/* 캔버스를 프리뷰로 표시 */}
            <canvas
              ref={canvasRef}
              className="max-w-[95%] h-auto rounded-md"
              style={{ border: "1px solid #ccc" }}
            ></canvas>

            {/* 감성적인 문구 입력 필드 및 저장 버튼 */}
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
          </>
        ) : (
          <>
            <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"></div>
            <span className="text-gray-700">캡처 중...</span>
          </>
        )}
      </div>
    </Modal>
  );
};

export default CaptureModal;
