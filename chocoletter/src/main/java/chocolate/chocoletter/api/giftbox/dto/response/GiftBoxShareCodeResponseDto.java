package chocolate.chocoletter.api.giftbox.dto.response;

import chocolate.chocoletter.api.giftbox.domain.GiftBox;
import lombok.Builder;

@Builder
public record GiftBoxShareCodeResponseDto(String shareCode) {
    public static GiftBoxShareCodeResponseDto of(GiftBox giftBox) {
        return GiftBoxShareCodeResponseDto.builder()
                .shareCode(giftBox.getShareCode())
                .build();
    }
}
