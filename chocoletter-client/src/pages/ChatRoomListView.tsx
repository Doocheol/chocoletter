import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { GoBackButton } from "../components/common/GoBackButton";
import { getChatRooms } from "../services/chatApi";

interface ChatRoom {
    roomId: number;
    nickName: string;
    unreadCount?: number;
    lastMessage?: string;
}

const ChatRoonListView = () => {

    // TODO : 채팅리스트 API 불러오기 
    // 제일 최근에 온 채팅방 위로 올리기?
    const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
    const memberId = 9999 //✅ TODO 수정하기
    const navigate = useNavigate();

    // 더미 데이터 (나중에 서버에서 받아올 데이터)
    const dummyChatRooms = [
        { roomId: 9997, nickName: "예슬" },
        { roomId: 9998, nickName: "준희" },
        { roomId: 9999, nickName: "두철" },
    ];
    
    // 채팅방 목록 불러오기
    useEffect(() => {
        const loadChatRooms = async () => {
            try {
                const data = await getChatRooms();
                setChatRooms(data); // 상태 업데이트
            } catch (error) {
                console.error("채팅방 목록 불러오기 실패!", error);
                setChatRooms(dummyChatRooms); // ✅ todo 추후 삭제
            }
        };
        loadChatRooms();
    }, []);

    // 안읽은 채팅 개수 & 마지막 메세지 불러오기
    useEffect(() => {
        if (chatRooms.length > 0) {
            const loadLastMessages = async () => {
                try {
                    console.log("메시지 불러오는 중...");
                    const baseUrl = import.meta.env.VITE_CHAT_WEBSOCKET_URL;
                    const updatedRooms = await Promise.all(
                        chatRooms.map(async (room) => {
                            try {
                                const response = await axios.get(
                                    `${baseUrl}/api/v1/chat/${room.roomId}/${memberId}/last`
                                );

                                return {
                                    ...room,
                                    unreadCount: response.data?.count || 0,
                                    lastMessage: response.data?.Message || "",
                                };
                            } catch (error) {
                                console.error(`채팅방(${room.roomId}) 마지막 메시지 불러오기 실패!`, error);
                                return { ...room, unreadCount: 0 }; // 오류 시 기본값 유지
                            }
                        })
                    );

                    setChatRooms(updatedRooms);
                } catch (error) {
                    console.error("안 읽은 메시지 불러오기 실패!", error);
                }
            };

            loadLastMessages();
        }
    }, [chatRooms]);

    // const handleRoomClick = (room : ChatRoom) => {
    //     navigate(`/chat/room/${room.roomId}` }); // nickName을 state로 전달
    // };
    
    // 채팅방 입장 
    const handleRoomClick = (room: ChatRoom) => {
        console.log(room.roomId)
        navigate(`/chat/room/${room.roomId}`, { state: { roomId: room.roomId, nickName: room.nickName } }); // nickName을 state로 전달
    };


    return (
        // TODO : 스타일 추후에 파일 따로 빼기
        <div className="flex flex-col items-center justify-start min-h-screen min-w-screen relative bg-chocoletterGiftBoxBg overflow-hidden">
            {/* 나의 채팅방 목록 */}
            <div className="w-full md:max-w-sm h-[58px] px-4 py-[17px] bg-chocoletterPurpleBold flex flex-col justify-center items-center gap-[15px] fixed z-50">
                <div className="self-stretch justify-between items-center inline-flex">
                    <div className="w-6 h-6 justify-center items-centㄴer flex">
                        <GoBackButton />
                    </div>
                    <div className="text-center text-white text-2xl font-normal font-sans leading-snug">나의 채팅방 목록</div>
                    <div className="w-6 h-6" />
                </div>
            </div>
            {/* 채팅방 리스트 */}
            <div className="w-full max-w-[90%] flex flex-col space-y-[15px] justify-start items-stretch mt-[58px] pt-4" >
                {chatRooms.map((room, index) => (
                <div
                    key={index}
                    className="flex h-[71px] px-[20px] py-[10px] justify-between items-center self-stretch rounded-[15px] border border-black bg-white shadow-[0px_4px_0px_0px_rgba(0,0,0,0.25)] cursor-pointer hover:bg-gray-100"
                    onClick={() => handleRoomClick(room)}
                >
                    {/* 왼쪽 닉네임 + 채팅방 텍스트 */}
                    <div className="flex flex-row gap-1">
                        <p className="text-[18px] leading-[22px]">{room.nickName}</p>
                        <p className="text-[15px] leading-[22px] text-[#696A73]">님과의 채팅방</p>
                    </div>
                    
                    {/* 오른쪽 채팅 숫자 */}
                    {room?.unreadCount && room.unreadCount > 0 && (
                        <div className="w-8 h-6 bg-red-400 rounded-xl text-white text-center">
                            {room.unreadCount}
                        </div>
                    )}
                </div>
            ))}
            </div>
        </div>
    )
};

export default ChatRoonListView;