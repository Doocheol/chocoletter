import React, { useLayoutEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "../common/Button";

/** 아이콘 영역을 제외하고 화면 전체를 검은 배경으로 덮는 오버레이 props */
interface FirstLoginTutorialOverlayProps {
	/** 강조(구멍) 처리할 아이콘 버튼의 ref */
	targetRef: React.RefObject<HTMLButtonElement>;
	/** 닫기 콜백 */
	onClose: () => void;
}

/**
 * - 화면 전체를 어둡게 깔고, 아이콘 주변을 원형으로 오려(투명)서 아이콘만 보이게
 * - 아이콘 클릭은 막고, "알겠어요" 버튼으로만 오버레이 종료
 */
const FirstLoginTutorialOverlay: React.FC<FirstLoginTutorialOverlayProps> = ({
	targetRef,
	onClose,
}) => {
	/** 원형 구멍의 중심좌표(x,y), 반지름(radius) */
	const [circleInfo, setCircleInfo] = useState<{
		x: number;
		y: number;
		radius: number;
	} | null>(null);

	useLayoutEffect(() => {
		if (targetRef.current) {
			const rect = targetRef.current.getBoundingClientRect();
			// 스크롤 보정
			const x = rect.left + rect.width / 2 + window.scrollX;
			const y = rect.top + rect.height / 2 + window.scrollY;
			// 아이콘보다 약간 크게 오려서 여유를 둠
			const radius = Math.max(rect.width, rect.height) / 2 + 8;
			setCircleInfo({ x, y, radius });
		}
	}, [targetRef]);

	if (!circleInfo) return null;

	const { x, y, radius } = circleInfo;

	/**
	 * (중요) clip-path로 "전체 화면"에서 "원형 영역"만 빼고(투명 처리) 싶으면
	 *   1) 바깥 사각형: 화면 전체 (0,0 ~ 화면 너비/높이)
	 *   2) 안쪽 원: circle around the icon
	 *   3) clip-rule: evenodd (두 영역의 차집합을 클리핑)
	 *
	 * 예: pathData = 화면전체 사각형 → 원형 → evenodd
	 */
	const screenW = window.innerWidth;
	const screenH = window.innerHeight;

	// 원형 path: SVG에서 원을 그리는 (Arc) 명령어
	// M (시작점) / a (호 그리기) -> 한 바퀴 그려서 원
	const circlePath = [
		`M ${x - radius},${y}`,
		`a ${radius},${radius} 0 1,0 ${radius * 2},0`,
		`a ${radius},${radius} 0 1,0 -${radius * 2},0 Z`,
	].join(" ");

	// 전체 사각형 + 원형을 겹쳐서 evenodd로 '원형 부분만 제외'
	const pathData = [
		`M 0,0 H ${screenW} V ${screenH} H 0 Z`, // 화면 전체
		circlePath, // 원형
	].join(" ");

	return createPortal(
		<div
			className="fixed inset-0 z-50"
			style={{
				// 오버레이가 전체 클릭을 막아서 아이콘도 클릭 안 됨
				pointerEvents: "auto",
			}}
		>
			{/*
        (1) 검은 배경 레이어
        clip-path 로 아이콘 영역만 '오려냄'(투명)
      */}
			<div
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					width: screenW,
					height: screenH,
					// 반투명 배경
					background: "rgba(0,0,0,0.7)",
					// 경로 정의 -> 사각형-원(차집합)
					clipPath: `path('${pathData}')`,
					clipRule: "evenodd",
					pointerEvents: "auto",
				}}
			/>

			{/*
        (2) 반짝이는 테두리 효과(선택)
        - 구멍보다 약간 큰 원을 그려서 boxShadow
        - 배경과 동일한 clip-path를 써도 되지만,
          radius를 +4 해서 "조금 더 큰 원" 주변에만 테두리
      */}
			<div
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					width: screenW,
					height: screenH,
					clipPath: `path('${makeHighlightPath(x, y, radius + 4)}')`,
					clipRule: "evenodd",
					boxShadow: "0 0 10px 5px rgba(255,255,255,0.8)",
					pointerEvents: "none", // 장식용
				}}
			/>

			{/*
        (3) 안내 문구 & 닫기 버튼 (화면 중앙)
        pointerEvents: auto -> 버튼만 클릭 수용
      */}
			<div
				style={{
					position: "fixed",
					top: "50%",
					left: "50%",
					transform: "translate(-50%, -50%)",
					pointerEvents: "auto",
				}}
				className="flex flex-col items-center text-center text-white"
			>
				<p className="mb-4">여기서 초코레터를 자세히 볼 수 있어요!</p>
				<Button onClick={onClose} className="text-md">
					알겠어요!
				</Button>
			</div>
		</div>,
		document.body
	);
};

/** 반짝이용 경로를 만드는 헬퍼 함수 (구멍보다 살짝 큰 원) */
function makeHighlightPath(x: number, y: number, radius: number) {
	const screenW = window.innerWidth;
	const screenH = window.innerHeight;
	// 화면 전체 사각형
	const rect = `M 0,0 H ${screenW} V ${screenH} H 0 Z`;
	// 원
	const circle = [
		`M ${x - radius},${y}`,
		`a ${radius},${radius} 0 1,0 ${radius * 2},0`,
		`a ${radius},${radius} 0 1,0 -${radius * 2},0 Z`,
	].join(" ");
	return [rect, circle].join(" ");
}

export default FirstLoginTutorialOverlay;
