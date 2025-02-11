import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import {
	giftBoxIdAtom,
	isLoginAtom,
	memberIdAtom,
} from "../../atoms/auth/userAtoms";
import { getGiftBoxPublicKey } from "../../services/keyApi";
import { logout } from "../../services/userApi";
import Loading from "./Loading";
import NotLoginModal from "../main/your/before/modal/NotLoginModal";

const PrivateRoute: React.FC = () => {
	const isLogin = useRecoilValue(isLoginAtom);
	const memberId = useRecoilValue(memberIdAtom);
	const giftBoxId = useRecoilValue(giftBoxIdAtom);

	const [isValid, setIsValid] = useState<boolean | null>(null);
	const [modalOpen, setModalOpen] = useState(false);
	const navigate = useNavigate();

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
						setModalOpen(true);
					}
				} catch (error) {
					setIsValid(false);
					setModalOpen(true);
				}
			} else {
				setIsValid(false);
				setModalOpen(true);
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
			// sessionStorage.setItem("redirectRoute", location.pathname);
			setIsValid(false);
			setModalOpen(true);
		} else {
			checkPublicKey();
		}
	}, [isLogin, memberId, giftBoxId]);

	if (isValid === null) {
		return <Loading />;
	}

	if (isValid) {
		return <Outlet />;
	}

	// const redirectTo = sessionStorage.getItem("redirectRoute") || "/";

	return (
		<>
			<Outlet />
			{(!isValid || !isLogin) && (
				<NotLoginModal
					isOpen={modalOpen}
					onClose={() => navigate("/")}
					onLogin={() => navigate("/")}
				/>
			)}
		</>
	);
};

export default PrivateRoute;
