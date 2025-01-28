package chocolate.chocoletter.api.chatroom.service;

import chocolate.chocoletter.api.chatroom.domain.ChatRoom;
import chocolate.chocoletter.api.chatroom.repository.ChatRoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ChatRoomService {
    private final ChatRoomRepository chatRoomRepository;

    public void saveChatRoom(Long hostId, Long guestId) {
        chatRoomRepository.save(ChatRoom.builder()
                .hostId(hostId)
                .guestId(guestId)
                .build());
    }
}
