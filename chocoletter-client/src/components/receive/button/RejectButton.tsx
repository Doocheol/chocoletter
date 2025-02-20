import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../common/Button";
import { patchUnboxingReject } from "../../../services/unboxingApi";

interface RejectButtonProps {
	giftId: string;
}

const RejectButton: React.FC<RejectButtonProps> = ({ giftId }) => {
	const navigate = useNavigate();

	const clickRejectHandler = async () => {
		try {
			const response = await patchUnboxingReject(giftId);

			if (response) {
				navigate("/main/my/before");
			} else {
				alert("수락 요청 중 오류가 발생했습니다.");
			}
		} catch (err) {
			new Error("실패");
		}
	};

	return (
		<div className="text-center">
			<Button
				onClick={clickRejectHandler}
				className="w-[300px] h-[100px] bg-white"
			>
				그때는 어려울 것 같아요. <br />
				다른 시간에 함께 할 수 있을까요?😥
			</Button>
		</div>
	);
};

export default RejectButton;
