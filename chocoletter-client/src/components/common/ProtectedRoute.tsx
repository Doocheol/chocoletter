import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useRecoilValue } from "recoil";
import {
	giftBoxIdAtom,
	isLoginAtom,
	memberIdAtom,
} from "../../atoms/auth/userAtoms";
import { getGiftBoxPublicKey } from "../../services/keyApi";
import { logout } from "../../services/userApi";
import Loading from "./Loading";

const PrivateRoute: React.FC = () => {
	const isLogin = useRecoilValue(isLoginAtom);
	const memberId = useRecoilValue(memberIdAtom);
	const giftBoxId = useRecoilValue(giftBoxIdAtom);
	const navigate = useNavigate();
	const location = useLocation();

	const [isValid, setIsValid] = useState<boolean | null>(null);

	useEffect(() => {
		const checkPublicKey = async () => {
			if (memberId && giftBoxId) {
				const localPublicKey = localStorage.getItem(
					`memberPublicKey_${memberId}`
				);
				try {
					const fetchedPublicKey = await getGiftBoxPublicKey(
						giftBoxId
					);
					if (localPublicKey === fetchedPublicKey) {
						setIsValid(true);
					} else {
						setIsValid(false);
					}
				} catch (error) {
					setIsValid(false);
				}
			} else {
				setIsValid(false);
			}
		};

		if (!isLogin) {
			(async () => {
				try {
					await logout();
				} catch (error) {
					navigate("/");
				}
			})();
			sessionStorage.setItem("showNotLoginModal", "true");
			setIsValid(false);
		} else {
			checkPublicKey();
		}
	}, [isLogin, memberId, giftBoxId, location.pathname]);

	useEffect(() => {
		if (isValid === false) {
			navigate("/", { replace: true });
		}
	}, [isValid, navigate]);

	if (isValid === null) {
		return <Loading />;
	}

	if (isValid) {
		return <Outlet />;
	}

	return null;
};

export default PrivateRoute;
