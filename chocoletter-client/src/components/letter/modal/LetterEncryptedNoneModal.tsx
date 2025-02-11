import { useNavigate } from "react-router";
import { OtherModal } from "../../common/OtherModal";
import { PurpleButton } from "../../common/PurpleButton";

interface LetterEncryptedNoneModalProps {
	isOpen: boolean;
	onClose: () => void;
}

const LetterEncryptedNoneModal: React.FC<LetterEncryptedNoneModalProps> = ({
	isOpen,
	onClose,
}) => {
	const navigate = useNavigate();

	const handleConfirm = () => {
		navigate("/");
		onClose();
	};

	return (
		<OtherModal isOpen={isOpen} onClose={handleConfirm}>
			<div className="text-center flex flex-col justify-center items-center gap-6">
				<div className="text-lg font-bold">브라우저 변경 알림</div>
				<p className="text-sm text-gray-700">로그인을 다시 해주세요!</p>
				<PurpleButton
					onClick={handleConfirm}
					className="px-6 py-3 text-white bg-chocoletterPurpleBold border border-black outline-none focus:ring-0"
				>
					확인
				</PurpleButton>
			</div>
		</OtherModal>
	);
};

export default LetterEncryptedNoneModal;
