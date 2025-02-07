import React from "react";
import { OtherModal } from "../../../../common/OtherModal";
import { PurpleButton } from "../../../../common/PurpleButton";

interface AlreadySentModalProps {
	isOpen: boolean;
	onClose: () => void;
}

const AlreadySentModal: React.FC<AlreadySentModalProps> = ({
	isOpen,
	onClose,
}) => {
	return (
		<OtherModal isOpen={isOpen} onClose={onClose}>
			<div className="text-center flex flex-col justify-center items-center gap-6">
				<div className="text-lg font-bold">이미 선물을 보냈습니다!</div>
				<p className="text-sm text-gray-700">
					해당 초콜릿 보관함에 이미 선물을 전송하여<br/> 더 이상 선물하기가
					불가능합니다.
				</p>
				<PurpleButton
					onClick={onClose}
					className="px-6 py-3 text-white bg-chocoletterPurpleBold border border-black outline-none focus:ring-0"
				>
					확인
				</PurpleButton>
			</div>
		</OtherModal>
	);
};

export default AlreadySentModal;
