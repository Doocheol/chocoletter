import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import { GoBackButton } from "../components/common/GoBackButton";
import { SingleLetterLimitModal } from "../components/common/SingleLetterLimitModal";
import QuestionLetterForm from "../components/write-letter/QuestionLetterForm";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import login_view_service_title from "../assets/images/logo/login_view_service_title.svg";
import { questionLetterState } from "../atoms/letter/letterAtoms";
import { ImageButton } from "../components/common/ImageButton";
import next_button from "../assets/images/button/next_button.svg";

const WriteQuestionLetterView = () => {
	const [letter, setLetter] = useRecoilState(questionLetterState);
	const { giftBoxId } = useParams();
	const navigate = useNavigate();
	const [isModalOpen, setIsModalOpen] = useState(false);

	const resetLetterState = () => {
		setLetter({
			nickname: "",
			question: "",
			answer: "",
			answerLength: 0,
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

		if (letter.answerLength < 10) {
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
		<div className="relative flex flex-col items-center h-screen bg-letter-blue-background">
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
						className=""
					/>
				</div>

				<div>
					<QuestionLetterForm />

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

export default WriteQuestionLetterView;
