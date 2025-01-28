package chocolate.chocoletter.api.chatroom.controller;

import chocolate.chocoletter.api.chatroom.dto.response.ChatRoomsResponseDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.http.ResponseEntity;

public interface ChatRoomSwagger {

    @Operation(
            summary = "채팅방 조회",
            description = "내가 속한 채팅방리스트를 조회합니다. 로그인한 사용자의 ID가 필요합니다."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "조회 성공",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ChatRoomsResponseDto.class)
                    )),
            @ApiResponse(responseCode = "401", description = "인증되지 않았습니다.")
    })
    ResponseEntity<?> findMyChatRooms();
}
