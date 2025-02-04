package chocolate.chocoletter.api.giftbox.dto.response;

import chocolate.chocoletter.api.giftbox.domain.GiftBox;
import lombok.Builder;

@Builder
public record GiftBoxResponseDto(String name, String giftBoxId, Integer type, Integer giftCount) {
    public static GiftBoxResponseDto of(GiftBox giftBox, String encryptedGiftBoxId) {
        return GiftBoxResponseDto.builder()
                .name(giftBox.getMember().getName())
                .giftBoxId(encryptedGiftBoxId)
                .type(giftBox.getType())
                .giftCount(giftBox.getGiftCount())
                .build();
    }
}
