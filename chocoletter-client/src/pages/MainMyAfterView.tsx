import React from "react";
import { useNavigate } from "react-router-dom";

import useViewportHeight from "../hooks/useViewportHeight";

import after_giftbox from "../assets/images/main/after_giftbox.svg";
import after_text from "../assets/images/main/after_text.svg";

const MainMyAfterView: React.FC = () => {
	const navigate = useNavigate();

	useViewportHeight();

	// 핸들러
	const handleLogin = () => {
		navigate("/");
	};

	return (
		<div className="flex justify-center w-full bg-white">
			<div className="w-full max-w-sm min-h-screen h-[calc(var(--vh)*100)] flex flex-col bg-gradient-to-b from-[#E6F5FF] to-[#F4D3FF]">
				<div className="mt-6 ml-6 flex items-center justify-between "></div>

				{/** 초콜릿 박스 & 안내 문구 */}
				<div className="mt-32 flex flex-col items-center px-4">
					<button
						className="w-[300px] pl-4 flex items-center justify-center"
						onClick={handleLogin}
					>
						<img
							src={after_giftbox}
							alt="after_giftbox"
							className="p-2 max-h-60"
						/>
					</button>
				</div>

				<div className="mt-2 flex flex-row justify-center items-center gap-2.5">
					<img src={after_text} alt="after_text" className="" />
				</div>
			</div>
		</div>
	);
};

export default MainMyAfterView;
