import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GoBackButton } from "../components/common/GoBackButton";
// import { getChatRooms } from "../api/chatRooms";

const ChatRoonListView = () => {

    // TODO : 채팅리스트 API 불러오기 (get : 닉네임, 채팅방번호, 안읽은 채팅 개수?)
    // 제일 최근에 온 채팅방 위로 올리기?
    // const [chatRooms, setChatRooms] = useState([]);
    const navigate = useNavigate();

    // useEffect(() => {
    //     const loadChatRooms = async () => {
    //         const data = await getChatRooms(); // API 호출
    //         setChatRooms(data); // 상태 업데이트
    //     };

    //     loadChatRooms();
    // }, []);

    // const handleRoomClick = (session) => {
    //     navigate(`/chat/${nickName}`); 
    // };

    const handleRoomClick = () => {
        navigate(`/chat/room/`); // 페이지 이동
    };

    // 더미 데이터 (나중에 서버에서 받아올 데이터)
    const chatRooms = [
        { nickName: "보라돌이", chatNum: 5 },
        { nickName: "뚜비", chatNum: 2 },
        { nickName: "나나", chatNum: 0 },
        { nickName: "뽀", chatNum: 1 },
    ];

    return (
        // TODO : 스타일 추후에 파일 따로 빼기
        <div className="flex flex-col items-center justify-start min-h-screen min-w-screen relative bg-chocoletterGiftBoxBg overflow-hidden">
            {/* 나의 채팅방 목록 */}
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
            <div className="w-full md:max-w-[343px] flex flex-col space-y-[15px] justify-start items-stretch mt-[58px] pt-4" >
                {chatRooms.map((room, index) => (
                <div
                    key={index}
                    className="flex h-[71px] px-[20px] py-[10px] justify-between items-center self-stretch rounded-[15px] border border-black bg-white shadow-[0px_4px_0px_0px_rgba(0,0,0,0.25)] cursor-pointer hover:bg-gray-100"
                    onClick={() => handleRoomClick()}
                >
                    {/* 왼쪽 닉네임 + 채팅방 텍스트 */}
                    <div className="flex flex-row gap-1">
                        <p className="text-[18px] leading-[22px]">{room.nickName}</p>
                        <p className="text-[15px] leading-[22px] text-[#696A73]">님의 채팅방</p>
                    </div>
                    
                    {/* 오른쪽 채팅 숫자 */}
                    {room.chatNum > 0 && (
                        <div className="w-8 h-6 bg-red-400 rounded-xl text-white text-center">
                            {room.chatNum}
                        </div>
                    )}
                </div>
            ))}
            </div>
        </div>
    )
};

export default ChatRoonListView;