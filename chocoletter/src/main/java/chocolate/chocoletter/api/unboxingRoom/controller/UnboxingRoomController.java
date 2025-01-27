package chocolate.chocoletter.api.unboxingRoom.controller;

import chocolate.chocoletter.api.unboxingRoom.dto.response.HasAccessUnboxingRoomResponseDto;
import chocolate.chocoletter.api.unboxingRoom.service.UnboxingRoomService;
import chocolate.chocoletter.common.annotation.DecryptedId;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api/v1/unboxing-room")
@RequiredArgsConstructor
public class UnboxingRoomController implements UnboxingRoomSwagger {

    private final UnboxingRoomService unboxingRoomService;

    @GetMapping("/{roomId}/verify")
    public ResponseEntity<?> hasAccessToUnboxingRoom(@PathVariable @DecryptedId Long roomId) {
        Long memberId = 1L;
        HasAccessUnboxingRoomResponseDto gift = unboxingRoomService.hasAccessToUnboxingRoom(memberId, roomId);
        return ResponseEntity.ok(gift);
    }

    @PatchMapping("{roomId}/end")
    public ResponseEntity<?> endUnBoxingRoom(@PathVariable @DecryptedId Long roomId) {
        Long memberId = 1L;
        unboxingRoomService.endUnBoxingRoom(memberId, roomId);
        return ResponseEntity.ok().build();
    }
}
