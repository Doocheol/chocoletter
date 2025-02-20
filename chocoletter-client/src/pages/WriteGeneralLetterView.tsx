import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import { GoBackButton } from "../components/common/GoBackButton";
import { SingleLetterLimitModal } from "../components/common/SingleLetterLimitModal";
import GeneralLetterForm from "../components/write-letter/GeneralLetterForm";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import login_view_service_title from "../assets/images/logo/login_view_service_title.svg";
import { freeLetterState } from "../atoms/letter/letterAtoms";
import { ImageButton } from "../components/common/ImageButton";
import next_button from "../assets/images/button/next_button.svg";

const WriteGeneralLetterView = () => {
	const [letter, setLetter] = useRecoilState(freeLetterState);
	const { giftBoxId } = useParams();
	const navigate = useNavigate();
	const [isModalOpen, setIsModalOpen] = useState(false);

	const resetLetterState = () => {
		setLetter({
			nickname: "",
			content: "",
			contentLength: 0,
		});
	};
	const handleGoBack = () => {
		resetLetterState();
	};

	const handleNextClick = () => {
		if (letter.nickname.length < 1) {
			if (!toast.isActive("min-nickname-toast")) {
				toast.error("닉네임은 최소 1글자 이상 입력해야 합니다!", {
					toastId: "min-nickname-toast",
					position: "top-center",
					autoClose: 2000,
				});
			}
			return;
		}

		if (letter.contentLength < 10) {
			if (!toast.isActive("min-content-toast")) {
				toast.error("메세지는 최소 10글자 이상 작성해야 합니다!", {
					toastId: "min-content-toast",
					position: "top-center",
					autoClose: 2000,
				});
			}
			return;
		}

		setIsModalOpen(true);
	};

	const handleSendLetter = () => {
		setIsModalOpen(false);
		navigate(`/select-gift/${giftBoxId}`);
	};

	return (
		<div className="relative flex flex-col items-center h-screen bg-letter-pink-background">
			<GoBackButton
				strokeColor="#9E4AFF"
				altText="뒤로가기 버튼"
				onClick={handleGoBack}
			/>

			<div className="absolute mt-[41px] m-4">
				<div className="flex flex-col items-center mb-[30px]">
					<img
						src={login_view_service_title}
						alt="login_view_service_title"
					/>
				</div>

				<div>
					<GeneralLetterForm />

					<div className="relatvie text-center">
						<ImageButton
							onClick={handleNextClick}
							src={next_button}
							className="absolute right-0 gap-2"
						/>
					</div>
				</div>
			</div>
			<SingleLetterLimitModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onSend={handleSendLetter}
			/>
		</div>
	);
};

export default WriteGeneralLetterView;
