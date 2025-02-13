import React from "react";
import { GoBackButton } from "../common/GoBackButton";
import LetterInChatOpenButton from "./button/LetterInChatOpenButton";

interface ChatHeaderProps {
	letterNickName?: string;
	onOpenLetter: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
	letterNickName,
	onOpenLetter,
}) => {
	return (
		<div
			className="fixed top-0 left-0 right-0 z-50 w-full md:max-w-sm h-[58px] px-4 py-[17px] bg-chocoletterPurpleBold flex flex-col justify-center items-center gap-[15px]"
			style={{ paddingTop: "env(safe-area-inset-top)" }}
		>
			<div className="self-stretch justify-between items-center inline-flex">
				<div className="w-6 h-6 flex justify-center items-center">
					<GoBackButton />
				</div>
				<div className="text-center text-white text-2xl font-normal font-sans leading-snug">
					{letterNickName}
				</div>
				<div className="w-6 h-6">
					<LetterInChatOpenButton onPush={onOpenLetter} />
				</div>
			</div>
		</div>
	);
};

export default ChatHeader;
