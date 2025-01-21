package chocolate.chocoletter.api.giftbox.dto.response;

public record GiftCountResponseDto(Integer giftCount) {
    public static GiftCountResponseDto of(Integer giftCount) {
        return new GiftCountResponseDto(giftCount);
    }
}
