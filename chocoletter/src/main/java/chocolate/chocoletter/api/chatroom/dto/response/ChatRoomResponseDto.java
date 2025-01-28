package chocolate.chocoletter.api.chatroom.dto.response;

public record ChatRoomResponseDto(Long roomId, String nickName) {
    public static ChatRoomResponseDto of(Long roomId, String nickName) {
        return new ChatRoomResponseDto(roomId, nickName);
    }
}
