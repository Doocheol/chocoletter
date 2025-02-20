import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "../components/common/Button";
import classes from "../styles/outGiftBoxChoco.module.css";
import choco_with_wing from "../assets/images/chocolate/choco_with_wing.png";
import { useGoMainNavigate } from "../hooks/useMainNavigate";
import ChangeGeneralGiftModal from "../components/reset-time/modal/ChangeGeneralGiftModal";

const ResetTimeView = () => {
	const navigate = useNavigate();
	const [isChange, setIsChange] = useState(false);
	const goToMainMyBefore = useGoMainNavigate({
		targetPerson: "my",
		timeNow: "before",
	});

	const goToSetTimeHandler = () => {
		navigate("/main/my/before");
	};

	const changeGeneralGiftHandler = () => {
		setIsChange(true);
	};

	return (
		<>
			<ChangeGeneralGiftModal
				isOpen={isChange}
				onClose={goToMainMyBefore}
			/>
			<div className="flex flex-col justify-center items-center gap-y-16">
				<div className={classes.chocoes}>
					<img src={choco_with_wing} alt="wing-choco" />
				</div>
				<div className="flex flex-col gap-y-5 w-full px-5">
					<Button
						onClick={goToSetTimeHandler}
						className="py-5 bg-white"
					>
						다른 시간으로 <br /> 약속을 잡을래요!
					</Button>
					<Button
						onClick={changeGeneralGiftHandler}
						className="py-5 bg-white"
					>
						일반 초콜릿으로 <br /> 바꿀래요!
					</Button>
				</div>
			</div>
		</>
	);
};

export default ResetTimeView;
