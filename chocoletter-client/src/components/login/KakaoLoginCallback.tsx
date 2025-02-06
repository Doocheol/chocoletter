import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { toast } from "react-toastify";
import Loading from "../common/Loading";
import { MyUserInfo } from "../../types/user";
import { removeUserInfo, saveUserInfo } from "../../services/userApi";
import {
	isFirstLoginAtom,
	isLoginAtom,
	giftBoxIdAtom,
	userNameAtom,
	userProfileUrlAtom,
	memberIdAtom,
	isGiftBoxSelectedAtom,
} from "../../atoms/auth/userAtoms";

const KakaoLoginCallback: React.FC = () => {
	const navigate = useNavigate();
	const location = useLocation(); // useLocation는 최상위에서 호출합니다.
	const setIsLogin = useSetRecoilState(isLoginAtom);
	const setUserName = useSetRecoilState(userNameAtom);
	const setUserProfileUrl = useSetRecoilState(userProfileUrlAtom);
	const setIsFirstLogin = useSetRecoilState(isFirstLoginAtom);
	const setGiftBoxId = useSetRecoilState(giftBoxIdAtom);
	const setMemberId = useSetRecoilState(memberIdAtom);
	const setIsGiftBoxSelected = useSetRecoilState(isGiftBoxSelectedAtom);

	useEffect(() => {
		const handleLogin = async () => {
			const urlParams = new URLSearchParams(window.location.search);
			const accessToken = urlParams.get("accessToken");
			const userName = urlParams.get("userName");
			const userProfileUrl = urlParams.get("userProfileUrl");
			const isFirstLoginParam = urlParams.get("isFirstLogin");
			const giftBoxId = urlParams.get("giftBoxId");
			const memberId = urlParams.get("memberId");

			if (!accessToken || !userName || !giftBoxId || !memberId) {
				removeUserInfo();
				setIsLogin(false);
				toast.error("다시 로그인해주세요!");
				navigate("/");
				return;
			}

			const isFirstLogin = isFirstLoginParam === "true";
			setIsFirstLogin(isFirstLogin);

			const userInfo: MyUserInfo = {
				userName,
				accessToken,
				giftBoxId,
			};

			saveUserInfo(userInfo);

			setIsLogin(true);
			setUserName(userName);
			setUserProfileUrl(userProfileUrl || "");
			setGiftBoxId(giftBoxId);
			setMemberId(memberId);

			const redirectPath = localStorage.getItem("redirect");

			if (redirectPath) {
				navigate(redirectPath);
				localStorage.removeItem("redirect");
				return;
			}

			if (isFirstLogin) {
				navigate("/select-giftbox");
				return;
			}

			setIsGiftBoxSelected(true);
			navigate(`/main/${giftBoxId}`);
		};

		handleLogin();
	}, [
		navigate,
		location, // location을 의존성 배열에 추가합니다.
		setIsLogin,
		setUserName,
		setUserProfileUrl,
		setIsFirstLogin,
		setMemberId,
		setGiftBoxId,
		setIsGiftBoxSelected,
	]);

	return <Loading />;
};

export default KakaoLoginCallback;
