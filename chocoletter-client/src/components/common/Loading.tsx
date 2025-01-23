import React from "react";

const Loading: React.FC = () => {
	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-100 slide-in-bottom">
			<div className="text-center">
				<svg
					className="jello-vertical h-10 w-10 text-blue-500 mx-auto mb-4"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
				>
					<circle
						className="opacity-25"
						cx="12"
						cy="12"
						r="10"
						stroke="currentColor"
						strokeWidth="4"
					></circle>
					<path
						className="opacity-75"
						fill="currentColor"
						d="M4 12a8 8 0 018-8v8H4z"
					></path>
				</svg>
				<h1 className="text-xl font-bold text-gray-700 heartbeat">
					로딩중...
				</h1>
			</div>
		</div>
	);
};

export default Loading;
