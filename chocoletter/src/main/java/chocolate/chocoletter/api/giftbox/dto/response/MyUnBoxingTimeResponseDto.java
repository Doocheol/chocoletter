package chocolate.chocoletter.api.giftbox.dto.response;

import lombok.Builder;

@Builder
public record MyUnBoxingTimeResponseDto(String unBoxingTime, String nickName) {
    public static MyUnBoxingTimeResponseDto of(String unBoxingTime, String nickName) {
        return MyUnBoxingTimeResponseDto.builder()
                .unBoxingTime(unBoxingTime)
                .nickName(nickName)
                .build();
    }
}
