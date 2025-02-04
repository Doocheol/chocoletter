import React from "react";
import { OtherModal } from "../../../../common/OtherModal";

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
					해당 선물상자에 이미 선물이 전송되어 더 이상 선물하기가
					불가능합니다.
				</p>
				<button
					onClick={onClose}
					className="px-6 py-3 bg-chocoletterPurpleBold text-xl font-medium text-white rounded-lg shadow"
				>
					확인
				</button>
			</div>
		</OtherModal>
	);
};

export default AlreadySentModal;
