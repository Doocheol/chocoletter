package chocolate.chocoletter.api.giftbox.dto.response;

import chocolate.chocoletter.api.giftbox.domain.GiftBox;
import lombok.Builder;

@Builder
public record GiftBoxResponseDto(String name, Long giftBoxId, Integer giftCount) {
    public static GiftBoxResponseDto of(GiftBox giftBox) {
        return GiftBoxResponseDto.builder()
                .name(giftBox.getMember().getName())
                .giftBoxId(giftBox.getId())
                .giftCount(giftBox.getGiftCount())
                .build();
    }
}
