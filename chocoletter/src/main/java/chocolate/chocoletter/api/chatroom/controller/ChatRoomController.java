package chocolate.chocoletter.api.chatroom.controller;

import chocolate.chocoletter.api.chatroom.dto.response.ChatRoomsResponseDto;
import chocolate.chocoletter.api.chatroom.service.ChatRoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/chat-room")
@RequiredArgsConstructor
public class ChatRoomController implements ChatRoomSwagger {
    private final ChatRoomService chatRoomService;

    @GetMapping("/all")
    public ResponseEntity<?> findMyChatRooms() {
        // 로그인 한 멤버 찾아오기
        Long memberId = 1L;
        ChatRoomsResponseDto myChatRooms = chatRoomService.findMyChatRooms(memberId);
        return ResponseEntity.ok(myChatRooms);
    }

}
