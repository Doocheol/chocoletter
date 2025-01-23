import React, { useRef } from "react";
import html2canvas from "html2canvas";

const CaptureComponent: React.FC = () => {
	//캡처할 html 요소 선택
	const captureRef = useRef<HTMLDivElement>(null);

	//캡처 함수
	const onCapture = () => {
		if (captureRef.current) {
			html2canvas(captureRef.current).then((canvas) => {
				//사용할 이미지 포멧과 제목 선택
				onSaveAs(canvas.toDataURL("image/png"), "image-download.png");
			});
		}
	};

	//다운로드 함수
	const onSaveAs = (uri: string, filename: string) => {
		//a 태그를 생성하고 다운로드받음
		const link = document.createElement("a");
		document.body.appendChild(link);
		link.href = uri;
		link.download = filename;
		link.click();
		document.body.removeChild(link);
	};

	return (
		<div>
			<div ref={captureRef} id="capture"></div>
			<button onClick={onCapture}></button>
		</div>
	);
};

export default CaptureComponent;
