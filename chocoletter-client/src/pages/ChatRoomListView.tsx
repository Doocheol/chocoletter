import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { memberIdAtom } from "../atoms/auth/userAtoms";
import { GoBackButton } from "../components/common/GoBackButton";
import { getChatRooms } from "../services/chatApi";
import Loading from "../components/common/Loading";
import useViewportHeight from "../hooks/useViewportHeight";
import { getUserInfo } from "../services/userInfo";

interface ChatRoom {
    roomId: string;
    nickName: string;
    unreadCount?: number;
    lastMessage?: string;
}

const ChatRoomListView = () => { 
    useViewportHeight();
    
    const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const memberId = useRecoilValue(memberIdAtom);
    const userInfo = getUserInfo();
    const navigate = useNavigate();
    
    // 채팅방 목록 불러오기
    useEffect(() => {

        if (!memberId) return;

        const loadChatRooms = async () => {
            setIsLoading(true);
            try {
                const data = await getChatRooms();
                setChatRooms(data.chatRooms); 
            } catch (error) {
                new Error("채팅방 목록 호출 중 에러 발생")
            } finally {
                setIsLoading(false); 
            }
        };
        loadChatRooms();
    }, []);

    // 안읽은 채팅 개수 & 마지막 메시지 불러오기
    useEffect(() => {
        if (!chatRooms || chatRooms.length === 0) return;
        
        const loadLastMessages = async () => {
            try {
                const baseUrl = import.meta.env.VITE_CHAT_API_URL;
                const updatedRooms = await Promise.all(
                    chatRooms.map(async (room) => {
                        try {
                            const response = await axios.get(
                                `${baseUrl}/api/v1/chat/${room.roomId}/${memberId}/last` , {
                                headers: {
                                    Authorization: `Bearer ${userInfo?.accessToken}`,
                                },
                                withCredentials: true,
                            }) 
                            return {
                                ...room,
                                unreadCount: response.data?.count || 0,
                                lastMessage: response.data?.message || "", 
                            };
                        } catch (error) {
                            return { ...room, unreadCount: 0 };
                        }
                    })
                );
                setChatRooms((prevRooms) => {
                    return JSON.stringify(prevRooms) !== JSON.stringify(updatedRooms) ? updatedRooms : prevRooms;
                });
            } catch (error) {
                return null;
            }
        };

        loadLastMessages();
    }, [JSON.stringify(chatRooms)]); 

    
    // 채팅방 입장
    const handleRoomClick = (room: ChatRoom) => {
        navigate(`/chat/room/${room.roomId}`, { state: { roomId: room.roomId, nickName: room.nickName } });
    };

    return (
        <div className="flex flex-col items-center justify-start min-h-screen min-w-screen relative bg-chocoletterGiftBoxBg overflow-hidden">
            {/* 상단바 */}
            <div className="w-full md:max-w-sm h-[58px] px-4 py-[17px] bg-chocoletterPurpleBold flex flex-col justify-center items-center gap-[15px] fixed z-50">
                <div className="self-stretch justify-between items-center inline-flex">
                    <div className="w-6 h-6 justify-center items-center flex">
                        <GoBackButton />
                    </div>
                    <div className="text-center text-white text-2xl font-normal font-sans leading-snug">나의 채팅방 목록</div>
                    <div className="w-6 h-6" />
                </div>
            </div>

            {/* 채팅방 리스트 */}
            <div className="w-full max-w-[90%] flex flex-col space-y-[15px] justify-start items-stretch mt-[58px] pt-4">
                {isLoading ? (
                    <Loading />
                ) : (
                    chatRooms && chatRooms.length > 0 ? (
                        chatRooms.map((room, index) => (
                            <div
                                key={room.roomId}
                                className="flex h-[71px] px-[20px] py-[10px] justify-between items-center self-stretch rounded-[15px] border border-black bg-white shadow-[0px_4px_0px_0px_rgba(0,0,0,0.25)] cursor-pointer hover:bg-gray-100"
                                onClick={() => handleRoomClick(room)}
                            >
                                {/* 왼쪽 닉네임 + 마지막 채팅 */}
                                <div className="flex flex-col">
                                    <div className="flex flex-row gap-1 mb-[3px]">
                                        <p className="text-[18px] leading-[22px]">{room.nickName}</p>
                                        <p className="text-[15px] leading-[22px] text-[#696A73]">님과의 채팅방</p>
                                    </div>
                                    <p className="font-[Pretendard] text-[12px] text-[#696A73] overflow-hidden whitespace-nowrap text-ellipsis">
                                        {room.lastMessage ? (
                                            room.lastMessage
                                        ) : (
                                            <span className="text-[#A0A0A0]">채팅을 시작해보세요!</span>
                                        )}
                                    </p>
                                </div>

                                {/* 오른쪽 채팅 숫자 */}
                                {(room.unreadCount ?? 0) > 0 && (
                                    <div className="w-8 h-6 bg-red-500 rounded-xl text-white text-center">
                                        {room.unreadCount}
                                    </div>
                                )}
                            </div>
                        ))
                ) : (
                    <p className="text-center text-gray-500">채팅방이 없습니다.</p>
                )
                )}
            </div>
        </div>
    );
};

export default ChatRoomListView; 