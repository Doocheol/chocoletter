package chocolate.chocoletter.api.chatroom.service;

import chocolate.chocoletter.api.chatroom.domain.ChatRoom;
import chocolate.chocoletter.api.chatroom.dto.response.ChatRoomResponseDto;
import chocolate.chocoletter.api.chatroom.dto.response.ChatRoomsResponseDto;
import chocolate.chocoletter.api.chatroom.repository.ChatRoomRepository;
import chocolate.chocoletter.api.gift.domain.Gift;
import chocolate.chocoletter.api.gift.repository.GiftRepository;
import chocolate.chocoletter.api.letter.service.LetterService;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ChatRoomService {
    private final ChatRoomRepository chatRoomRepository;
    private final GiftRepository giftRepository;
    private final LetterService letterService;

    public void saveChatRoom(Long hostId, Long guestId, Long hostGiftId, Long guestGiftId) {
        chatRoomRepository.save(ChatRoom.builder()
                .hostId(hostId)
                .guestId(guestId)
                .hostGiftId(hostGiftId)
                .guestGiftId(guestGiftId)
                .build());
    }

    public ChatRoomsResponseDto findMyChatRooms(Long memberId) {
        List<ChatRoomResponseDto> chatRooms = chatRoomRepository.findMyChatRooms(memberId)
                .stream()
                .map(chatRoom -> {
                    Gift guestGift = giftRepository.findGiftByIdOrThrow(chatRoom.getGuestGiftId());
                    Long receiverId = guestGift.getReceiverId();
                    String nickname;
                    if (receiverId.equals(memberId)) {
                        nickname = letterService.findNickNameByGiftId(guestGift.getId());
                    } else {
                        nickname = letterService.findNickNameByGiftId(chatRoom.getHostGiftId());
                    }
                    return ChatRoomResponseDto.of(chatRoom.getId(), nickname);
                })
                .collect(Collectors.toList());
        return ChatRoomsResponseDto.of(chatRooms);
    }


}
