package chocolate.chocoletter.api.unboxingRoom.controller;

import chocolate.chocoletter.api.gift.dto.response.GiftDetailResponseDto;
import chocolate.chocoletter.api.unboxingRoom.service.UnboxingRoomService;
import chocolate.chocoletter.common.annotation.DecryptedId;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api/v1/unboxing-room")
@RequiredArgsConstructor
public class UnboxingRoomController implements UnboxingRoomSwagger {

    private final UnboxingRoomService unboxingRoomService;

    @GetMapping("/{roomId}/verify")
    public ResponseEntity<?> hasAccessToUnboxingRoom(@PathVariable @DecryptedId Long unboxingRoomId) {
        Long memberId = 1L;
        GiftDetailResponseDto gift = unboxingRoomService.hasAccessToUnboxingRoom(memberId, unboxingRoomId);
        return ResponseEntity.ok(gift);
    }
}
