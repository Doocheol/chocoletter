import { useEffect, useState, createContext, useContext } from "react";

const SOCKET_URL = "http://localhost:9092";
interface SocketContextType {
	userList: string[];
}

const SocketContext = createContext<SocketContextType | null>(null);

export const WebSocketProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const [userList, setUserList] = useState<string[]>([]); // 접속한 사용자 목록

	return (
		<SocketContext.Provider value={{ userList }}>
			{children}
		</SocketContext.Provider>
	);
};

export const useSocket = () => {
	return useContext(SocketContext);
};
